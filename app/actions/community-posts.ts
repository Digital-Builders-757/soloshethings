'use server'

import { revalidatePath } from 'next/cache'

import {
  buildPostImageStoragePath,
  POST_IMAGE_BUCKET,
  POST_IMAGE_MAX_FILES,
  validatePostImageFile,
} from '@/lib/storage/post-images'
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
  message?: string
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
    console.error('Owned community post lookup error:', error)
    return { post: null, lookupError: 'Could not check that story right now. Please try again.' }
  }

  if (!post) {
    return { post: null, lookupError: 'That story is not available from your account.' }
  }

  return { post, lookupError: null }
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
      console.error('Create post error:', postError)
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
        console.error('Post image upload error:', uploadError)
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
        console.error('Create post image metadata error:', imageInsertError)
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
        console.error('Post image cleanup error:', cleanupError)
      }
    }

    if (postId) {
      const { error: rollbackError } = await supabase.from('community_posts').delete().eq('id', postId)
      if (rollbackError) {
        console.error('Post rollback error:', rollbackError)
      }
    }

    console.error('Create community post exception:', error)
    return { error: error instanceof Error ? error.message : 'Could not publish your post. Please try again.' }
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
    console.error('Update community post error:', error)
    return { error: 'Could not save your story changes right now.' }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    message: `Updated "${title}".`,
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
    console.error('Archive community post error:', error)
    return { error: 'Could not archive this story right now.' }
  }

  revalidateCommunityPostSurfaces(postId, path)

  return {
    success: true,
    archived: true,
    message: `Archived "${post.title}".`,
  }
}
