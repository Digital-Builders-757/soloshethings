/**
 * Client-side Supabase client for Next.js 15 App Router
 *
 * Usage: Use this in Client Components ("use client")
 *
 * MUST:
 * - Use for client-side Supabase operations only
 * - Mark components as "use client" when using this
 * - Respect Row Level Security (RLS) policies
 *
 * MUST NOT:
 * - Use in Server Components (use lib/supabase/server.ts instead)
 * - Access service role key (not available client-side)
 * - Bypass RLS (client has no service role access)
 *
 * Reference: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client for Client Components
 *
 * This client:
 * - Runs in the browser
 * - Uses local storage for session management
 * - Respects RLS policies (user context from auth)
 * - Automatically syncs auth state
 *
 * @returns Supabase client instance
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !url.startsWith('http') || !key || key.length === 0) {
    return null
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Singleton instance of the Supabase client
 *
 * Use this in Client Components for all Supabase operations
 * Returns null if Supabase is not configured
 *
 * Example:
 * ```tsx
 * 'use client'
 * import { supabase } from '@/lib/supabase/client'
 *
 * export function MyComponent() {
 *   if (!supabase) return <p>Supabase not configured</p>
 *   const { data } = await supabase.from('posts').select('*')
 *   // ...
 * }
 * ```
 */
export const supabase = createClient()
