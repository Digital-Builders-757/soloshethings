import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { handleStripeWebhookEvent } from '@/lib/billing/stripe-webhook-processor'
import { logServerFailure } from '@/lib/server-log'
import { getStripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  const rawBody = await request.text()

  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (e) {
    logServerFailure({ category: 'webhook', operation: 'stripe.verify', cause: e })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    let admin
    try {
      admin = createServiceRoleClient()
    } catch (srErr) {
      logServerFailure({ category: 'webhook', operation: 'stripe.serviceRole', cause: srErr })
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 503 })
    }

    await handleStripeWebhookEvent(admin, event)
    return NextResponse.json({ received: true })
  } catch (e) {
    logServerFailure({
      category: 'webhook',
      operation: 'stripe.handle',
      cause: e,
      context: { eventId: event.id, eventType: event.type },
    })
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
