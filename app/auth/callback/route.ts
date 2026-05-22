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

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        const response = NextResponse.redirect(new URL(next, origin))

        // Explicitly attach session cookies to the redirect response.
        // Cookies written via the setAll callback are not guaranteed to
        // propagate to a manually constructed NextResponse in all Next.js
        // versions, so we attach them here to ensure the browser receives them.
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
