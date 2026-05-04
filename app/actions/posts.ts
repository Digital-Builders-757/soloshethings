/**
 * Community Posts Server Actions
 *
 * MUST follow: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 *
 * Rules:
 * - Use getUser(), not getSession()
 * - Explicit selects only (never select('*'))
 * - Validate inputs
 */

'use server'

import { createClient, getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Create a new community post
 *
 * @param _prevState - Previous form state (from useFormState)
 * @param formData - Form data containing title and content
 * @returns Error object or redirects (never returns on success)
 */
export async function createPost(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to create a post' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // Validate inputs
  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' }
  }

  if (title.trim().length < 5) {
    return { error: 'Title must be at least 5 characters' }
  }

  if (title.trim().length > 200) {
    return { error: 'Title must be less than 200 characters' }
  }

  if (!content || content.trim().length === 0) {
    return { error: 'Content is required' }
  }

  if (content.trim().length < 20) {
    return { error: 'Content must be at least 20 characters' }
  }

  const supabase = await createClient()

  try {
    const { error: insertError } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        is_public: true,
        status: 'published',
      })

    if (insertError) {
      console.error('Error creating post:', insertError)
      return { error: 'Failed to create post. Please try again.' }
    }

    revalidatePath('/dashboard')
  } catch (error) {
    console.error('Create post error:', error)
    return { error: 'An unexpected error occurred' }
  }

  redirect('/dashboard')
}

/**
 * Get user's community posts
 *
 * @param userId - User ID to fetch posts for
 * @param limit - Maximum number of posts to return
 * @returns Array of posts or empty array
 */
export async function getUserPosts(userId: string, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_posts')
    .select('id, title, content, status, is_public, created_at, updated_at')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching user posts:', error)
    return []
  }

  return data || []
}

/**
 * Get recent public community posts
 *
 * @param limit - Maximum number of posts to return
 * @returns Array of posts with author info or empty array
 */
export async function getRecentCommunityPosts(limit = 6) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      id,
      title,
      content,
      created_at,
      author_id,
      profiles!community_posts_author_id_fkey (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching community posts:', error)
    return []
  }

  return data || []
}

/**
 * Delete a user's own post
 *
 * @param postId - Post ID to delete
 * @returns Error object or null on success
 */
export async function deletePost(postId: string): Promise<{ error: string } | null> {
  const user = await getUser()

  if (!user) {
    return { error: 'You must be logged in to delete a post' }
  }

  const supabase = await createClient()

  // First verify ownership
  const { data: post, error: fetchError } = await supabase
    .from('community_posts')
    .select('id, author_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) {
    return { error: 'Post not found' }
  }

  if (post.author_id !== user.id) {
    return { error: 'You can only delete your own posts' }
  }

  const { error: deleteError } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    console.error('Error deleting post:', deleteError)
    return { error: 'Failed to delete post' }
  }

  revalidatePath('/dashboard')
  return null
}
