/**
 * Post Card Component
 *
 * Displays a single blog post or community post in the dashboard
 */

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ExternalLink } from 'lucide-react'

type WordPressPostCardProps = {
  type: 'wordpress'
  id: number
  title: string
  excerpt: string
  slug: string
  date: string
  featuredImage?: string
  author?: string
}

type CommunityPostCardProps = {
  type: 'community'
  id: string
  title: string
  content: string
  createdAt: string
  author?: {
    username: string
    fullName?: string | null
    avatarUrl?: string | null
  }
  isOwn?: boolean
}

type PostCardProps = WordPressPostCardProps | CommunityPostCardProps

export function PostCard(props: PostCardProps) {
  if (props.type === 'wordpress') {
    return <WordPressPostCard {...props} />
  }
  return <CommunityPostCard {...props} />
}

function WordPressPostCard({
  title,
  excerpt,
  slug,
  date,
  featuredImage,
  author,
}: WordPressPostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#efdac1] bg-white shadow-sm transition-all hover:shadow-md hover:border-[#e34b16]/30">
      {featuredImage && (
        <div className="relative aspect-video overflow-hidden bg-[#f7e8be]">
          <Image
            src={featuredImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>
      )}
      {!featuredImage && (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#f7e8be] to-[#fab642]/30">
          <span className="text-4xl text-[#7a331b]/30">SST</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-[#7a331b] group-hover:text-[#e34b16] transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[#6d5849]">
            {excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#6d5849]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
            {author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author}
              </span>
            )}
          </div>
          <Link
            href={`/blog/${slug}`}
            className="flex items-center gap-1 text-sm font-medium text-[#e34b16] transition-colors hover:text-[#c74010]"
          >
            Read
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function CommunityPostCard({
  title,
  content,
  createdAt,
  author,
  isOwn,
}: CommunityPostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Truncate content for preview
  const preview = content.length > 150 ? content.substring(0, 150) + '...' : content

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#efdac1] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#e34b16]/30">
      {isOwn && (
        <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[#fab642]/20 px-2 py-0.5 text-xs font-medium text-[#7a331b]">
          Your Post
        </span>
      )}
      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-[#7a331b] group-hover:text-[#e34b16] transition-colors">
        {title}
      </h3>
      <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-[#6d5849]">
        {preview}
      </p>
      <div className="mt-auto flex items-center gap-3 text-xs text-[#6d5849]">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </span>
        {author && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {author.fullName || author.username}
          </span>
        )}
      </div>
    </article>
  )
}
