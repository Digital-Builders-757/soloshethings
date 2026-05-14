/**
 * Stripe webhook event handling with ledger idempotency (BILLING_STRIPE_CONTRACT.md).
 * Runs with Supabase service role only.
 */
import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

import { getStripe } from '@/lib/stripe'
import { logServerFailure } from '@/lib/server-log'
import type { Database, Json, subscription_status } from '@/types/database'

const IGNORED_EVENTS = new Set([
  'customer.created',
  'customer.updated',
  'invoice.created',
  'invoice.finalized',
  'payment_intent.created',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.failed',
])

const PROCESSING_STALE_MS = 5 * 60 * 1000

function mapStripeStatus(status: Stripe.Subscription.Status): subscription_status {
  switch (status) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
      return 'past_due'
    case 'canceled':
      return 'canceled'
    case 'incomplete':
      return 'incomplete'
    case 'unpaid':
      return 'past_due'
    case 'incomplete_expired':
      return 'incomplete'
    case 'paused':
      return 'active'
    default:
      return 'canceled'
  }
}

function stripeCustomerId(customer: Stripe.Subscription['customer']): string {
  return typeof customer === 'string' ? customer : customer.id
}

async function upsertSubscriptionRow(
  admin: SupabaseClient<Database>,
  sub: Stripe.Subscription,
  userId: string,
) {
  const row: Database['public']['Tables']['subscriptions']['Insert'] = {
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: stripeCustomerId(sub.customer),
    status: mapStripeStatus(sub.status),
    trial_start: sub.trial_start ? new Date(sub.trial_start * 1000).toISOString() : null,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
  }

  const { error } = await admin.from('subscriptions').upsert(row, { onConflict: 'stripe_subscription_id' })
  if (error) throw error
}

function resolveUserIdFromStripeSubscription(sub: Stripe.Subscription): string | null {
  const meta = sub.metadata?.supabase_user_id
  return typeof meta === 'string' && meta.length > 0 ? meta : null
}

async function upsertSubscriptionFromStripeSubscription(
  admin: SupabaseClient<Database>,
  sub: Stripe.Subscription,
): Promise<void> {
  let userId = resolveUserIdFromStripeSubscription(sub)
  if (!userId) {
    const { data: existing } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', sub.id)
      .maybeSingle()
    userId = existing?.user_id ?? null
  }

  if (!userId) {
    logServerFailure({
      category: 'webhook',
      operation: 'stripe.subscriptionMissingUser',
      cause: new Error('Missing supabase_user_id and DB row'),
      context: { stripeSubscriptionId: sub.id },
    })
    return
  }

  await upsertSubscriptionRow(admin, sub, userId)
}

async function dispatchStripeEvent(admin: SupabaseClient<Database>, event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') return
      const userIdRaw = session.client_reference_id ?? session.metadata?.supabase_user_id
      if (!userIdRaw || typeof userIdRaw !== 'string') {
        throw new Error('checkout_session_missing_user_reference')
      }
      const subRef = session.subscription
      if (typeof subRef !== 'string') return
      const fullSub = await getStripe().subscriptions.retrieve(subRef)
      await upsertSubscriptionRow(admin, fullSub, userIdRaw)
      return
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      await upsertSubscriptionFromStripeSubscription(admin, event.data.object as Stripe.Subscription)
      return
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { error } = await admin
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', sub.id)
      if (error) throw error
      return
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.subscription
      if (typeof subId !== 'string') return
      const fullSub = await getStripe().subscriptions.retrieve(subId)
      await upsertSubscriptionFromStripeSubscription(admin, fullSub)
      return
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.subscription
      if (typeof subId !== 'string') return
      const { error } = await admin
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subId)
      if (error) throw error
      return
    }
    case 'customer.subscription.trial_will_end':
      return
    default:
      return
  }
}

export async function handleStripeWebhookEvent(admin: SupabaseClient<Database>, event: Stripe.Event): Promise<void> {
  const { data: row } = await admin
    .from('stripe_webhook_ledger')
    .select('event_id, processed, processing, retry_count, updated_at')
    .eq('event_id', event.id)
    .maybeSingle()

  if (row?.processed) return

  if (row?.processing) {
    const updatedAt = row.updated_at ? new Date(row.updated_at).getTime() : 0
    if (Date.now() - updatedAt <= PROCESSING_STALE_MS) {
      return
    }
    await admin.from('stripe_webhook_ledger').update({ processing: false }).eq('event_id', event.id)
  }

  const startingRetry = row?.retry_count ?? 0

  if (!row) {
    const { error: insErr } = await admin.from('stripe_webhook_ledger').insert({
      event_id: event.id,
      event_type: event.type,
      processed: false,
      processing: true,
      retry_count: startingRetry,
      event_data: event as unknown as Json,
    })
    if (insErr) throw insErr
  } else {
    const { error: updErr } = await admin
      .from('stripe_webhook_ledger')
      .update({ processing: true, error_message: null })
      .eq('event_id', event.id)
    if (updErr) throw updErr
  }

  try {
    if (IGNORED_EVENTS.has(event.type)) {
      await admin
        .from('stripe_webhook_ledger')
        .update({
          processed: true,
          processing: false,
          processed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq('event_id', event.id)
      return
    }

    await dispatchStripeEvent(admin, event)

    await admin
      .from('stripe_webhook_ledger')
      .update({
        processed: true,
        processing: false,
        processed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq('event_id', event.id)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'stripe_webhook_error'
    await admin
      .from('stripe_webhook_ledger')
      .update({
        processing: false,
        error_message: msg,
        retry_count: startingRetry + 1,
      })
      .eq('event_id', event.id)
    throw e
  }
}
