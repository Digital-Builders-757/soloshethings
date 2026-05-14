import Link from 'next/link'

/** Public pricing / membership overview (PUBLIC_PRIVATE_SURFACE_CONTRACT — marketing). */
export default function PricingPage() {
  return (
    <main className="shell-inline mx-auto w-full max-w-2xl px-4 py-14 sm:py-20">
      <p className="eyebrow text-xs tracking-[0.22em] text-[#e34b16]">Membership</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl">Solo SHE Stories</h1>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        Unlimited reading, saving, and story sharing on the member community—after a 7‑day trial—on a simple monthly
        plan.
      </p>

      <div className="surface-card mt-10 rounded-[1.5rem] border border-[#ead8c2] p-6 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="font-serif text-4xl font-bold text-[#7a331b]">
            $3.99
            <span className="text-xl font-semibold text-[#6d5849]"> / month</span>
          </span>
          <span className="rounded-full bg-[#fff8ec] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#7a331b] ring-1 ring-[#ead8c2]">
            7‑day trial
          </span>
        </div>
        <ul className="mt-6 space-y-3 text-sm text-[#3a3a3a]">
          <li>Full access to browse and read member stories</li>
          <li>Submit and manage your own stories and photos</li>
          <li>Save stories to revisit later</li>
          <li>Cancel anytime through Stripe</li>
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/signup?redirectTo=/subscribe"
            className="cta-primary inline-flex min-h-12 items-center justify-center rounded-full px-8 py-3 text-center text-sm font-semibold"
          >
            Create account
          </Link>
          <Link
            href="/login?redirectTo=/subscribe"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-8 py-3 text-sm font-semibold text-[#7a331b] transition hover:border-[#d9c4a8]"
          >
            Sign in to subscribe
          </Link>
        </div>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
        Billing is processed by Stripe. After the trial, members without an active subscription have limited community
        access (see membership terms in the app after sign-in).
      </p>
    </main>
  )
}
