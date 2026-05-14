import 'server-only'

import { logServerFailure } from '@/lib/server-log'
import { createClient } from '@/lib/supabase/server'

export const AVATAR_BUCKET = 'avatars'
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

type AvatarMimeType = (typeof AVATAR_ALLOWED_TYPES)[number]

const extensionByMimeType: Record<AvatarMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateAvatarFile(file: File) {
  if (!AVATAR_ALLOWED_TYPES.includes(file.type as AvatarMimeType)) {
    return 'Upload a JPG, PNG, or WebP image.'
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return 'Avatar images must be 2MB or smaller.'
  }

  return null
}

export function buildAvatarStoragePath(userId: string, file: File) {
  const ext = extensionByMimeType[file.type as AvatarMimeType]

  if (!ext) {
    throw new Error(`Unsupported avatar mime type: ${file.type}`)
  }

  return `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`
}

export function isAvatarStoragePath(value: string | null | undefined, userId?: string) {
  if (!value || value.startsWith('http://') || value.startsWith('https://')) {
    return false
  }

  return userId ? value.startsWith(`${userId}/`) : true
}

export async function getAvatarSignedUrl(storagePath: string | null | undefined) {
  if (!storagePath) {
    return null
  }

  if (!isAvatarStoragePath(storagePath)) {
    return storagePath
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(storagePath, 3600)

  if (error || !data?.signedUrl) {
    logServerFailure({
      category: 'storage',
      operation: 'getAvatarSignedUrl',
      cause: error ?? new Error('Missing signedUrl'),
      context: { storagePathPrefix: storagePath.slice(0, 24) },
    })
    return null
  }

  return data.signedUrl
}
