import Link from 'next/link'
import { redirect } from 'next/navigation'

import { startMembershipCheckout } from '@/app/actions/billing'
import { getMembershipTier, membershipFromSubscriptionRow } from '@/lib/billing/entitlements'
import { createClient, getUser } from '@/lib/supabase/server'

type Search = { notice?: string; reason?: string }

export default async function SubscribePage({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent('/subscribe')}`)
  }

  const sp = await searchParams
  const tier = await getMembershipTier(user.id)
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('subscriptions')
    .select('status, trial_end, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  const derived = membershipFromSubscriptionRow(row)

  return (
    <div className="shell-inline mx-auto w-full max-w-lg py-10 sm:py-14">
      <h1 className="font-serif text-2xl font-bold text-[#7a331b] sm:text-3xl">Membership</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Solo SHE Things uses Stripe for subscriptions. Your access is based on the subscription row in our database
        (updated from Stripe webhooks)—never from the browser.
      </p>

      {sp.notice === 'config' ? (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Billing is not fully configured (missing price id). Add <code className="font-mono text-xs">STRIPE_PRICE_ID</code>{' '}
          to the server environment.
        </p>
      ) : null}
      {sp.notice === 'checkout_failed' ? (
        <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          Checkout could not be started. Confirm <code className="font-mono text-xs">STRIPE_SECRET_KEY</code> and try
          again.
        </p>
      ) : null}
      {sp.reason === 'read_cap' ? (
        <p className="mt-6 rounded-2xl border border-[#ead8c2] bg-[#fffaf4] px-4 py-3 text-sm text-[#7a331b]">
          Free members can open up to three other members&apos; stories per day (UTC). Subscribe for unlimited reading.
        </p>
      ) : null}

      <div className="surface-card mt-8 rounded-[1.5rem] border border-[#ead8c2] p-6 text-sm sm:p-8">
        <p className="font-semibold text-[#7a331b]">Current access</p>
        <p className="mt-2 text-muted-foreground">
          {tier === 'full' ? (
            <>You have full member access (active trial or paid period).</>
          ) : (
            <>Limited community access—upgrade to read without daily caps, publish stories, and save posts.</>
          )}
        </p>
        {row ? (
          <dl className="mt-4 space-y-1 font-mono text-xs text-[#6d5849]">
            <div>
              <dt className="inline text-muted-foreground">status </dt>
              <dd className="inline">{row.status}</dd>
            </div>
            <div>
              <dt className="inline text-muted-foreground">computed_tier </dt>
              <dd className="inline">{derived}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground">No subscription row yet—complete checkout to create one.</p>
        )}

        {tier === 'full' ? (
          <Link
            href="/dashboard"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 py-3 text-sm font-semibold text-[#7a331b]"
          >
            Back to dashboard
          </Link>
        ) : (
          <form action={startMembershipCheckout} className="mt-6">
            <button
              type="submit"
              className="cta-primary min-h-12 w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto"
            >
              Start checkout (7‑day trial)
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Public pricing details: <Link href="/pricing" className="font-semibold text-[#e34b16] underline-offset-2 hover:underline">Membership overview</Link>
        .
      </p>
    </div>
  )
}
