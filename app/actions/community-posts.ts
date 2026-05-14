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

function parsePrivacy(raw: FormDataEntryValue | null) {
  return raw === 'private' ? false : true
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

  if (title.length < 3) {
    return { error: 'Add a title with at least 3 characters.' }
  }

  if (title.length > 200) {
    return { error: 'Titles must be 200 characters or fewer.' }
  }

  if (content.length < 20) {
    return { error: 'Share a little more detail so members know why this place or story matters.' }
  }

  if (content.length > 5000) {
    return { error: 'Descriptions must be 5,000 characters or fewer.' }
  }

  if (imageFiles.length > POST_IMAGE_MAX_FILES) {
    return { error: `You can upload up to ${POST_IMAGE_MAX_FILES} images per post.` }
  }

  for (const file of imageFiles) {
    const validationError = validatePostImageFile(file)
    if (validationError) {
      return { error: validationError }
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

    revalidatePath('/submit')
    revalidatePath('/dashboard')

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
