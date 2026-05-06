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

import { createClient, getUser } from '@/lib/supabase/server';
import { getProfile } from '@/lib/queries/profiles';
import type { privacy_level } from '@/types/database';
import { revalidatePath } from 'next/cache';

const PRIVACY: privacy_level[] = ['public', 'limited', 'private'];

function parsePrivacy(raw: FormDataEntryValue | null): privacy_level | null {
  if (raw == null || typeof raw !== 'string') return null;
  if (PRIVACY.includes(raw as privacy_level)) return raw as privacy_level;
  return null;
}

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
  const privacyLevel = parsePrivacy(formData.get('privacy_level'));

  if (username === null) {
    return { error: 'Username is required' };
  }
  const trimmedUsername = username.trim().toLowerCase();
  if (trimmedUsername.length === 0) {
    return { error: 'Username cannot be empty' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return { error: 'Username can only contain letters, numbers, and underscores' };
  }

  const trimmedBio = bio !== null ? bio.trim() : '';
  if (trimmedBio.length > 500) {
    return { error: 'Bio must be 500 characters or less' };
  }

  const trimmedFull = fullName !== null ? fullName.trim() || null : null;

  try {
      const existing = await getProfile(user.id);

      if (!existing) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: trimmedUsername,
            full_name: trimmedFull,
            bio: trimmedBio || null,
            role: 'talent',
            privacy_level: privacyLevel ?? 'public',
          })
          .select('id')
          .single();

        if (error) {
          if (error.code === '23505') {
            return { error: 'This username is already taken. Please choose another.' };
          }
          console.error('Profile create (first save) error:', error);
          return { error: 'Could not create your profile. Please try again or sign out and back in.' };
        }
      } else {
        const updates = {
          username: trimmedUsername,
          full_name: trimmedFull,
          bio: trimmedBio || null,
          privacy_level: privacyLevel ?? existing.privacy_level,
        };

        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select('id')
          .single();

        if (error) {
          if (error.code === '23505') {
            return { error: 'This username is already taken. Please choose another.' };
          }
          if (error.code === 'PGRST116') {
            console.error('Profile update: no row matched', user.id);
            return {
              error:
                'Your profile was not found. Reload the page or sign out and sign in again to retry.',
            };
          }
          console.error('Profile update error:', error);
          return { error: 'Failed to update profile. Please try again.' };
        }
      }

    revalidatePath('/dashboard');
    revalidatePath('/profile');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Profile update exception:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
