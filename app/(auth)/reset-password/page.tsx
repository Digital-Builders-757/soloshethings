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
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams

  // Recovery email lands here with ?code=xxxx.
  // Delegate the PKCE exchange to the /auth/callback route handler (which can
  // explicitly attach session cookies to the redirect response), passing
  // next=/reset-password so it returns here after a successful exchange.
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&next=/reset-password`)
  }

  // No code — verify an active recovery session was established by the callback.
  const user = await getUser()

  if (!user) {
    redirect('/forgot-password?notice=link_expired')
  }

  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
