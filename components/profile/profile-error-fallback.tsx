/**
 * Shown when a signed-in user has no profile row after one bounded repair.
 * No redirects — avoids loops; sign-out provides a clean retry path.
 */

import Link from 'next/link'

import { LogoutButton } from '@/components/nav/logout-button'

type ProfileErrorFallbackProps = {
  /** Slight copy tweak depending on where the user landed */
  context: 'dashboard' | 'profile'
}

export function ProfileErrorFallback({ context }: ProfileErrorFallbackProps) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <div className="surface-card rounded-[1.5rem] px-5 py-9 text-center sm:px-8 sm:py-11">
        <h1 className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl">
          We couldn&apos;t finish setting up your account
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {context === 'profile'
            ? "Your profile record is missing or could not be created. This is unusual—you won't be sent in a redirect loop from here."
            : 'Your dashboard needs a profile record we could not create automatically. Nothing here will bounce you between pages.'}{' '}
          <strong className="font-medium text-[#7a331b]">Sign out and sign back in</strong> to try again, or contact us if
          this continues.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <LogoutButton label="Sign out & try again" variant="primary" className="min-h-12 w-full sm:w-auto" />
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
