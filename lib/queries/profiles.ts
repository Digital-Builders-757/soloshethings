/**
 * Profile Query Module
 * 
 * Server-only profile data access
 * MUST follow: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 * 
 * Rules:
 * - Explicit selects only (never select('*'))
 * - Use .maybeSingle() when 0 rows is valid
 * - Use .single() when exactly 1 row expected
 * - Server-only (never import in Client Components)
 */

import "server-only";
import { generateUsername } from '@/lib/auth-utils';
import { logServerFailure } from '@/lib/server-log';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

const profileSelect =
  'id, username, full_name, bio, avatar_url, role, privacy_level, created_at, updated_at' as const

/**
 * Get user profile by ID
 * 
 * @param userId - User ID (from auth.users.id)
 * @returns Profile or null if not found
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(profileSelect)
    .eq('id', userId)
    .maybeSingle();
    
  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'getProfile.maybeSingle',
      cause: error,
      context: { userId },
    });
    return null;
  }
  
  return data;
}

/**
 * Get current user's profile
 * 
 * Uses getUser() to get authenticated user, then fetches profile
 * 
 * @returns Profile or null if not authenticated or profile not found
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { getUser } = await import('@/lib/supabase/server');
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  return getProfile(user.id);
}

/**
 * Fetch profile for an authenticated user; if missing, run one bounded repair insert (AUTH_CONTRACT).
 */
export async function getProfileWithBoundedRepair(
  userId: string,
  email: string | null | undefined
): Promise<Profile | null> {
  const existing = await getProfile(userId);
  if (existing) return existing;

  console.warn(`Missing profile for user ${userId}, attempting bounded repair`);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username: generateUsername(email ?? 'user'),
      role: 'talent',
      privacy_level: 'public',
    })
    .select(profileSelect)
    .single();

  if (error || !data) {
    logServerFailure({
      category: 'mutation',
      operation: 'getProfileWithBoundedRepair.insert',
      cause: error ?? new Error('profile_repair_no_row'),
      context: { userId },
    });
    const { data: raced, error: refetchError } = await supabase
      .from('profiles')
      .select(profileSelect)
      .eq('id', userId)
      .maybeSingle();

    if (refetchError) {
      logServerFailure({
        category: 'query',
        operation: 'getProfileWithBoundedRepair.refetchAfterRepair',
        cause: refetchError,
        context: { userId },
      });
    }
    if (raced) return raced;
    return null;
  }

  return data;
}

