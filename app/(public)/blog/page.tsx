/**
 * Blog List Page
 *
 * WordPress editorial content (public, no auth required)
 * ISR with 1-hour revalidation
 * Server-side fetch only
 *
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 *
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * Shows "Coming Soon" when WP_URL is not configured.
 */

import Image from 'next/image'
import Link from 'next/link'

import { EmptyState } from '@/components/ui/empty-state'
import { SectionHeader } from '@/components/ui/section-header'
import { getWpPosts, isWordPressConfigured } from '@/lib/wp-rest'
import type { WpPostListResponse } from '@/lib/wp-types'

export default async function BlogPage() {
  const wpConfigured = isWordPressConfigured()
  const posts: WpPostListResponse = await getWpPosts({ perPage: 12 })

  return (
    <main className="section-y shell-inline min-w-0 flex-1 overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          as="header"
          id="blog-index"
          tone="blog"
          size="page"
          eyebrow="Editorial"
          title={
            <>
              SHE <span className="text-brand-blue">Stories</span> & Guides
            </>
          }
          description="Travel guides, destination spotlights, and solo travel stories from the Solo SHE Things publication."
          className="mb-6 md:mb-8"
        />

        {!wpConfigured || posts.length === 0 ? (
          <EmptyState
            id="blog-empty"
            variant="blog"
            eyebrow="Publication"
            title="Stories and guides are on the way"
            description={
              !wpConfigured
                ? 'We are preparing travel content for you. Stay tuned for guides, destination spotlights, and solo travel stories.'
                : 'No posts are published right now. Check back soon for new guides and stories.'
            }
            primaryAction={{
              label: 'Return home',
              href: '/',
              variant: 'secondary',
            }}
            secondaryAction={{
              label: 'About Solo SHE Things',
              href: '/about',
              variant: 'link',
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const featuredImage =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url
              const excerpt = post.excerpt.rendered
                .replace(/<[^>]*>/g, '')
                .trim()
                .substring(0, 150)

              return (
                <article
                  key={post.id}
                  className="surface-card-gradient lift-hover"
                >
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    {featuredImage && (
                      <div className="relative aspect-video overflow-hidden bg-neutral-200">
                        <Image
                          src={featuredImage}
                          alt={
                            post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ||
                            post.title.rendered
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    {!featuredImage && (
                      <div className="aspect-video bg-neutral-200" />
                    )}
                    <div className="p-6">
                      <h2 className="mb-2 line-clamp-2 text-xl font-semibold">
                        {post.title.rendered}
                      </h2>
                      {excerpt ? (
                        <p className="mb-4 line-clamp-3 text-neutral-600">
                          {excerpt}...
                        </p>
                      ) : null}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-medium text-brand-orange hover:text-brand-orange/80"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
