import { getCommunityPostsByIds, type CommunityFeedPost } from '@/lib/queries/community-posts'
import { createClient } from '@/lib/supabase/server'

type SavedPostRow = {
  community_post_id: string | null
  created_at: string
}

export type SavedCommunityPost = CommunityFeedPost & {
  saved_at: string
}

export async function getSavedCommunityPostIds(userId: string, postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) {
    return new Set()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_posts')
    .select('community_post_id')
    .eq('user_id', userId)
    .eq('post_type', 'community')
    .in('community_post_id', postIds)

  if (error) {
    console.error('Failed to fetch saved community post ids:', error)
    return new Set()
  }

  return new Set((data ?? []).flatMap((row) => (row.community_post_id ? [row.community_post_id] : [])))
}

export async function getSavedCommunityPosts(userId: string): Promise<SavedCommunityPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_posts')
    .select('community_post_id, created_at')
    .eq('user_id', userId)
    .eq('post_type', 'community')
    .not('community_post_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch saved community posts:', error)
    return []
  }

  const savedRows = (data ?? []) as SavedPostRow[]
  const postIds = savedRows.flatMap((row) => (row.community_post_id ? [row.community_post_id] : []))

  if (postIds.length === 0) {
    return []
  }

  const posts = await getCommunityPostsByIds(userId, postIds)
  const postsById = new Map(posts.map((post) => [post.id, post]))

  return savedRows.flatMap((row) => {
    if (!row.community_post_id) {
      return []
    }

    const post = postsById.get(row.community_post_id)
    if (!post) {
      return []
    }

    return [{
      ...post,
      saved_at: row.created_at,
    }]
  })
}
