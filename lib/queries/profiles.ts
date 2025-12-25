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
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

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
    .select('id, username, full_name, bio, avatar_url, role, privacy_level, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching profile:', error);
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

