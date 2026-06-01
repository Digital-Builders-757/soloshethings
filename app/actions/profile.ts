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

'use server'

import { revalidatePath } from 'next/cache'

import { getProfile } from '@/lib/queries/profiles'
import { logServerFailure } from '@/lib/server-log'
import { mapSupabaseErrorForUser } from '@/lib/supabase-errors'
import {
  AVATAR_BUCKET,
  buildAvatarStoragePath,
  isAvatarStoragePath,
  validateAvatarFile,
} from '@/lib/storage/avatars'
import { TRAVEL_STYLE_VALUES, TRAVEL_STYLES_MAX } from '@/lib/profile-travel-styles'
import { createClient, getUser } from '@/lib/supabase/server'
import type { privacy_level } from '@/types/database'

const PRIVACY: privacy_level[] = ['public', 'limited', 'private']

function parsePrivacy(raw: FormDataEntryValue | null): privacy_level | null {
  if (raw == null || typeof raw !== 'string') return null
  if (PRIVACY.includes(raw as privacy_level)) return raw as privacy_level
  return null
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
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile' }
  }

  const supabase = await createClient()

  const username = formData.get('username') as string | null
  const fullName = formData.get('full_name') as string | null
  const bio = formData.get('bio') as string | null
  const privacyLevel = parsePrivacy(formData.get('privacy_level'))
  const avatarEntry = formData.get('avatar')
  const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null

  // Travel styles: multiple checkbox values submitted under the same name.
  // Unknown values are silently dropped — whitelisted against the shared constant.
  // Capped at TRAVEL_STYLES_MAX to match the DB cardinality constraint.
  const travelStyles = formData
    .getAll('travel_styles')
    .filter((v): v is string => typeof v === 'string')
    .filter((v) => TRAVEL_STYLE_VALUES.includes(v))
    .slice(0, TRAVEL_STYLES_MAX)

  if (username === null) {
    return { error: 'Username is required' }
  }

  const trimmedUsername = username.trim().toLowerCase()
  if (trimmedUsername.length === 0) {
    return { error: 'Username cannot be empty' }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return { error: 'Username can only contain letters, numbers, and underscores' }
  }

  const trimmedBio = bio !== null ? bio.trim() : ''
  if (trimmedBio.length > 500) {
    return { error: 'Bio must be 500 characters or less' }
  }

  if (avatarFile) {
    const avatarValidationError = validateAvatarFile(avatarFile)
    if (avatarValidationError) {
      return { error: avatarValidationError }
    }
  }

  const trimmedFull = fullName !== null ? fullName.trim() || null : null

  try {
    const existing = await getProfile(user.id)
    let uploadedAvatarPath: string | null = null

    if (avatarFile) {
      uploadedAvatarPath = buildAvatarStoragePath(user.id, avatarFile)
      const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(uploadedAvatarPath, avatarFile, {
        cacheControl: '3600',
        contentType: avatarFile.type,
        upsert: false,
      })

      if (uploadError) {
        logServerFailure({
          category: 'storage',
          operation: 'updateProfile.avatarUpload',
          cause: uploadError,
          context: { userId: user.id },
        })
        const mapped = mapSupabaseErrorForUser(
          uploadError,
          'Could not upload your avatar. Please try again.'
        )
        return { error: mapped.userMessage }
      }
    }

    const avatarPath = uploadedAvatarPath ?? existing?.avatar_url ?? null

    const persistProfile = existing
      ? supabase
          .from('profiles')
          .update({
            username: trimmedUsername,
            full_name: trimmedFull,
            bio: trimmedBio || null,
            privacy_level: privacyLevel ?? existing.privacy_level,
            avatar_url: avatarPath,
            travel_styles: travelStyles,
          })
          .eq('id', user.id)
          .select('id')
          .single()
      : supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: trimmedUsername,
            full_name: trimmedFull,
            bio: trimmedBio || null,
            avatar_url: avatarPath,
            role: 'talent',
            privacy_level: privacyLevel ?? 'public',
            travel_styles: travelStyles,
          })
          .select('id')
          .single()

    const { error } = await persistProfile

    if (error) {
      if (uploadedAvatarPath) {
        await supabase.storage.from(AVATAR_BUCKET).remove([uploadedAvatarPath])
      }

      if (error.code === '23505') {
        return { error: 'This username is already taken. Please choose another.' }
      }
      if (error.code === 'PGRST116') {
        logServerFailure({
          category: 'mutation',
          operation: 'updateProfile.persist',
          cause: error,
          context: { userId: user.id, note: 'no_row_matched' },
        })
        return {
          error:
            'Your profile was not found. Reload the page or sign out and sign in again to retry.',
        }
      }

      logServerFailure({
        category: 'mutation',
        operation: existing ? 'updateProfile.update' : 'updateProfile.insert',
        cause: error,
        context: { userId: user.id },
      })
      const mapped = mapSupabaseErrorForUser(
        error,
        existing ? 'Failed to update profile. Please try again.' : 'Could not create your profile. Please try again or sign out and back in.'
      )
      return { error: mapped.userMessage }
    }

    if (
      uploadedAvatarPath &&
      existing?.avatar_url &&
      existing.avatar_url !== uploadedAvatarPath &&
      isAvatarStoragePath(existing.avatar_url, user.id)
    ) {
      const { error: removeError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([existing.avatar_url])

      if (removeError) {
        logServerFailure({
          category: 'storage',
          operation: 'updateProfile.oldAvatarCleanup',
          cause: removeError,
          context: { userId: user.id },
        })
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/profile')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    logServerFailure({ category: 'mutation', operation: 'updateProfile', cause: error })
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
