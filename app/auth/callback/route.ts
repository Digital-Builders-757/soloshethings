/**
 * Auth Callback Route Handler
 *
 * Handles the PKCE code exchange for Supabase auth flows.
 * Currently used by: password reset (/forgot-password → email link → here → /reset-password)
 *
 * Flow:
 *   1. Supabase sends a recovery email with a link pointing to this handler
 *   2. This handler exchanges the one-time code for a session
 *   3. Redirects to the `next` param (validated as a safe internal path)
 *   4. On failure, redirects to /forgot-password?notice=link_expired
 *
 * Reference: docs/contracts/AUTH_CONTRACT.md
 */

import { getSafeInternalRedirectPath } from '@/lib/auth-redirects'
import { logServerFailure } from '@/lib/server-log'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = getSafeInternalRedirectPath(searchParams.get('next'), '/dashboard')

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        return NextResponse.redirect(new URL(next, origin))
      }

      logServerFailure({
        category: 'auth',
        operation: 'auth.callback.exchangeCodeForSession',
        cause: error,
      })
    } catch (err) {
      logServerFailure({
        category: 'auth',
        operation: 'auth.callback.exchangeCodeForSession',
        cause: err,
      })
    }
  }

  // Code missing or exchange failed — send user to re-request a link
  return NextResponse.redirect(
    new URL('/forgot-password?notice=link_expired', origin)
  )
}
