import 'server-only'

import type { Database } from '@/types/database'

import { logServerFailure } from '@/lib/server-log'

import {
  COMMUNITY_STORY_TOPIC_SLUGS,
  placeLabelMatchKey,
  type CommunityStoryTopicSlug,
} from '@/lib/community-story-taxonomy'

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
  place_label,
  story_tags,
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
    Pick<
      CommunityPost,
      | 'id'
      | 'author_id'
      | 'title'
      | 'content'
      | 'is_public'
      | 'is_featured'
      | 'place_label'
      | 'story_tags'
      | 'status'
      | 'created_at'
      | 'updated_at'
    > & {
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
    .select('id, author_id, title, content, is_public, is_featured, place_label, story_tags, status, created_at, updated_at')
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
  limit = 24,
  options?: { sort?: 'newest' | 'oldest' }
): Promise<CommunityFeedPost[]> {
  const supabase = await createClient()
  const ascending = options?.sort === 'oldest'

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(COMMUNITY_FEED_SELECT)
    .eq('status', 'published')
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .order('created_at', { ascending })
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
        place_label,
        story_tags,
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
    .or(
      `and(author_id.eq.${userId},status.neq.removed),and(status.eq.published,is_public.eq.true)`
    )
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

const topicWhitelist = new Set<string>(COMMUNITY_STORY_TOPIC_SLUGS)

function relatedPostScore(
  post: CommunityFeedPost,
  ctx: {
    authorId: string
    placeKey: string | null
    topicSet: Set<string>
    now: number
  }
): number {
  let score = 0

  if (ctx.placeKey) {
    const key = placeLabelMatchKey(post.place_label)
    if (key && key === ctx.placeKey) {
      score += 520
    }
  }

  const tags = post.story_tags ?? []
  let topicOverlap = 0
  for (const tag of tags) {
    if (ctx.topicSet.has(tag)) topicOverlap += 1
  }
  score += topicOverlap * 150

  if (post.author_id === ctx.authorId) {
    score += 260
  }

  if (post.is_featured) {
    score += 95
  }

  score += Math.min(post.images.length, 4) * 22

  const ageDays = Math.max(0, (ctx.now - new Date(post.created_at).getTime()) / 86_400_000)
  score += Math.max(0, 36 - Math.min(36, ageDays))

  return score
}

/**
 * Deduped place lines and topic slugs appearing on published posts visible to the member (same RLS scope as browse).
 */
export async function getCommunityDiscoveryFacets(
  userId: string
): Promise<{ places: string[]; topics: CommunityStoryTopicSlug[] }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_posts')
    .select('place_label, story_tags')
    .eq('status', 'published')
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .limit(600)

  if (error || !data) {
    if (error) {
      logServerFailure({
        category: 'query',
        operation: 'getCommunityDiscoveryFacets',
        cause: error,
        context: { userId },
      })
    }
    return { places: [], topics: [] }
  }

  const placeSeen = new Set<string>()
  const placesOrdered: string[] = []

  for (const row of data) {
    const label = row.place_label?.trim()
    if (!label) continue
    const dedupeKey = label.toLocaleLowerCase('en-US')
    if (placeSeen.has(dedupeKey)) continue
    placeSeen.add(dedupeKey)
    placesOrdered.push(label)
  }

  placesOrdered.sort((a, b) => a.localeCompare(b, 'en-US', { sensitivity: 'base' }))

  const topicsSeen = new Set<CommunityStoryTopicSlug>()
  for (const row of data) {
    for (const tag of row.story_tags ?? []) {
      if (topicWhitelist.has(tag)) {
        topicsSeen.add(tag as CommunityStoryTopicSlug)
      }
    }
  }

  const topics = Array.from(topicsSeen).sort(
    (a, b) => COMMUNITY_STORY_TOPIC_SLUGS.indexOf(a) - COMMUNITY_STORY_TOPIC_SLUGS.indexOf(b)
  )

  return { places: placesOrdered, topics }
}

export async function getCommunityRelatedPosts(
  userId: string,
  currentPostId: string,
  authorId: string,
  options?: {
    placeLabel?: string | null
    storyTags?: string[] | null
    limit?: number
  }
): Promise<CommunityFeedPost[]> {
  const limit = options?.limit ?? 3

  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('community_posts')
    .select(COMMUNITY_FEED_SELECT)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .or(`is_public.eq.true,author_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(48)

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
  const placeKey = placeLabelMatchKey(options?.placeLabel)
  const topicSet = new Set((options?.storyTags ?? []).filter(Boolean))
  const now = Date.now()

  const scored = resolvedPosts
    .map((post) => ({
      post,
      score: relatedPostScore(post, { authorId, placeKey, topicSet, now }),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score

      return new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime()
    })

  return scored.slice(0, limit).map((row) => row.post)
}
