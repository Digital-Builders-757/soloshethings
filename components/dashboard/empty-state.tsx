/**
 * Empty State Component
 *
 * Displays helpful empty state messages with optional CTA
 */

import Link from 'next/link'
import { FileText, BookOpen, PlusCircle } from 'lucide-react'

type EmptyStateVariant = 'user-posts' | 'blog-posts' | 'community-posts'

type EmptyStateProps = {
  variant: EmptyStateVariant
}

const variants: Record<
  EmptyStateVariant,
  {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    ctaText?: string
    ctaHref?: string
  }
> = {
  'user-posts': {
    icon: FileText,
    title: 'No posts yet',
    description: "You haven't created any posts yet. Share your travel stories and experiences with the community!",
    ctaText: 'Create Your First Post',
    ctaHref: '/dashboard/create',
  },
  'blog-posts': {
    icon: BookOpen,
    title: 'Blog coming soon',
    description: "We're preparing amazing travel content for you. Check back soon for travel guides, destination spotlights, and solo travel stories!",
  },
  'community-posts': {
    icon: FileText,
    title: 'No community posts yet',
    description: 'Be the first to share your travel story with the Solo SHE Things community!',
    ctaText: 'Create a Post',
    ctaHref: '/dashboard/create',
  },
}

export function EmptyState({ variant }: EmptyStateProps) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#efdac1] bg-[#fffaf0]/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e8be]/50">
        <Icon className="h-7 w-7 text-[#7a331b]" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#7a331b]">{config.title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#6d5849]">
        {config.description}
      </p>
      {config.ctaText && config.ctaHref && (
        <Link
          href={config.ctaHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#e34b16] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#c74010] active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          {config.ctaText}
        </Link>
      )}
    </div>
  )
}
