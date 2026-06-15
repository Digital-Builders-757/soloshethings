/**
 * Blog Post Detail Page
 *
 * WordPress editorial content (public, no auth required)
 * ISR with webhook revalidation on WordPress publish
 * Server-side fetch only
 * Content sanitization via Prose component
 *
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 *
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * Returns 404 when WP_URL is not configured or post not found.
 */

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Prose } from '@/components/prose'
import { SectionHeader } from '@/components/ui/section-header'
import { getWpPostBySlug, isWordPressConfigured } from '@/lib/wp-rest'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  // If WordPress not configured, return generic metadata
  if (!isWordPressConfigured()) {
    return {
      title: 'Post Not Found',
    }
  }

  const post = await getWpPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 160)

  return {
    title: post.title.rendered,
    description: excerpt,
  }
}

function formatArticleDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  // If WordPress not configured, return 404
  if (!isWordPressConfigured()) {
    notFound()
  }

  const post = await getWpPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const featuredImage =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const author = post._embedded?.author?.[0]?.name || 'Solo SHE Things'
  const formattedDate = formatArticleDate(post.date)

  return (
    <main className="section-y shell-inline min-w-0 flex-1 overflow-x-clip">
      <div className="mx-auto max-w-4xl">
        <article>
          <header className="mb-8">
            <SectionHeader
              id="blog-article"
              tone="blog"
              size="page"
              eyebrow="SHE Stories"
              title={post.title.rendered}
              className="mb-4"
            />
            <p className="text-sm text-brand-blue/85">
              <span>By {author}</span>
              <span className="mx-2" aria-hidden="true">
                •
              </span>
              <time dateTime={post.date}>{formattedDate}</time>
            </p>
            {featuredImage ? (
              <div className="relative mb-8 mt-6 aspect-video overflow-hidden rounded-xl bg-neutral-200">
                <Image
                  src={featuredImage}
                  alt={
                    post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ||
                    post.title.rendered
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </header>

          <Prose html={post.content.rendered} />
        </article>

        <nav className="mt-16 pt-8" aria-label="Blog navigation">
          <div className="section-divider mb-8" />
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
          >
            ← Back to Blog
          </Link>
        </nav>
      </div>
    </main>
  )
}
