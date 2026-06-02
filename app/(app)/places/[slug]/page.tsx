/**
 * Community place/story detail (authenticated shell).
 * Middleware enforces session; this page repeats getUser() per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import {
  CommunityBadgeFeatured,
  CommunityBadgeReported,
  CommunityChipPrivate,
  CommunityChipPublic,
  CommunityChipTopic,
} from '@/components/community/community-story-surface'
import { CommunityAuthorPreview } from '@/components/community/community-author-preview'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { ReportPostForm } from '@/components/safety/report-post-form'
import { OwnerCommunityPostManager } from '@/components/submit/owner-community-post-manager'
import { OwnerPostImageManager } from '@/components/submit/owner-post-image-manager'
import { MemberProfileLink } from '@/components/profile/member-profile-link'
import { appendCommunityAuthorParams, buildStoryDetailHref, getCommunityReturnLink } from '@/lib/community-navigation'
import { COMMUNITY_STORY_TOPIC_LABELS, placeLabelMatchKey, type CommunityStoryTopicSlug } from '@/lib/community-story-taxonomy'
import { ensureCommunityStoryReadAllowed } from '@/lib/billing/community-story-reads'
import { type CommunityFeedPost, getCommunityPostDetail, getCommunityRelatedPosts } from '@/lib/queries/community-posts'
import { getLatestMemberPostReportsForPosts, REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '@/lib/queries/reports'
import { getSavedCommunityPostIds } from '@/lib/queries/saved-posts'
import { getAvatarSignedUrl } from '@/lib/storage/avatars'
import { getUser } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ returnTo?: string }>
}

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function relatedStoryReason(args: {
  baseAuthorId: string
  baseAuthorDisplay: string
  basePlaceKey: string | null
  baseTopicSet: Set<string>
  related: CommunityFeedPost
}): string {
  const snippets: string[] = []

  if (args.related.author_id === args.baseAuthorId) {
    snippets.push(`More from ${args.baseAuthorDisplay}`)
  }

  if (args.basePlaceKey) {
    const relatedKey = placeLabelMatchKey(args.related.place_label)
    if (relatedKey && relatedKey === args.basePlaceKey) {
      snippets.push('Same place anchor')
    }
  }

  let overlap = 0
  for (const tag of args.related.story_tags ?? []) {
    if (args.baseTopicSet.has(tag)) overlap += 1
  }
  if (overlap > 0) {
    snippets.push(overlap === 1 ? 'Shared story angle' : `Shared story angles (${overlap})`)
  }

  if (snippets.length === 0) {
    if (args.related.is_featured) return 'Featured story'
    if (args.related.images.length > 0) return 'Story with photos'
    return 'Fresh from the community'
  }

  return snippets.slice(0, 2).join(' · ')
}

function reportStatusTone(status: 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'withdrawn') {
  switch (status) {
    case 'resolved':
      return 'border-green-200 bg-green-50 text-green-800'
    case 'dismissed':
      return 'border-slate-200 bg-slate-50 text-slate-700'
    case 'reviewed':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    case 'withdrawn':
      return 'border-violet-200 bg-violet-50 text-violet-800'
    default:
      return 'border-[#ead8c2] bg-white text-[#7a331b]'
  }
}

function buildPlacesExploreHref(options?: {
  query?: string
  view?: 'featured' | 'photos' | 'mine'
  authorId?: string
  authorLabel?: string
  place?: string | null
  topic?: CommunityStoryTopicSlug | string | null
  sort?: 'newest' | 'oldest'
}) {
  const params = new URLSearchParams()

  if (options?.query?.trim()) {
    params.set('q', options.query.trim())
  }

  if (options?.view) {
    params.set('view', options.view)
  }

  appendCommunityAuthorParams(params, options?.authorId, options?.authorLabel)

  if (options?.place?.trim()) {
    params.set('place', options.place.trim())
  }

  if (options?.topic?.trim()) {
    params.set('topic', options.topic.trim())
  }

  if (options?.sort === 'oldest') {
    params.set('sort', 'oldest')
  }

  const search = params.toString()
  return search ? `/places?${search}` : '/places'
}

export default async function PlaceDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/places/${slug}`)}`)
  }

  const post = await getCommunityPostDetail(slug, user.id)

  if (!post) {
    notFound()
  }

  const readGate = await ensureCommunityStoryReadAllowed({
    readerId: user.id,
    authorId: post.author_id,
    postId: post.id,
  })
  if (!readGate.ok) {
    redirect(`/subscribe?reason=${readGate.reason}`)
  }

  const relatedPosts = await getCommunityRelatedPosts(user.id, post.id, post.author_id, {
    placeLabel: post.place_label,
    storyTags: post.story_tags ?? [],
  })
  const authorAvatarUrl = await getAvatarSignedUrl(post.author?.avatar_url)
  const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
  const basePlaceKey = placeLabelMatchKey(post.place_label ?? null)
  const baseTopicSet = new Set(post.story_tags ?? [])
  const isOwnPost = post.author_id === user.id
  const returnLink = getCommunityReturnLink(resolvedSearchParams?.returnTo)
  const submitReturnTo = returnLink.href.split('?')[0] === '/submit' ? returnLink.href : null
  const savedPostIds = await getSavedCommunityPostIds(user.id, [post.id])
  const latestReportsByPostId = await getLatestMemberPostReportsForPosts(user.id, [post.id])
  const latestReport = latestReportsByPostId.get(post.id)
  const isSaved = savedPostIds.has(post.id)
  const hasOpenReport = latestReport?.status === 'pending' || latestReport?.status === 'reviewed'
  const savedStoriesHref = returnLink.active === 'saved' ? returnLink.href : '/saved'
  const savedStoriesLabel = returnLink.active === 'saved' ? 'Back to saved stories' : 'Open saved stories'
  const reportHistoryHref = returnLink.active === 'reports' ? returnLink.href : '/reports'
  const reportHistoryLabel = returnLink.active === 'reports' ? 'Back to report history' : 'Open report history'
  const exploreAuthorHref = buildPlacesExploreHref({ authorId: post.author_id, authorLabel: authorName })
  const exploreFeaturedHref = buildPlacesExploreHref({ view: 'featured' })
  const explorePhotosHref = buildPlacesExploreHref({ view: 'photos' })
  const exploreMineHref = buildPlacesExploreHref({ view: 'mine' })
  const explorePlaceHref =
    post.place_label && post.place_label.trim().length > 0
      ? buildPlacesExploreHref({ place: post.place_label.trim() })
      : null

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <div className="story-detail-breadcrumb-strip mb-6">
        <nav aria-label="Breadcrumb" className="text-sm text-brand-blue/85">
          <Link href="/dashboard" className="font-semibold text-brand-orange transition hover:text-brand-coral">
            My dashboard
          </Link>
          <span className="mx-2 text-brand-gold/90" aria-hidden>
            /
          </span>
          <Link href={returnLink.href} className="font-semibold text-brand-orange transition hover:text-brand-coral">
            {returnLink.label}
          </Link>
          <span className="mx-2 text-brand-gold/90" aria-hidden>
            /
          </span>
          <span className="font-medium text-brand-pinkDark">Story detail</span>
        </nav>
        <p className="story-detail-return-hint">
          Return path: you can jump back to{' '}
          <Link href={returnLink.href} className="font-semibold text-brand-orange underline-offset-2 hover:underline">
            {returnLink.label.toLowerCase()}
          </Link>{' '}
          anytime — filters and workspace context stay where you left them.
        </p>
      </div>

      <CommunitySurfaceNav active={returnLink.active} backHref={returnLink.href} backLabel={returnLink.label} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <article className="min-w-0">
          <header
            className={cn(
              'places-hero-shell overflow-hidden p-6 sm:p-8 lg:p-10',
              post.is_featured && 'story-detail-hero-featured'
            )}
          >
            <div className="places-hero-inner">
              <div className="flex flex-wrap items-center gap-2">
                {post.is_public ? (
                  <CommunityChipPublic>Public member story</CommunityChipPublic>
                ) : (
                  <CommunityChipPrivate>Private story</CommunityChipPrivate>
                )}
                {post.is_featured ? <CommunityBadgeFeatured /> : null}
                <span className="story-meta-chip">Published</span>
                {latestReport ? <CommunityBadgeReported /> : null}
              </div>

              <h1 className="mt-5 text-balance font-serif text-3xl font-bold text-brand-pinkDark sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                {post.title}
              </h1>

              {post.place_label?.trim() ? (
                <p className="story-detail-meta-kicker mt-3">
                  <span className="font-semibold uppercase tracking-[0.14em] text-brand-orange">Place anchor · </span>
                  {post.place_label.trim()}
                </p>
              ) : null}

              <CommunityAuthorPreview
                className="mt-6 border-t border-brand-brown/10 pt-6"
                username={post.author?.username}
                fullName={post.author?.full_name}
                avatarUrl={authorAvatarUrl}
                size="lg"
                nameSuffix={
                  isOwnPost ? (
                    <span className="ml-2 inline-flex rounded-full bg-brand-gold/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-pinkDark">
                      Your story
                    </span>
                  ) : null
                }
                meta={
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-blue/85">
                    <time dateTime={post.created_at} className="font-medium text-brand-pinkDark/90">
                      {formatPublishedAt(post.created_at)}
                    </time>
                    {post.images.length > 0 ? (
                      <>
                        <span className="text-brand-gold" aria-hidden>
                          ·
                        </span>
                        <span>
                          {post.images.length} photo{post.images.length === 1 ? '' : 's'}
                        </span>
                      </>
                    ) : null}
                  </p>
                }
              />

              <div className="community-context-banner mt-6 px-4 py-3 text-sm leading-relaxed text-brand-blue/90">
                This is the live member story view — same copy others see when the post is public. If something feels off,
                use reporting tools in the sidebar for public stories.
              </div>

              {(post.story_tags ?? []).filter(Boolean).length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Story angles">
                  {(post.story_tags ?? []).map((slug) => {
                    const label = COMMUNITY_STORY_TOPIC_LABELS[slug as CommunityStoryTopicSlug]
                    if (!label) return null
                    return (
                      <CommunityChipTopic key={slug} className="px-3 py-1 text-[0.65rem]">
                        {label}
                      </CommunityChipTopic>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </header>

          {post.images.length > 0 ? (
            <section className="mt-8" aria-labelledby="story-photos-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p id="story-photos-heading" className="story-detail-photo-section-label">
                    Field photos
                  </p>
                  <p className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">How this story looked on the ground</p>
                </div>
                <span className="community-summary-chip community-summary-chip-gold text-xs">
                  {post.images.length} image{post.images.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {post.images.map((image, index) => (
                  <figure key={image.id} className="story-detail-photo-frame relative aspect-[4/3]">
                    {image.signedUrl ? (
                      <Image
                        src={image.signedUrl}
                        alt={image.alt_text ?? `${post.title} photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-brand-blue/85">
                        Photo preview unavailable right now.
                      </div>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <section className="story-detail-body-panel mt-8 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-[0.65rem] tracking-[0.22em]">The narrative</span>
              <span className="h-px flex-1 bg-gradient-to-r from-brand-orange/35 to-transparent sm:max-w-[12rem]" aria-hidden />
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-brand-pinkDark">Story</h2>
            <div className="prose prose-neutral prose-headings:font-serif prose-headings:text-brand-pinkDark prose-a:text-brand-orange hover:prose-a:text-brand-coral mt-5 max-w-none whitespace-pre-wrap break-words text-brand-blue">
              {post.content}
            </div>
          </section>

          {relatedPosts.length > 0 ? (
            <section className="story-detail-related-section mt-8 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Keep exploring</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-brand-pinkDark md:text-3xl">
                    Grounded next reads
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-blue/85">
                    Pulled from authors, place anchors, and story angles that overlap with what you are reading — not a separate recommendation engine.
                  </p>
                </div>
                <Link
                  href={returnLink.href}
                  className="inline-flex shrink-0 text-sm font-semibold text-brand-orange transition hover:text-brand-coral"
                >
                  Back to {returnLink.label.toLowerCase()} →
                </Link>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {relatedPosts.map((relatedPost, relatedIndex) => {
                  const relatedAuthorName =
                    relatedPost.author?.full_name?.trim() || relatedPost.author?.username || 'Solo SHE member'
                  const relatedHref = buildStoryDetailHref(relatedPost.id, returnLink.href)
                  const relatedReason = relatedStoryReason({
                    baseAuthorId: post.author_id,
                    baseAuthorDisplay: authorName,
                    basePlaceKey,
                    baseTopicSet,
                    related: relatedPost,
                  })

                  return (
                    <article
                      key={relatedPost.id}
                      className={cn(
                        'story-detail-related-card flex flex-col p-4 sm:p-5',
                        relatedIndex === 0 && 'lg:ring-2 lg:ring-brand-gold/35'
                      )}
                    >
                      <p className="community-section-label text-[0.65rem]">{relatedReason}</p>
                      <h3 className="mt-3 font-serif text-xl font-semibold text-brand-pinkDark">
                        <Link href={relatedHref} className="transition hover:text-brand-orange">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-brand-pinkDark">
                        <MemberProfileLink
                          username={relatedPost.author?.username}
                          className="text-brand-pinkDark hover:text-brand-orange"
                        >
                          {relatedAuthorName}
                        </MemberProfileLink>
                      </p>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-brand-blue/85">{relatedPost.content}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relatedPost.is_public ? (
                          <CommunityChipPublic className="text-[0.58rem]">Public</CommunityChipPublic>
                        ) : (
                          <CommunityChipPrivate className="text-[0.58rem]">Private to owner</CommunityChipPrivate>
                        )}
                        {relatedPost.is_featured ? <CommunityBadgeFeatured /> : null}
                        <span className="story-meta-chip text-[0.58rem]">
                          {relatedPost.images.length} photo{relatedPost.images.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <Link
                        href={relatedHref}
                        className="mt-5 inline-flex text-sm font-semibold text-brand-orange transition hover:text-brand-coral"
                      >
                        Open story →
                      </Link>
                    </article>
                  )
                })}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="story-detail-aside-panel p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Save for later</p>
            <h2 className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">Keep this story close</h2>
            <div className="mt-4">
              <SaveCommunityPostButton postId={post.id} path={`/places/${post.id}`} initialSaved={isSaved} variant="card" />
            </div>
            <Link
              href={savedStoriesHref}
              className="mt-4 inline-flex text-sm font-semibold text-brand-orange transition hover:text-brand-coral"
            >
              {savedStoriesLabel} →
            </Link>
          </div>

          {!isOwnPost && latestReport ? (
            <div className="story-detail-aside-panel p-5 sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Your report status</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">You already flagged this story</h2>
              <div className={`mt-4 inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${reportStatusTone(latestReport.status)}`}>
                {REPORT_STATUS_LABELS[latestReport.status]}
              </div>
              <p className="mt-4 text-sm leading-6 text-brand-blue/85">
                Latest reason:{' '}
                <span className="font-semibold text-brand-pinkDark">{REPORT_REASON_LABELS[latestReport.reason]}</span>
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-blue/85">
                Sent {formatPublishedAt(latestReport.created_at)}. You can track the full moderation timeline from your private reports page.
              </p>
              <Link
                href={reportHistoryHref}
                className="mt-4 inline-flex text-sm font-semibold text-brand-orange transition hover:text-brand-coral"
              >
                {reportHistoryLabel} →
              </Link>
            </div>
          ) : null}

          {isOwnPost ? (
            <>
              <OwnerCommunityPostManager
                key={post.updated_at}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                content={post.content}
                isPublic={post.is_public}
                postStatus={post.status}
                placeLabel={post.place_label}
                storyTopics={post.story_tags ?? []}
                submitReturnTo={submitReturnTo}
              />
              <OwnerPostImageManager
                key={`${post.updated_at}-${post.images.map((image) => image.id).join(',')}`}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                images={post.images}
              />
            </>
          ) : post.is_public && !hasOpenReport ? (
            <ReportPostForm postId={post.id} path={`/places/${post.id}`} postTitle={post.title} />
          ) : !post.is_public ? (
            <div className="story-detail-aside-panel p-5 sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Privacy</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">Private stories stay scoped</h2>
              <p className="mt-3 text-sm leading-6 text-brand-blue/85">
                This post is private, so reporting from the shared story detail surface is not enabled.
              </p>
            </div>
          ) : null}

          <div className="story-detail-aside-panel p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Explore from here</p>
            <h2 className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">Use this story as a jumping-off point</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={exploreAuthorHref} className={cn('community-filter-pill community-filter-pill-sm shrink-0')}>
                More from {authorName}
              </Link>
              {post.is_featured ? (
                <Link href={exploreFeaturedHref} className={cn('community-filter-pill community-filter-pill-sm shrink-0')}>
                  Browse featured stories
                </Link>
              ) : null}
              {post.images.length > 0 ? (
                <Link href={explorePhotosHref} className={cn('community-filter-pill community-filter-pill-sm shrink-0')}>
                  Explore stories with photos
                </Link>
              ) : null}
              {explorePlaceHref ? (
                <Link href={explorePlaceHref} className={cn('community-filter-pill community-filter-pill-sm shrink-0')}>
                  Browse this place anchor
                </Link>
              ) : null}
              {(post.story_tags ?? []).map((slug) => {
                const label = COMMUNITY_STORY_TOPIC_LABELS[slug as CommunityStoryTopicSlug]
                if (!label) return null
                return (
                  <Link
                    key={slug}
                    href={buildPlacesExploreHref({ topic: slug })}
                    className={cn('community-filter-pill community-filter-pill-sm shrink-0')}
                  >
                    More {label} stories
                  </Link>
                )
              })}
              {isOwnPost ? (
                <Link href={exploreMineHref} className={cn('community-filter-pill community-filter-pill-sm shrink-0')}>
                  Reopen your story list
                </Link>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-brand-blue/85">
              These shortcuts reuse the live feed filters instead of inventing a second browsing system, so visibility stays honest.
            </p>
          </div>

          {post.is_featured ? (
            <div className="editorial-card-sun p-5 sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Featured story</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-brand-pinkDark">Community-highlighted right now</h2>
              <p className="mt-3 text-sm leading-6 text-brand-blue/85">
                This story is marked as featured, so members can now find it faster from both the browse feed and saved list.
              </p>
            </div>
          ) : null}

          <div className="story-detail-aside-panel p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">What changed</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-brand-blue/85">
              <li>• Story detail now renders saved community post content instead of a placeholder shell.</li>
              <li>• Owners can now edit title, story copy, and visibility from their story detail page.</li>
              <li>• Owners can archive a story to remove it from community surfaces without fake delete copy.</li>
              <li>• Owners can now remove old photos and add new ones from the story detail page.</li>
              <li>• Public stories can be privately reported into the existing moderation table.</li>
              <li>• Members can now track their own report history and moderation status from a dedicated reports page.</li>
              <li>• Stories you already flagged now show your latest report status across browse, saved, and detail surfaces.</li>
              <li>• Featured stories are now visibly tagged across browse, saved, and detail surfaces.</li>
              <li>• Story detail now suggests a few grounded next stories and deep-links back into live feed filters.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
