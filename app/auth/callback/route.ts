/**
 * Auth Callback Route Handler
 *
 * Handles the PKCE code exchange for Supabase auth flows.
 * Currently used by: password reset (/reset-password?code= → here → /reset-password)
 *
 * WHY THIS FILE CREATES ITS OWN SUPABASE CLIENT:
 * The shared createClient() in lib/supabase/server.ts uses the get/set/remove
 * cookie API. In a Route Handler, cookies set via cookieStore.set() are NOT
 * guaranteed to propagate to a manually returned NextResponse.redirect().
 * We use the getAll/setAll pattern here to explicitly capture every cookie
 * Supabase writes during exchangeCodeForSession(), then attach them directly
 * to the redirect response so the browser receives them.
 *
 * Reference: docs/contracts/AUTH_CONTRACT.md
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { getSafeInternalRedirectPath } from '@/lib/auth-redirects'
import { logServerFailure } from '@/lib/server-log'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = getSafeInternalRedirectPath(searchParams.get('next'), '/dashboard')

  // TEMP DEBUG — REMOVE AFTER FIXED
  console.log('[auth/callback] code present:', Boolean(code), '| next:', next)

  if (code) {
    const capturedCookies: Array<{
      name: string
      value: string
      options: CookieOptions
    }> = []

    try {
      const cookieStore = await cookies()

      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                capturedCookies.push({ name, value, options })
                try {
                  cookieStore.set(name, value, options)
                } catch {
                  // Ignored — explicit response attachment below is the reliable path
                }
              })
            },
          },
        }
      )

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      // TEMP DEBUG — REMOVE AFTER FIXED
      console.log('[auth/callback] exchange error:', error?.message ?? 'none')
      console.log('[auth/callback] session userId:', data?.user?.id ?? 'none')
      console.log('[auth/callback] cookies captured:', capturedCookies.length)

      if (!error) {
        const response = NextResponse.redirect(new URL(next, origin))

        // Explicitly attach session cookies to the redirect response.
        capturedCookies.forEach(({ name, value, options }) => {
          const { encode: _encode, ...cookieOpts } = options
          response.cookies.set(name, value, cookieOpts)
        })

        return response
      }

      logServerFailure({
        category: 'auth',
        operation: 'auth.callback.exchangeCodeForSession',
        cause: error,
      })

      // TEMP DEBUG — REMOVE AFTER FIXED
      // Redirect to /reset-password with visible error instead of silently
      // bouncing to /forgot-password so the exact failure is readable in the browser.
      const debugUrl = new URL('/reset-password', origin)
      debugUrl.searchParams.set('debug_error', error.message)
      debugUrl.searchParams.set('debug_cookies', String(capturedCookies.length))
      debugUrl.searchParams.set('debug_session', String(Boolean(data?.user)))
      return NextResponse.redirect(debugUrl)

    } catch (err) {
      const errMessage = err instanceof Error ? err.message : String(err)

      logServerFailure({
        category: 'auth',
        operation: 'auth.callback.exchangeCodeForSession',
        cause: err,
      })

      // TEMP DEBUG — REMOVE AFTER FIXED
      const debugUrl = new URL('/reset-password', origin)
      debugUrl.searchParams.set('debug_error', `EXCEPTION: ${errMessage}`)
      debugUrl.searchParams.set('debug_cookies', String(capturedCookies.length))
      debugUrl.searchParams.set('debug_session', 'false')
      return NextResponse.redirect(debugUrl)
    }
  }

  // No code present in URL — cannot proceed
  return NextResponse.redirect(
    new URL('/forgot-password?notice=link_expired', origin)
  )
}
