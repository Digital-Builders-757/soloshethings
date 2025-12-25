/**
 * Profile Server Actions
 * 
 * MUST follow: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 * 
 * Rules:
 * - Use getUser() for auth checks
 * - Explicit selects only
 * - User-safe error messages
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Update user profile
 * 
 * @param formData - Form data containing profile fields
 * @returns Success or error object
 */
export async function updateProfile(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await getUser();
  
  if (!user) {
    return { error: 'You must be logged in to update your profile' };
  }

  const supabase = await createClient();

  // Extract form data
  const username = formData.get('username') as string | null;
  const fullName = formData.get('full_name') as string | null;
  const bio = formData.get('bio') as string | null;

  // Build update object (only include provided fields)
  const updates: {
    username?: string;
    full_name?: string | null;
    bio?: string | null;
  } = {};

  if (username !== null) {
    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length === 0) {
      return { error: 'Username cannot be empty' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return { error: 'Username can only contain letters, numbers, and underscores' };
    }
    updates.username = trimmedUsername;
  }

  if (fullName !== null) {
    updates.full_name = fullName.trim() || null;
  }

  if (bio !== null) {
    const trimmedBio = bio.trim();
    if (trimmedBio.length > 500) {
      return { error: 'Bio must be 500 characters or less' };
    }
    updates.bio = trimmedBio || null;
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation (username already taken)
        return { error: 'This username is already taken. Please choose another.' };
      }
      console.error('Profile update error:', error);
      return { error: 'Failed to update profile. Please try again.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Profile update exception:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

