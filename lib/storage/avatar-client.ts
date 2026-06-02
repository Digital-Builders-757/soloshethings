/**
 * Client-safe avatar upload constants and validation.
 * Shared by profile crop UI and server-side storage helpers.
 */

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const AVATAR_CROP_OUTPUT_MAX_PX = 512

export type AvatarMimeType = (typeof AVATAR_ALLOWED_TYPES)[number]

export const AVATAR_ACCEPT = AVATAR_ALLOWED_TYPES.join(',')

export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_ALLOWED_TYPES.includes(file.type as AvatarMimeType)) {
    return 'Upload a JPG, PNG, or WebP image.'
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return 'Avatar images must be 2MB or smaller.'
  }

  return null
}
