/**
 * Supabase middleware helper for Next.js 15 App Router
 *
 * Usage: Import and use in middleware.ts for session management
 *
 * MUST:
 * - Refresh user session on every request
 * - Set updated session cookies
 * - Allow middleware to verify auth state
 *
 * MUST NOT:
 * - Skip session refresh (causes auth state issues)
 * - Modify cookies outside of Supabase client
 *
 * Reference: docs/contracts/AUTH_CONTRACT.md
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Update Supabase session in middleware
 *
 * This function:
 * - Refreshes the user session
 * - Updates session cookies
 * - Returns the Supabase client and updated response
 *
 * Use in middleware.ts to keep sessions fresh
 *
 * @param request - Next.js request object
 * @returns Object with supabase client and updated response
 */
export async function updateSession(request: NextRequest) {
  // If Supabase env vars are missing, pass through without session management
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      supabase: null,
      response: NextResponse.next({ request: { headers: request.headers } }),
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // to have access to a fresh session
  await supabase.auth.getUser()

  return { supabase, response }
}
