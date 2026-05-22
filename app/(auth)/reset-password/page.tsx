/**
 * Reset Password Page
 *
 * Route: /reset-password
 * Follows: docs/contracts/AUTH_CONTRACT.md
 *
 * Two entry modes:
 *
 * 1. Via recovery email link — Supabase delivers the PKCE code directly here:
 *      /reset-password?code=xxxx
 *    The page detects the code and forwards to /auth/callback, which does the
 *    PKCE exchange and attaches session cookies to the redirect response, then
 *    returns here. On the second visit there is no code and a live session exists.
 *
 * 2. Already has a recovery session — no code in URL, getUser() succeeds,
 *    the password form is rendered.
 *
 * If neither condition is met (no code, no session) the user is sent back to
 * /forgot-password to request a fresh link.
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { ResetPasswordForm } from './reset-password-form'

function ResetPasswordFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <p className="text-sm font-semibold text-[#6d5849]">Loading…</p>
    </main>
  )
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string
    // TEMP DEBUG — REMOVE AFTER FIXED
    debug_error?: string
    debug_cookies?: string
    debug_session?: string
  }>
}) {
  const { code, debug_error, debug_cookies, debug_session } = await searchParams

  // TEMP DEBUG — REMOVE AFTER FIXED
  console.log('[reset-password] code present:', Boolean(code))
  console.log('[reset-password] debug_error:', debug_error ?? 'none')

  // Recovery email lands here with ?code=xxxx.
  // Delegate the PKCE exchange to the /auth/callback route handler (which can
  // explicitly attach session cookies to the redirect response), passing
  // next=/reset-password so it returns here after a successful exchange.
  if (code) {
    // TEMP DEBUG — REMOVE AFTER FIXED
    console.log('[reset-password] forwarding code to /auth/callback for PKCE exchange')
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&next=/reset-password`)
  }

  // TEMP DEBUG — REMOVE AFTER FIXED
  // If /auth/callback redirected here with a debug_error, surface it visibly
  // in the browser instead of silently bouncing to /forgot-password.
  // This panel must be checked BEFORE the !user redirect below.
  if (debug_error) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border-2 border-red-400 bg-red-50 text-red-900">
          <div className="border-b border-red-300 bg-red-100 px-5 py-3">
            <p className="font-mono text-sm font-bold">
              ⚠ TEMP DEBUG — exchangeCodeForSession failed
            </p>
            <p className="mt-0.5 font-mono text-xs text-red-700">
              Remove this panel once the recovery flow is working.
            </p>
          </div>

          <dl className="divide-y divide-red-200 font-mono text-sm">
            <div className="grid grid-cols-[10rem_1fr] gap-2 px-5 py-3">
              <dt className="font-semibold">Exchange error</dt>
              <dd className="break-all">{decodeURIComponent(debug_error)}</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-2 px-5 py-3">
              <dt className="font-semibold">Cookies captured</dt>
              <dd>{debug_cookies ?? '0'}</dd>
            </div>
            <div className="grid grid-cols-[10rem_1fr] gap-2 px-5 py-3">
              <dt className="font-semibold">Session from exchange</dt>
              <dd>{debug_session ?? 'false'}</dd>
            </div>
          </dl>

          <div className="px-5 py-4">
            <a
              href="/forgot-password"
              className="text-sm font-semibold text-red-800 underline underline-offset-2 hover:text-red-900"
            >
              ← Request a new reset link
            </a>
          </div>
        </div>
      </main>
    )
  }

  // No code — verify an active recovery session was established by the callback.
  const user = await getUser()

  // TEMP DEBUG — REMOVE AFTER FIXED
  console.log('[reset-password] getUser result:', user ? `userId=${user.id}` : 'null — no session')

  if (!user) {
    redirect('/forgot-password?notice=link_expired')
  }

  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
