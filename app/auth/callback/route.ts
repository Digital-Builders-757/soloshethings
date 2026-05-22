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

  // TEMPORARY — remove after recovery flow is verified in production
  console.log('[auth/callback] code present:', Boolean(code), '| next:', next)

  if (code) {
    try {
      const cookieStore = await cookies()

      // Capture every cookie Supabase wants to set during the code exchange.
      // We then attach these explicitly to the redirect response — the
      // cookieStore.set() call alone does NOT guarantee the cookies appear on
      // a manually created NextResponse.redirect() in all Next.js versions.
      const capturedCookies: Array<{
        name: string
        value: string
        options: CookieOptions
      }> = []

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
                // Also write to the cookie store for completeness
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

      // TEMPORARY — remove after recovery flow is verified in production
      console.log('[auth/callback] exchange error:', error?.message ?? 'none')
      console.log('[auth/callback] session userId:', data?.user?.id ?? 'none')
      console.log('[auth/callback] cookies captured:', capturedCookies.length)

      if (!error) {
        const response = NextResponse.redirect(new URL(next, origin))

        // Explicitly attach session cookies to the redirect response.
        capturedCookies.forEach(({ name, value, options }) => {
          // Strip `encode` — it's a @supabase/ssr field not accepted by ResponseCookie
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
    } catch (err) {
      logServerFailure({
        category: 'auth',
        operation: 'auth.callback.exchangeCodeForSession',
        cause: err,
      })
    }
  }

  // Code missing or exchange failed
  return NextResponse.redirect(
    new URL('/forgot-password?notice=link_expired', origin)
  )
}
