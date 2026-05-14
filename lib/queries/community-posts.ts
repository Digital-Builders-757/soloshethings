import type { Database } from '@/types/database'

import { getPostImageSignedUrl } from '@/lib/storage/post-images'
import { createClient } from '@/lib/supabase/server'

type CommunityPost = Database['public']['Tables']['community_posts']['Row']
type PostImage = Database['public']['Tables']['post_images']['Row']

export type RecentCommunityPost = CommunityPost & {
  images: Array<
    PostImage & {
      signedUrl: string | null
    }
  >
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

  if (posts.length === 0) {
    return []
  }

  const postIds = posts.map((post) => post.id)
  const { data: images, error: imagesError } = await supabase
    .from('post_images')
    .select('id, post_id, image_url, storage_path, alt_text, order, created_at')
    .in('post_id', postIds)
    .order('order', { ascending: true })

  if (imagesError) {
    console.error('Failed to fetch author post images:', imagesError)
  }

  const imagesByPostId = new Map<string, PostImage[]>()

  for (const image of images ?? []) {
    const current = imagesByPostId.get(image.post_id) ?? []
    current.push(image)
    imagesByPostId.set(image.post_id, current)
  }

  return Promise.all(
    posts.map(async (post) => {
      const postImages = imagesByPostId.get(post.id) ?? []
      const resolvedImages = await Promise.all(
        postImages.map(async (image) => ({
          ...image,
          signedUrl: await getPostImageSignedUrl(image.storage_path),
        }))
      )

      return {
        ...post,
        images: resolvedImages,
      }
    })
  )
}
