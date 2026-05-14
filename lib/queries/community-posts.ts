import type { Database } from '@/types/database'

import { getPostImageSignedUrl } from '@/lib/storage/post-images'
import { createClient } from '@/lib/supabase/server'

type CommunityPost = Database['public']['Tables']['community_posts']['Row']
type PostImage = Database['public']['Tables']['post_images']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

type ResolvedPostImage = PostImage & {
  signedUrl: string | null
}

export type RecentCommunityPost = CommunityPost & {
  images: ResolvedPostImage[]
}

export type CommunityPostDetail = CommunityPost & {
  author: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'> | null
  images: ResolvedPostImage[]
}

async function getResolvedImages(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, ResolvedPostImage[]>()
  }

  const supabase = await createClient()
  const { data: images, error: imagesError } = await supabase
    .from('post_images')
    .select('id, post_id, image_url, storage_path, alt_text, order, created_at')
    .in('post_id', postIds)
    .order('order', { ascending: true })

  if (imagesError) {
    console.error('Failed to fetch post images:', imagesError)
  }

  const imagesByPostId = new Map<string, ResolvedPostImage[]>()

  for (const image of images ?? []) {
    const current = imagesByPostId.get(image.post_id) ?? []
    current.push({
      ...image,
      signedUrl: await getPostImageSignedUrl(image.storage_path),
    })
    imagesByPostId.set(image.post_id, current)
  }

  return imagesByPostId
}

export async function getRecentPostsForAuthor(authorId: string, limit = 6): Promise<RecentCommunityPost[]> {
  const supabase = await createClient()

  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('id, author_id, title, content, is_public, is_featured, status, created_at, updated_at')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (postsError || !posts) {
    console.error('Failed to fetch author community posts:', postsError)
    return []
  }

  const imagesByPostId = await getResolvedImages(posts.map((post) => post.id))

  return posts.map((post) => ({
    ...post,
    images: imagesByPostId.get(post.id) ?? [],
  }))
}

export async function getCommunityPostDetail(postId: string): Promise<CommunityPostDetail | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('community_posts')
    .select(
      `
        id,
        author_id,
        title,
        content,
        is_public,
        is_featured,
        status,
        created_at,
        updated_at,
        profiles:profiles!community_posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `
    )
    .eq('id', postId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch community post detail:', error)
    return null
  }

  if (!post) {
    return null
  }

  const imagesByPostId = await getResolvedImages([post.id])

  return {
    ...post,
    author: Array.isArray(post.profiles) ? (post.profiles[0] ?? null) : post.profiles,
    images: imagesByPostId.get(post.id) ?? [],
  }
}
