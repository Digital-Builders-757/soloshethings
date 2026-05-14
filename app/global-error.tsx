'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
          <div
            className="rounded-[1.5rem] border border-[#ead8c2] bg-[#fffaf4] px-5 py-9 text-center shadow-sm sm:px-8 sm:py-11"
            role="alert"
            aria-labelledby="global-error-title"
          >
            <h1
              id="global-error-title"
              className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl"
            >
              We hit a snag
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The app could not load correctly. Please reload the page. If you contact support, include the
              reference below.
            </p>
            {error.digest ? (
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Reference: <span className="select-all">{error.digest}</span>
              </p>
            ) : null}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reset}
                className="min-h-12 rounded-full bg-[#e34b16] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(227,75,22,0.3)] transition hover:bg-[#c74010]"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
