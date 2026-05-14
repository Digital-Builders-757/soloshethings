import Link from 'next/link'
import { redirect } from 'next/navigation'

import { captureProductSignal } from '@/lib/analytics/product-signals'
import { getMembershipTier } from '@/lib/billing/entitlements'
import { getUser } from '@/lib/supabase/server'

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent('/subscribe/success')}`)
  }

  const sp = await searchParams
  const stripeSessionEcho = `${sp.session_id ?? ''}`.trim()

  const tier = await getMembershipTier(user.id)

  /** Avoid counting bare revisits — only Stripe-happy paths include `session_id`. */
  if (stripeSessionEcho) {
    captureProductSignal('membership_checkout_return', { tier_gate: tier })
  }

  return (
    <div className="shell-inline mx-auto w-full max-w-lg py-10 sm:py-14">
      <h1 className="font-serif text-2xl font-bold text-[#7a331b] sm:text-3xl">Thanks for checking out</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Stripe is finishing your subscription. We update access from secure webhooks—this can take a minute. Refresh
        the dashboard or billing page if status does not change right away.
      </p>
      <p className="mt-4 text-sm text-[#7a331b]">
        Current gate: <span className="font-semibold">{tier === 'full' ? 'Full access' : 'Limited (webhook pending)'}</span>
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/subscribe" className="cta-primary inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold">
          View billing status
        </Link>
        <Link
          href="/places"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 py-3 text-sm font-semibold text-[#7a331b]"
        >
          Browse stories
        </Link>
      </div>
    </div>
  )
}
