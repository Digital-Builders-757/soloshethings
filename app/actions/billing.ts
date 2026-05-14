'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { captureProductSignal } from '@/lib/analytics/product-signals'
import { getMembershipTier } from '@/lib/billing/entitlements'
import { logServerFailure } from '@/lib/server-log'
import { getStripe } from '@/lib/stripe'
import { getUser } from '@/lib/supabase/server'

/**
 * Opens Stripe Checkout (subscription mode, 7-day trial per billing contract).
 * Redirect-only on success paths and Stripe-hosted URL.
 */
export async function startMembershipCheckout(): Promise<void> {
  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent('/subscribe')}`)
  }

  const priceId = process.env.STRIPE_PRICE_ID?.trim()
  if (!priceId) {
    logServerFailure({
      category: 'mutation',
      operation: 'startMembershipCheckout.misconfig',
      cause: new Error('STRIPE_PRICE_ID unset'),
      context: { userId: user.id },
    })
    redirect('/subscribe?notice=config')
  }

  if ((await getMembershipTier(user.id)) === 'full') {
    redirect('/dashboard?notice=membership_active')
  }

  const headerStore = await headers()
  const origin =
    headerStore.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL?.trim() ?? 'http://localhost:3000'

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin.replace(/\/$/, '')}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin.replace(/\/$/, '')}/subscribe`,
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: user.id },
      },
      metadata: { supabase_user_id: user.id },
    })

    const url = session.url
    if (!url) {
      throw new Error('checkout_missing_url')
    }

    captureProductSignal('membership_checkout_started', {})

    redirect(url)
  } catch (e) {
    logServerFailure({
      category: 'mutation',
      operation: 'startMembershipCheckout.stripe',
      cause: e,
      context: { userId: user.id },
    })
    redirect('/subscribe?notice=checkout_failed')
  }
}
