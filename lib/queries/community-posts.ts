import 'server-only'

import type { Database } from '@/types/database'

import { logServerFailure } from '@/lib/server-log'

import { getAvatarSignedUrl } from '@/lib/storage/avatars'
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

type CommunityPostAuthor = Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>

const COMMUNITY_FEED_SELECT = `
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

export type CommunityPostDetail = CommunityPost & {
  author: CommunityPostAuthor | null
  images: ResolvedPostImage[]
}

export type CommunityFeedPost = CommunityPost & {
  author: CommunityPostAuthor | null
  authorAvatarUrl: string | null
  images: ResolvedPostImage[]
}

async function resolveFeedPostsWithAuthors(
  posts: Array<
    Pick<CommunityPost, 'id' | 'author_id' | 'title' | 'content' | 'is_public' | 'is_featured' | 'status' | 'created_at' | 'updated_at'> & {
      profiles: CommunityPostAuthor | CommunityPostAuthor[] | null
    }
  >
): Promise<CommunityFeedPost[]> {
  const imagesByPostId = await getResolvedImages(posts.map((post) => post.id))

  return Promise.all(
    posts.map(async (post) => {
      const author = Array.isArray(post.profiles) ? (post.profiles[0] ?? null) : post.profiles

      return {
        ...post,
        author,
        authorAvatarUrl: await getAvatarSignedUrl(author?.avatar_url),
        images: imagesByPostId.get(post.id) ?? [],
      }
    })
  )
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
    logServerFailure({
      category: 'query',
      operation: 'getResolvedImages',
      cause: imagesError,
      context: { postIdCount: postIds.length },
    })
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
    if (postsError) {
      logServerFailure({
        category: 'query',
        operation: 'getRecentPostsForAuthor',
        cause: postsError,
        context: { authorId },
      })
    }
    return []
  }

  const imagesByPostId = await getResolvedImages(posts.map((post) => post.id))

  return posts.map((post) => ({
    ...post,
    images: imagesByPostId.get(post.id) ?? [],
  }))
}

export async function getCommunityFeedPosts(
  userId: string,
  limit = 24
): Promise<CommunityFeedPost[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(COMMUNITY_FEED_SELECT)
    .eq('status', 'published')
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !posts) {
    if (error) {
      logServerFailure({
        category: 'query',
        operation: 'getCommunityFeedPosts',
        cause: error,
        context: { userId },
      })
    }
    return []
  }

  return resolveFeedPostsWithAuthors(posts)
}

export async function getCommunityPostsByIds(
  userId: string,
  postIds: string[]
): Promise<CommunityFeedPost[]> {
  if (postIds.length === 0) {
    return []
  }

  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(COMMUNITY_FEED_SELECT)
    .eq('status', 'published')
    .in('id', postIds)
    .or(`is_public.eq.true,author_id.eq.${userId}`)

  if (error || !posts) {
    if (error) {
      logServerFailure({
        category: 'query',
        operation: 'getCommunityPostsByIds',
        cause: error,
        context: { userId, postIdCount: postIds.length },
      })
    }
    return []
  }

  return resolveFeedPostsWithAuthors(posts)
}

export async function getCommunityPostDetail(postId: string, userId: string): Promise<CommunityPostDetail | null> {
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
    .eq('status', 'published')
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .maybeSingle()

  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'getCommunityPostDetail',
      cause: error,
      context: { userId, postId },
    })
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

export async function getCommunityRelatedPosts(
  userId: string,
  currentPostId: string,
  authorId: string,
  limit = 3
): Promise<CommunityFeedPost[]> {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(COMMUNITY_FEED_SELECT)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(18)

  if (error || !posts) {
    if (error) {
      logServerFailure({
        category: 'query',
        operation: 'getCommunityRelatedPosts',
        cause: error,
        context: { userId, currentPostId, authorId },
      })
    }
    return []
  }

  const resolvedPosts = await resolveFeedPostsWithAuthors(posts)
  const sameAuthorPosts = resolvedPosts.filter((post) => post.author_id === authorId)
  const featuredPosts = resolvedPosts.filter((post) => post.author_id !== authorId && post.is_featured)
  const photoPosts = resolvedPosts.filter(
    (post) => post.author_id !== authorId && !post.is_featured && post.images.length > 0
  )
  const otherPosts = resolvedPosts.filter(
    (post) => post.author_id !== authorId && !post.is_featured && post.images.length === 0
  )

  return [...sameAuthorPosts, ...featuredPosts, ...photoPosts, ...otherPosts].slice(0, limit)
}
