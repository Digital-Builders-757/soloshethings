/**
 * Subscription entitlement from Supabase ONLY (BILLING_STRIPE_CONTRACT / PUBLIC_PRIVATE_SURFACE_CONTRACT).
 */
import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { subscription_status } from '@/types/database'

export type MembershipTier = 'full' | 'limited'

type SubscriptionGateRow = {
  status: subscription_status
  trial_end: string | null
  current_period_end: string | null
}

/** Full tier: active within paid period, or valid Stripe trial (`trialing` + trial_end in future). */
export function membershipFromSubscriptionRow(
  row: SubscriptionGateRow | null,
  now: Date = new Date(),
): MembershipTier {
  if (!row) return 'limited'

  const trialValid = row.trial_end && new Date(row.trial_end) > now

  if (row.status === 'trialing') {
    return trialValid ? 'full' : 'limited'
  }

  if (row.status === 'active') {
    const periodOk = row.current_period_end && new Date(row.current_period_end) > now
    return periodOk ? 'full' : 'limited'
  }

  return 'limited'
}

export async function getMembershipTier(userId: string): Promise<MembershipTier> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_end, current_period_end')
    .eq('user_id', userId)
    .maybeSingle()

  return membershipFromSubscriptionRow(data as SubscriptionGateRow | null)
}
