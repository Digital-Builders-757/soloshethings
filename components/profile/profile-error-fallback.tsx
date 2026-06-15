/**
 * Shown when a signed-in user has no profile row after bounded repair.
 * Stays on one screen — no redirects — so we never bounce between /dashboard and /profile.
 */

import Link from 'next/link'

import { LogoutButton } from '@/components/nav/logout-button'
import { ErrorRecoveryCard } from '@/components/ui/error-recovery-card'
import { RetryPageButton } from '@/components/profile/retry-page-button'

type ProfileErrorFallbackProps = {
  context: 'dashboard' | 'profile'
  /** Confirms which account is affected (same session you see in the nav). */
  userEmail?: string | null
}

const linkClassName =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16] sm:w-auto'

export function ProfileErrorFallback({ context, userEmail }: ProfileErrorFallbackProps) {
  const contextHint =
    context === 'profile'
      ? 'Use reload to run another single repair attempt in a fresh request, or sign out and back in.'
      : 'You can open My profile from the nav to see the same recovery options, or use the links below.'

  return (
    <ErrorRecoveryCard
      id="profile-fallback"
      title="We couldn't finish setting up your account"
      supplementary={
        userEmail ? (
          <p className="mt-3 text-xs font-medium text-[#6d5849]">
            Signed in as <span className="text-[#7a331b]">{userEmail}</span>
          </p>
        ) : null
      }
      description={`The app tried to create your profile once automatically (bounded repair). If something still blocked it—network, permissions, or a duplicate username—you'll stay on this screen so we don't send you in circles. ${contextHint} If this keeps happening, contact support with the email above.`}
    >
      <RetryPageButton />
      <LogoutButton label="Sign out & try again" variant="primary" className="min-h-12 w-full sm:w-auto" />
      {context === 'profile' ? (
        <Link href="/dashboard" className={linkClassName}>
          My dashboard
        </Link>
      ) : (
        <Link href="/profile" className={linkClassName}>
          My profile
        </Link>
      )}
      <Link href="/contact" className={linkClassName}>
        Contact support
      </Link>
      <Link
        href="/"
        className="inline-flex min-h-12 w-full items-center justify-center text-sm font-semibold text-[#6d5849] underline-offset-4 hover:text-[#e34b16] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16] sm:w-auto sm:px-3"
      >
        Back to home
      </Link>
    </ErrorRecoveryCard>
  )
}
