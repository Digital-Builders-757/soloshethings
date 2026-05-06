/**
 * Shown when a signed-in user has no profile row after bounded repair.
 * Stays on one screen — no redirects — so we never bounce between /dashboard and /profile.
 */

import Link from 'next/link'

import { LogoutButton } from '@/components/nav/logout-button'
import { RetryPageButton } from '@/components/profile/retry-page-button'

type ProfileErrorFallbackProps = {
  context: 'dashboard' | 'profile'
  /** Confirms which account is affected (same session you see in the nav). */
  userEmail?: string | null
}

export function ProfileErrorFallback({ context, userEmail }: ProfileErrorFallbackProps) {
  return (
    <div className="mx-auto w-full max-w-lg shell-inline py-10 sm:py-14">
      <div
        className="surface-card rounded-[1.5rem] px-5 py-9 text-center sm:px-8 sm:py-11"
        role="alert"
        aria-labelledby="profile-fallback-title"
      >
        <h1
          id="profile-fallback-title"
          className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl"
        >
          We couldn&apos;t finish setting up your account
        </h1>
        {userEmail ? (
          <p className="mt-3 text-xs font-medium text-[#6d5849]">
            Signed in as <span className="text-[#7a331b]">{userEmail}</span>
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The app tried to create your profile once automatically (bounded repair). If something still
          blocked it—network, permissions, or a duplicate username—you&apos;ll stay on this screen so we
          don&apos;t send you in circles.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {context === 'profile'
            ? 'Use reload to run another single repair attempt in a fresh request, or sign out and back in.'
            : 'You can open My profile from the nav to see the same recovery options, or use the links below.'}{' '}
          If this keeps happening, contact support with the email above.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <RetryPageButton />
          <LogoutButton label="Sign out & try again" variant="primary" className="min-h-12 w-full sm:w-auto" />
          {context === 'profile' ? (
            <Link
              href="/dashboard"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16] sm:w-auto"
            >
              My dashboard
            </Link>
          ) : (
            <Link
              href="/profile"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16] sm:w-auto"
            >
              My profile
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16] sm:w-auto"
          >
            Contact support
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center text-sm font-semibold text-[#6d5849] underline-offset-4 hover:text-[#e34b16] hover:underline sm:w-auto sm:px-3"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
