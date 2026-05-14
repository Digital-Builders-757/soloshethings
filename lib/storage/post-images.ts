import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const POST_IMAGE_BUCKET = 'post-images'
export const POST_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const POST_IMAGE_MAX_FILES = 5
export const POST_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

type PostImageMimeType = (typeof POST_IMAGE_ALLOWED_TYPES)[number]

const extensionByMimeType: Record<PostImageMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validatePostImageFile(file: File) {
  if (!POST_IMAGE_ALLOWED_TYPES.includes(file.type as PostImageMimeType)) {
    return 'Upload JPG, PNG, or WebP images only.'
  }

  if (file.size > POST_IMAGE_MAX_BYTES) {
    return 'Each image must be 5MB or smaller.'
  }

  return null
}

export function buildPostImageStoragePath(userId: string, postId: string, file: File) {
  const ext = extensionByMimeType[file.type as PostImageMimeType]

  if (!ext) {
    throw new Error(`Unsupported post image mime type: ${file.type}`)
  }

  return `${userId}/posts/${postId}/${Date.now()}-${crypto.randomUUID()}.${ext}`
}

export async function getPostImageSignedUrl(storagePath: string | null | undefined) {
  if (!storagePath) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from(POST_IMAGE_BUCKET)
    .createSignedUrl(storagePath, 3600)

  if (error || !data?.signedUrl) {
    console.error('Failed to create signed post image URL:', error)
    return null
  }

  return data.signedUrl
}
