'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { ErrorRecoveryCard } from '@/components/ui/error-recovery-card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return
    void import('@sentry/nextjs').then(({ captureException }) => {
      captureException(error)
    })
  }, [error])

  return (
    <ErrorRecoveryCard
      id="route-error"
      title="Something went wrong on this page"
      description="We couldn't finish loading this screen. Your data is likely safe—this is usually a temporary glitch or a bug we need to fix."
      digest={error.digest}
    >
      <button
        type="button"
        onClick={reset}
        className="cta-primary min-h-12 w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto"
      >
        Try again
      </button>
      <Link
        href="/"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 py-3 text-sm font-semibold text-[#7a331b] transition hover:border-[#d9c4a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16] sm:w-auto"
      >
        Go home
      </Link>
    </ErrorRecoveryCard>
  )
}
