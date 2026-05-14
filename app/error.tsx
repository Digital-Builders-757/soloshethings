'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    void import('@sentry/nextjs').then(({ captureException }) => {
      captureException(error)
    })
  }, [error])

  return (
    <div className="mx-auto w-full max-w-lg shell-inline py-10 sm:py-14">
      <div
        className="surface-card rounded-[1.5rem] px-5 py-9 text-center sm:px-8 sm:py-11"
        role="alert"
        aria-labelledby="route-error-title"
      >
        <h1
          id="route-error-title"
          className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl"
        >
          Something went wrong on this page
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t finish loading this screen. Your data is likely safe—this is usually a temporary
          glitch or a bug we need to fix.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: <span className="select-all">{error.digest}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="cta-primary min-h-12 w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 py-3 text-sm font-semibold text-[#7a331b] transition hover:border-[#d9c4a8] sm:w-auto"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
