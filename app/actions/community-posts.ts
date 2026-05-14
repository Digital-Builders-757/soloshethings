'use server'

import { revalidatePath } from 'next/cache'

import { getMembershipTier } from '@/lib/billing/entitlements'
import { captureProductSignal } from '@/lib/analytics/product-signals'
import {
  normalizePlaceLabel,
  parseStoryTagsFromForm,
  validatePlaceLabelInput,
} from '@/lib/community-story-taxonomy'
import { PERMANENT_REMOVE_CONFIRM_PHRASE } from '@/lib/community-owner-lifecycle'
import { logServerFailure } from '@/lib/server-log'
import {
  buildPostImageStoragePath,
  POST_IMAGE_BUCKET,
  POST_IMAGE_MAX_FILES,
  validatePostImageFile,
} from '@/lib/storage/post-images'
import { mapSupabaseErrorForUser, safeThrownErrorMessage } from '@/lib/supabase-errors'
import { createClient, getUser } from '@/lib/supabase/server'

type CreateCommunityPostState = {
  error?: string
  success?: boolean
  postId?: string
  uploadedCount?: number
}

type OwnerCommunityPostState = {
  error?: string
  success?: boolean
  archived?: boolean
  restored?: boolean
  removed?: boolean
  message?: string
  uploadedCount?: number
  removedImageId?: string
}

function parsePrivacy(raw: FormDataEntryValue | null) {
  return raw === 'private' ? false : true
}

async function requireFullMembership(userId: string): Promise<string | null> {
  const tier = await getMembershipTier(userId)
  if (tier !== 'full') {
    return 'Active membership or trial is required for this story action. Open Billing in the nav to subscribe.'
  }
  return null
}

function validateCommunityPostInput(title: string, content: string) {
  if (title.length < 3) {
    return 'Add a title with at least 3 characters.'
  }

  if (title.length > 200) {
    return 'Titles must be 200 characters or fewer.'
  }

  if (content.length < 20) {
    return 'Share a little more detail so members know why this place or story matters.'
  }

  if (content.length > 5000) {
    return 'Descriptions must be 5,000 characters or fewer.'
  }

  return null
}

async function getOwnedCommunityPost(postId: string, userId: string) {
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('community_posts')
    .select('id, author_id, title, status')
    .eq('id', postId)
    .eq('author_id', userId)
    .maybeSingle()

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not check that story right now. Please try again.')
    logServerFailure({
      category: 'query',
      operation: 'getOwnedCommunityPost',
      cause: error,
      context: { userId, postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { post: null, lookupError: mapped.userMessage }
  }

  if (!post) {
    return { post: null, lookupError: 'That story is not available from your account.' }
  }

  return { post, lookupError: null }
}

async function getOwnedPostImages(postId: string) {
  const supabase = await createClient()
  const { data: images, error } = await supabase
    .from('post_images')
    .select('id, storage_path, order')
    .eq('post_id', postId)
    .order('order', { ascending: true })

  if (error) {
    const mapped = mapSupabaseErrorForUser(
      error,
      'Could not check this story\'s photos right now. Please try again.'
    )
    logServerFailure({
      category: 'query',
      operation: 'getOwnedPostImages',
      cause: error,
      context: { postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { images: null, lookupError: mapped.userMessage }
  }

  return { images: images ?? [], lookupError: null }
}

async function getOwnedPostImage(postId: string, imageId: string) {
  const supabase = await createClient()
  const { data: image, error } = await supabase
    .from('post_images')
    .select('id, storage_path')
    .eq('id', imageId)
    .eq('post_id', postId)
    .maybeSingle()

  if (error) {
    const mapped = mapSupabaseErrorForUser(
      error,
      'Could not check this story image right now. Please try again.'
    )
    logServerFailure({
      category: 'query',
      operation: 'getOwnedPostImage',
      cause: error,
      context: { postId, imageId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { image: null, lookupError: mapped.userMessage }
  }

  if (!image) {
    return { image: null, lookupError: 'That story image is not available from your account.' }
  }

  return { image, lookupError: null }
}

function revalidateCommunityPostSurfaces(postId: string, path?: string) {
  revalidatePath('/dashboard')
  revalidatePath('/places')
  revalidatePath('/saved')
  revalidatePath('/submit')
  revalidatePath(`/places/${postId}`)

  if (path && path.startsWith('/')) {
    revalidatePath(path)
  }
}

export async function createCommunityPost(
  _prevState: CreateCommunityPostState | null,
  formData: FormData
): Promise<CreateCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a post.' }
  }

  const membershipError = await requireFullMembership(user.id)
  if (membershipError) {
    return { error: membershipError }
  }

  const supabase = await createClient()

  const title = `${formData.get('title') ?? ''}`.trim()
  const content = `${formData.get('content') ?? ''}`.trim()
  const isPublic = parsePrivacy(formData.get('privacy'))
  const imageFiles = formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  const validationError = validateCommunityPostInput(title, content)
  if (validationError) {
    return { error: validationError }
  }

  const placeLabelRaw = `${formData.get('place_label') ?? ''}`
  const placeLabelIssue = validatePlaceLabelInput(placeLabelRaw)
  if (placeLabelIssue) {
    return { error: placeLabelIssue }
  }
  const place_label = normalizePlaceLabel(placeLabelRaw)
  const story_tags = parseStoryTagsFromForm(formData.getAll('topics'))

  if (imageFiles.length > POST_IMAGE_MAX_FILES) {
    return { error: `You can upload up to ${POST_IMAGE_MAX_FILES} images per post.` }
  }

  for (const file of imageFiles) {
    const fileValidationError = validatePostImageFile(file)
    if (fileValidationError) {
      return { error: fileValidationError }
    }
  }

  let postId: string | null = null
  const uploadedPaths: string[] = []

  try {
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        title,
        content,
        is_public: isPublic,
        status: 'published',
        place_label,
        story_tags,
      })
      .select('id')
      .single()

    if (postError || !post) {
      if (postError) {
        const mapped = mapSupabaseErrorForUser(postError, 'Could not save your post. Please try again.')
        logServerFailure({
          category: 'mutation',
          operation: 'createCommunityPost.insert',
          cause: postError,
          context: { userId: user.id, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
        })
        return { error: mapped.userMessage }
      }
      return { error: 'Could not save your post. Please try again.' }
    }

    postId = post.id

    const imageRows: Array<{
      post_id: string
      image_url: string
      storage_path: string
      alt_text: string | null
      order: number
    }> = []

    for (const [index, file] of imageFiles.entries()) {
      const storagePath = buildPostImageStoragePath(user.id, post.id, file)
      const { data: publicUrlData } = supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(storagePath)
      const { error: uploadError } = await supabase.storage.from(POST_IMAGE_BUCKET).upload(storagePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

      if (uploadError) {
        logServerFailure({
          category: 'storage',
          operation: 'createCommunityPost.imageUpload',
          cause: uploadError,
          context: { userId: user.id, postId: post.id },
        })
        throw new Error('Could not upload one of your images.')
      }

      uploadedPaths.push(storagePath)
      imageRows.push({
        post_id: post.id,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        alt_text: null,
        order: index,
      })
    }

    if (imageRows.length > 0) {
      const { error: imageInsertError } = await supabase.from('post_images').insert(imageRows)

      if (imageInsertError) {
        logServerFailure({
          category: 'mutation',
          operation: 'createCommunityPost.postImagesInsert',
          cause: imageInsertError,
          context: { userId: user.id, postId: post.id },
        })
        throw new Error('Could not save your image details.')
      }
    }

    revalidateCommunityPostSurfaces(post.id, '/submit')

    captureProductSignal('community_post_created', {
      photo_count: imageRows.length,
      place_set: Boolean(place_label?.trim()),
      topic_count: story_tags.length,
      is_public: isPublic,
    })

    return {
      success: true,
      postId: post.id,
      uploadedCount: imageRows.length,
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await supabase.storage.from(POST_IMAGE_BUCKET).remove(uploadedPaths)
      if (cleanupError) {
        logServerFailure({
          category: 'storage',
          operation: 'createCommunityPost.uploadCleanup',
          cause: cleanupError,
          context: { userId: user.id, pathCount: uploadedPaths.length },
        })
      }
    }

    if (postId) {
      const { error: rollbackError } = await supabase.from('community_posts').delete().eq('id', postId)
      if (rollbackError) {
        logServerFailure({
          category: 'mutation',
          operation: 'createCommunityPost.postRollback',
          cause: rollbackError,
          context: { userId: user.id, postId },
        })
      }
    }

    logServerFailure({
      category: 'mutation',
      operation: 'createCommunityPost',
      cause: error,
      context: { userId: user.id },
    })
    return {
      error: safeThrownErrorMessage(error, 'Could not publish your post. Please try again.', [
        'Could not upload one of your images.',
        'Could not save your image details.',
      ]),
    }
  }
}

export async function updateCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to edit a story.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const title = `${formData.get('title') ?? ''}`.trim()
  const content = `${formData.get('content') ?? ''}`.trim()
  const isPublic = parsePrivacy(formData.get('privacy'))

  if (!postId) {
    return { error: 'Missing story details for this edit.' }
  }

  const validationError = validateCommunityPostInput(title, content)
  if (validationError) {
    return { error: validationError }
  }

  const placeLabelRaw = `${formData.get('place_label') ?? ''}`
  const placeLabelIssue = validatePlaceLabelInput(placeLabelRaw)
  if (placeLabelIssue) {
    return { error: placeLabelIssue }
  }
  const place_label = normalizePlaceLabel(placeLabelRaw)
  const story_tags = parseStoryTagsFromForm(formData.getAll('topics'))

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status !== 'published') {
    return { error: 'Archived stories stay read-only for now.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('community_posts')
    .update({
      title,
      content,
      is_public: isPublic,
      place_label,
      story_tags,
    })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not save your story changes right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'updateCommunityPost',
      cause: error,
      context: { userId: user.id, postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    message: `Updated "${title}".`,
  }
}

export async function addImagesToCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to manage story photos.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const imageFiles = formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (!postId) {
    return { error: 'Missing story details for this photo upload.' }
  }

  if (imageFiles.length === 0) {
    return { error: 'Choose at least one image to upload.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status !== 'published') {
    return { error: 'Archived stories stay read-only for now.' }
  }

  const { images: existingImages, lookupError: imagesLookupError } = await getOwnedPostImages(postId)
  if (imagesLookupError || !existingImages) {
    return { error: imagesLookupError ?? 'Could not check this story\'s photos right now. Please try again.' }
  }

  if (existingImages.length + imageFiles.length > POST_IMAGE_MAX_FILES) {
    return { error: `You can keep up to ${POST_IMAGE_MAX_FILES} images on a story.` }
  }

  const nextOrder = existingImages.reduce((maxOrder, image) => Math.max(maxOrder, image.order), -1) + 1

  for (const file of imageFiles) {
    const fileValidationError = validatePostImageFile(file)
    if (fileValidationError) {
      return { error: fileValidationError }
    }
  }

  const supabase = await createClient()
  const uploadedPaths: string[] = []

  try {
    const imageRows: Array<{
      post_id: string
      image_url: string
      storage_path: string
      alt_text: string | null
      order: number
    }> = []

    for (const [index, file] of imageFiles.entries()) {
      const storagePath = buildPostImageStoragePath(user.id, post.id, file)
      const { data: publicUrlData } = supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(storagePath)
      const { error: uploadError } = await supabase.storage.from(POST_IMAGE_BUCKET).upload(storagePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })

      if (uploadError) {
        logServerFailure({
          category: 'storage',
          operation: 'addImagesToCommunityPost.upload',
          cause: uploadError,
          context: { userId: user.id, postId },
        })
        throw new Error('Could not upload one of your images.')
      }

      uploadedPaths.push(storagePath)
      imageRows.push({
        post_id: post.id,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        alt_text: null,
        order: nextOrder + index,
      })
    }

    const { error: imageInsertError } = await supabase.from('post_images').insert(imageRows)

    if (imageInsertError) {
      logServerFailure({
        category: 'mutation',
        operation: 'addImagesToCommunityPost.insertMetadata',
        cause: imageInsertError,
        context: { userId: user.id, postId },
      })
      throw new Error('Could not save your new image details.')
    }

    revalidateCommunityPostSurfaces(postId, path)

    return {
      success: true,
      uploadedCount: imageRows.length,
      message: `Added ${imageRows.length} photo${imageRows.length === 1 ? '' : 's'} to "${post.title}".`,
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await supabase.storage.from(POST_IMAGE_BUCKET).remove(uploadedPaths)
      if (cleanupError) {
        logServerFailure({
          category: 'storage',
          operation: 'addImagesToCommunityPost.uploadCleanup',
          cause: cleanupError,
          context: { userId: user.id, postId, pathCount: uploadedPaths.length },
        })
      }
    }

    logServerFailure({
      category: 'mutation',
      operation: 'addImagesToCommunityPost',
      cause: error,
      context: { userId: user.id, postId },
    })
    return {
      error: safeThrownErrorMessage(error, 'Could not update this story\'s photos right now.', [
        'Could not upload one of your images.',
        'Could not save your new image details.',
      ]),
    }
  }
}

export async function removeImageFromCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to manage story photos.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const imageId = `${formData.get('imageId') ?? ''}`.trim()

  if (!postId || !imageId) {
    return { error: 'Missing story image details for this remove action.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status !== 'published') {
    return { error: 'Archived stories stay read-only for now.' }
  }

  const { image, lookupError: imageLookupError } = await getOwnedPostImage(postId, imageId)
  if (imageLookupError || !image?.storage_path) {
    return { error: imageLookupError ?? 'That story image is not available from your account.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('post_images')
    .delete()
    .eq('id', imageId)
    .eq('post_id', postId)

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not remove this photo right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'removeImageFromCommunityPost.deleteRow',
      cause: error,
      context: { userId: user.id, postId, imageId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  const { error: storageError } = await supabase.storage.from(POST_IMAGE_BUCKET).remove([image.storage_path])
  if (storageError) {
    logServerFailure({
      category: 'storage',
      operation: 'removeImageFromCommunityPost.removeObject',
      cause: storageError,
      context: { userId: user.id, postId, imageId },
    })
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    removedImageId: imageId,
    message: `Removed a photo from "${post.title}".`,
  }
}

export async function updateCommunityPostImageAlt(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to manage story photos.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const imageId = `${formData.get('imageId') ?? ''}`.trim()
  const altRaw = `${formData.get('alt') ?? ''}`.trim()

  if (!postId || !imageId) {
    return { error: 'Missing story image details for this update.' }
  }

  if (altRaw.length > 200) {
    return { error: 'Image descriptions must be 200 characters or fewer.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status !== 'published') {
    return { error: 'Archived stories stay read-only for now.' }
  }

  const { image, lookupError: imageLookupError } = await getOwnedPostImage(postId, imageId)
  if (imageLookupError || !image?.id) {
    return { error: imageLookupError ?? 'That story image is not available from your account.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('post_images')
    .update({ alt_text: altRaw.length === 0 ? null : altRaw })
    .eq('id', imageId)
    .eq('post_id', postId)

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not save this image description right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'updateCommunityPostImageAlt',
      cause: error,
      context: { userId: user.id, postId, imageId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    message: altRaw.length === 0 ? 'Cleared photo description.' : 'Saved photo description.',
  }
}

export async function moveCommunityPostImage(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to manage story photos.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const imageId = `${formData.get('imageId') ?? ''}`.trim()
  const direction = `${formData.get('direction') ?? ''}`.trim()

  if (!postId || !imageId) {
    return { error: 'Missing story image details for this reorder.' }
  }

  if (direction !== 'up' && direction !== 'down') {
    return { error: 'Invalid photo move direction.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status !== 'published') {
    return { error: 'Archived stories stay read-only for now.' }
  }

  const { images: imageRows, lookupError: imagesLookupError } = await getOwnedPostImages(postId)
  if (imagesLookupError || !imageRows || imageRows.length < 2) {
    return { error: imagesLookupError ?? 'Need at least two photos to change order.' }
  }

  const sorted = [...imageRows].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((img) => img.id === imageId)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1

  if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) {
    return { success: true, message: 'Photo order unchanged.' }
  }

  const a = sorted[idx]
  const b = sorted[swapIdx]

  const supabase = await createClient()
  const { error: firstError } = await supabase
    .from('post_images')
    .update({ order: b.order })
    .eq('id', a.id)
    .eq('post_id', postId)

  if (firstError) {
    const mapped = mapSupabaseErrorForUser(firstError, 'Could not reorder this photo right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'moveCommunityPostImage.first',
      cause: firstError,
      context: { userId: user.id, postId, imageId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  const { error: secondError } = await supabase
    .from('post_images')
    .update({ order: a.order })
    .eq('id', b.id)
    .eq('post_id', postId)

  if (secondError) {
    const mapped = mapSupabaseErrorForUser(secondError, 'Could not reorder this photo right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'moveCommunityPostImage.second',
      cause: secondError,
      context: { userId: user.id, postId, imageId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    await supabase.from('post_images').update({ order: a.order }).eq('id', a.id).eq('post_id', postId)
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    message: 'Updated photo order.',
  }
}

export async function archiveCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to archive a story.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()

  if (!postId) {
    return { error: 'Missing story details for this archive action.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status === 'removed') {
    return { error: 'This story has been permanently removed.' }
  }

  if (post.status === 'archived') {
    return { error: 'This story is already archived.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('community_posts')
    .update({ status: 'archived' })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not archive this story right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'archiveCommunityPost',
      cause: error,
      context: { userId: user.id, postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    archived: true,
    message: `Archived "${post.title}".`,
  }
}

export async function restoreCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to restore a story.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()

  if (!postId) {
    return { error: 'Missing story details for this restore action.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status === 'removed') {
    return {
      error:
        'This story was permanently removed from community surfaces. It cannot be republished here. Contact support if you need help.',
    }
  }

  if (post.status === 'published') {
    return { error: 'This story is already published.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('community_posts')
    .update({ status: 'published' })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not restore this story right now.')
    logServerFailure({
      category: 'mutation',
      operation: 'restoreCommunityPost',
      cause: error,
      context: { userId: user.id, postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    restored: true,
    message: `Restored "${post.title}".`,
  }
}

export async function permanentlyRemoveCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to remove a story.' }
  }

  const membershipErr = await requireFullMembership(user.id)
  if (membershipErr) {
    return { error: membershipErr }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()
  const confirmPhrase = `${formData.get('confirmPhrase') ?? ''}`.trim()

  if (!postId) {
    return { error: 'Missing story details for this removal action.' }
  }

  if (confirmPhrase !== PERMANENT_REMOVE_CONFIRM_PHRASE) {
    return {
      error: `Type "${PERMANENT_REMOVE_CONFIRM_PHRASE}" exactly in the confirmation field so we know this is intentional.`,
    }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
  }

  if (post.status === 'removed') {
    return { error: 'This story is already permanently removed.' }
  }

  if (post.status !== 'published' && post.status !== 'archived') {
    return {
      error: 'Only published or archived stories can be permanently removed using this workflow.',
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('community_posts')
    .update({ status: 'removed' })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    const mapped = mapSupabaseErrorForUser(
      error,
      'Could not permanently remove this story right now.'
    )
    logServerFailure({
      category: 'mutation',
      operation: 'permanentlyRemoveCommunityPost',
      cause: error,
      context: { userId: user.id, postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    removed: true,
    message: `Removed "${post.title}". It stays in your submission history under "Permanently removed" but stays off community surfaces.`,
  }
}
