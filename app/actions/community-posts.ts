'use server'

import { revalidatePath } from 'next/cache'

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
  message?: string
  uploadedCount?: number
  removedImageId?: string
}

function parsePrivacy(raw: FormDataEntryValue | null) {
  return raw === 'private' ? false : true
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

export async function archiveCommunityPost(
  _prevState: OwnerCommunityPostState | null,
  formData: FormData
): Promise<OwnerCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to archive a story.' }
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

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/submit'}`.trim()

  if (!postId) {
    return { error: 'Missing story details for this restore action.' }
  }

  const { post, lookupError } = await getOwnedCommunityPost(postId, user.id)
  if (lookupError || !post) {
    return { error: lookupError ?? 'That story is not available from your account.' }
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
