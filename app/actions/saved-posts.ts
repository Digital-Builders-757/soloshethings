'use server'

import { revalidatePath } from 'next/cache'

import { createClient, getUser } from '@/lib/supabase/server'

type ToggleSavedCommunityPostState = {
  error?: string
  success?: boolean
  saved?: boolean
  message?: string
}

export async function toggleSavedCommunityPost(
  _prevState: ToggleSavedCommunityPostState | null,
  formData: FormData
): Promise<ToggleSavedCommunityPostState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You need to be logged in to save a story.' }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? ''}`.trim() || '/places'

  if (!postId) {
    return { error: 'Missing story details for this save.' }
  }

  const supabase = await createClient()

  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, author_id, title, is_public, status')
    .eq('id', postId)
    .eq('status', 'published')
    .or(`is_public.eq.true,author_id.eq.${user.id}`)
    .maybeSingle()

  if (postError) {
    console.error('Toggle saved post lookup error:', postError)
    return { error: 'Could not check that story right now. Please try again.' }
  }

  if (!post) {
    return { error: 'That story is not available to save from here.' }
  }

  const { data: existingSave, error: existingSaveError } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_type', 'community')
    .eq('community_post_id', postId)
    .maybeSingle()

  if (existingSaveError) {
    console.error('Toggle saved post existing lookup error:', existingSaveError)
    return { error: 'Could not check your saved stories right now. Please try again.' }
  }

  if (existingSave) {
    const { error: deleteError } = await supabase.from('saved_posts').delete().eq('id', existingSave.id)

    if (deleteError) {
      console.error('Toggle saved post delete error:', deleteError)
      return { error: 'Could not remove this story from your saves right now.' }
    }

    revalidatePath(path)
    revalidatePath('/saved')

    return {
      success: true,
      saved: false,
      message: `Removed “${post.title}” from your saved stories.`,
    }
  }

  const { error: insertError } = await supabase.from('saved_posts').insert({
    user_id: user.id,
    post_type: 'community',
    community_post_id: postId,
  })

  if (insertError) {
    console.error('Toggle saved post insert error:', insertError)
    return { error: 'Could not save this story right now. Please try again.' }
  }

  revalidatePath(path)
  revalidatePath('/saved')

  return {
    success: true,
    saved: true,
    message: `Saved “${post.title}” to your story list.`,
  }
}
