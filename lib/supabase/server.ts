/**
 * Server-side Supabase client for Next.js 15 App Router
 *
 * Usage: Use this in Server Components, Server Actions, and Route Handlers
 *
 * MUST:
 * - Use for all server-side Supabase operations
 * - Respect Row Level Security (RLS) policies
 * - Never expose service role key to client
 *
 * MUST NOT:
 * - Use in Client Components (use lib/supabase/client.ts instead)
 * - Bypass RLS unless absolutely necessary (use service role sparingly)
 *
 * Reference: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Check if Supabase environment variables are configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

/**
 * Create a Supabase client for Server Components and Server Actions
 *
 * This client:
 * - Uses cookies for session management
 * - Respects RLS policies (user context from auth)
 * - Automatically handles cookie operations
 *
 * @returns Supabase client instance or null if not configured
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Create a Supabase client with Service Role key (ADMIN ACCESS)
 *
 * WARNING: This client bypasses ALL RLS policies!
 *
 * Use ONLY for:
 * - Webhook handlers (Stripe, WordPress)
 * - Admin operations
 * - System-level operations
 *
 * NEVER:
 * - Use for user-initiated actions
 * - Expose this client to the frontend
 * - Use when RLS should be enforced
 *
 * @returns Supabase client with admin access
 */
export function createServiceRoleClient() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase is not configured or SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
    }
  )
}

/**
 * Get the current authenticated user
 *
 * Use this instead of getSession() per AUTH_CONTRACT.md
 *
 * @returns User object or null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()
  if (!supabase) return null
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    // Check if this is just a missing session (expected for anonymous users)
    const isSessionMissing = error.message?.includes('session') || error.message?.includes('missing') || error.message?.includes('not authenticated')
    
    if (!isSessionMissing) {
      // Only log actual errors, not expected "no session" cases
      console.error('Error fetching user:', error)
    }
    return null
  }

  return user
}

/**
 * Check if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}
