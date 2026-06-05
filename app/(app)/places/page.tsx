import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ActiveMemberFilterBanner } from '@/components/community/active-member-filter-banner'
import { CommunityStoryCard } from '@/components/community/community-story-card'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { EmptyState } from '@/components/ui/empty-state'
import { UpgradePrompt } from '@/components/ui/upgrade-prompt'
import { Badge } from '@/components/ui/badge'
import { appendCommunityAuthorParams, buildCommunityWorkspaceHref, buildStoryDetailHref } from '@/lib/community-navigation'
import { getMembershipTier } from '@/lib/billing/entitlements'
import {
  COMMUNITY_STORY_TOPIC_LABELS,
  COMMUNITY_STORY_TOPIC_SLUGS,
  placeLabelMatchKey,
  type CommunityStoryTopicSlug,
} from '@/lib/community-story-taxonomy'
import { getCommunityDiscoveryFacets, getCommunityFeedPosts } from '@/lib/queries/community-posts'
import { getLatestMemberPostReportsForPosts } from '@/lib/queries/reports'
import { getSavedCommunityPostIds } from '@/lib/queries/saved-posts'
import { getUser } from '@/lib/supabase/server'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All stories' },
  { value: 'featured', label: 'Featured' },
  { value: 'public', label: 'Public' },
  { value: 'mine', label: 'My stories' },
  { value: 'saved', label: 'Saved' },
  { value: 'reported', label: 'Reported by you' },
  { value: 'photos', label: 'With photos' },
] as const

type ViewFilter = (typeof VIEW_OPTIONS)[number]['value']

type Props = {
  searchParams?: Promise<{
    q?: string
    view?: string
    page?: string
    author?: string
    authorLabel?: string
    place?: string
    topic?: string
    sort?: string
  }>
}

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function normalizeQuery(value?: string) {
  return value?.trim() ?? ''
}

function normalizeView(value?: string): ViewFilter {
  return VIEW_OPTIONS.some((option) => option.value === value) ? (value as ViewFilter) : 'all'
}

function normalizeAuthor(value?: string) {
  return value?.trim() ?? ''
}

function normalizeTopicSlug(value?: string): string {
  const v = (value ?? '').trim()
  return (COMMUNITY_STORY_TOPIC_SLUGS as readonly string[]).includes(v) ? v : ''
}

function normalizeFeedSort(value?: string): 'newest' | 'oldest' {
  return value === 'oldest' ? 'oldest' : 'newest'
}

type PlacesDiscoveryQS = {
  place?: string
  topic?: string
  sort?: 'oldest'
}

function normalizePage(value?: string) {
  const parsed = Number.parseInt(value ?? '1', 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, 5)
}

function buildPlacesHref(
  view: ViewFilter,
  query: string,
  page = 1,
  authorId?: string,
  authorLabel?: string,
  discovery?: PlacesDiscoveryQS
) {
  const params = new URLSearchParams()

  if (view !== 'all') {
    params.set('view', view)
  }

  if (query) {
    params.set('q', query)
  }

  appendCommunityAuthorParams(params, authorId, authorLabel)

  if (discovery?.place?.trim()) {
    params.set('place', discovery.place.trim())
  }

  if (discovery?.topic?.trim()) {
    params.set('topic', discovery.topic.trim())
  }

  if (discovery?.sort === 'oldest') {
    params.set('sort', 'oldest')
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  const search = params.toString()
  return search ? `/places?${search}` : '/places'
}

export default async function PlacesPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = normalizeQuery(resolvedSearchParams?.q)
  const activeView = normalizeView(resolvedSearchParams?.view)
  const activeAuthorId = normalizeAuthor(resolvedSearchParams?.author)
  const activeAuthorLabel = normalizeAuthor(resolvedSearchParams?.authorLabel)
  const activePlace = normalizeQuery(resolvedSearchParams?.place)
  const activeTopic = normalizeTopicSlug(resolvedSearchParams?.topic) as CommunityStoryTopicSlug | ''
  const feedSort = normalizeFeedSort(resolvedSearchParams?.sort)
  const page = normalizePage(resolvedSearchParams?.page)
  const pageSize = 24
  const requestedPostCount = page * pageSize

  const discoveryForHref: PlacesDiscoveryQS = {
    ...(activePlace ? { place: activePlace } : {}),
    ...(activeTopic ? { topic: activeTopic } : {}),
    ...(feedSort === 'oldest' ? { sort: 'oldest' } : {}),
  }

  const activePlaceMatchKey = activePlace ? placeLabelMatchKey(activePlace) : ''

  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/places')
  }

  const membershipTier = await getMembershipTier(user.id)

  const [feedPosts, facets] = await Promise.all([
    getCommunityFeedPosts(user.id, requestedPostCount + 1, { sort: feedSort }),
    getCommunityDiscoveryFacets(user.id),
  ])
  const hasMorePosts = feedPosts.length > requestedPostCount
  const posts = feedPosts.slice(0, requestedPostCount)
  const savedPostIds = await getSavedCommunityPostIds(
    user.id,
    posts.map((post) => post.id)
  )
  const latestReportsByPostId = await getLatestMemberPostReportsForPosts(
    user.id,
    posts.map((post) => post.id)
  )
  const ownPostsCount = posts.filter((post) => post.author_id === user.id).length
  const publicPostsCount = posts.filter((post) => post.is_public).length
  const featuredPostsCount = posts.filter((post) => post.is_featured).length
  const savedPostsCount = posts.filter((post) => savedPostIds.has(post.id)).length
  const reportedPostsCount = posts.filter((post) => latestReportsByPostId.has(post.id)).length
  const postsWithPhotosCount = posts.filter((post) => post.images.length > 0).length

  const filteredPosts = posts.filter((post) => {
    const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
    const matchesQuery =
      query.length === 0 ||
      [post.title, post.content, authorName, post.place_label ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())

    const matchesView =
      activeView === 'all' ||
      (activeView === 'featured' && post.is_featured) ||
      (activeView === 'public' && post.is_public) ||
      (activeView === 'mine' && post.author_id === user.id) ||
      (activeView === 'saved' && savedPostIds.has(post.id)) ||
      (activeView === 'reported' && latestReportsByPostId.has(post.id)) ||
      (activeView === 'photos' && post.images.length > 0)

    const matchesDiscovery =
      (!activePlaceMatchKey || placeLabelMatchKey(post.place_label ?? null) === activePlaceMatchKey) &&
      (!activeTopic || (post.story_tags ?? []).includes(activeTopic))

    const matchesAuthor = activeAuthorId.length === 0 || post.author_id === activeAuthorId

    return matchesQuery && matchesView && matchesAuthor && matchesDiscovery
  })

  const activeViewLabel = VIEW_OPTIONS.find((option) => option.value === activeView)?.label ?? 'All stories'
  const showFilteredEmptyState = posts.length > 0 && filteredPosts.length === 0
  const currentPath = buildPlacesHref(activeView, query, page, activeAuthorId, activeAuthorLabel, discoveryForHref)
  const workspaceHrefs = activeAuthorId
    ? {
        places: buildCommunityWorkspaceHref('places', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
        saved: buildCommunityWorkspaceHref('saved', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
        reports: buildCommunityWorkspaceHref('reports', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
      }
    : undefined

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Community feed</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
          Browse member stories and the places behind them
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          This browsing surface now supports quick filters, optional place anchors and honest story-angle tags shared with
          submit/edit forms, newest-or-oldest ordering, while still keeping private stories scoped to their owners only.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {filteredPosts.length} of {posts.length} stor{posts.length === 1 ? 'y' : 'ies'} showing
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {publicPostsCount} public
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {featuredPostsCount} featured
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {ownPostsCount} yours
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {savedPostsCount} saved in this set
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {reportedPostsCount} reported by you
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {postsWithPhotosCount} with photos
          </Badge>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
          >
            Share a story
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <CommunitySurfaceNav active="places" itemHrefs={workspaceHrefs} />

      {membershipTier === 'limited' ? <UpgradePrompt variant="feed" className="mt-4" /> : null}

      {posts.length === 0 ? (
        <EmptyState
          id="places-empty"
          className="mt-6"
          variant="editorial"
          title="No stories yet"
          description="Once members start publishing, this feed will show public stories here. Your own private and public submissions will also appear after you post."
          primaryAction={{
            label: 'Publish the first story →',
            href: '/submit',
            variant: 'link',
          }}
        />
      ) : (
        <>
          <section className="editorial-card mt-6 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <form method="get" className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="mb-2 block text-sm font-semibold text-[#7a331b]">Search stories</span>
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Title, story, member name, or place anchor"
                      className="min-h-11 w-full rounded-[1rem] border border-[#d9c4a8] bg-white px-4 text-sm text-[#4f4034] outline-none transition placeholder:text-[#9b7455] focus:border-[#e34b16]/50 focus:ring-2 focus:ring-[#e34b16]/15"
                    />
                  </label>
                  <input type="hidden" name="view" value={activeView} />
                  <input type="hidden" name="author" value={activeAuthorId} />
                  <input type="hidden" name="authorLabel" value={activeAuthorLabel} />
                  <input type="hidden" name="place" value={activePlace} />
                  <input type="hidden" name="topic" value={activeTopic} />
                  <input type="hidden" name="sort" value={feedSort === 'oldest' ? 'oldest' : ''} />
                  <div className="flex gap-3 sm:self-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                    >
                      Apply
                    </button>
                    <Link
                      href="/places"
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                    >
                      Clear
                    </Link>
                  </div>
                </div>
              </form>

              <div className="rounded-[1.25rem] border border-[#f0e1cf] bg-[#fffaf5] px-4 py-3 text-sm text-[#6d5849]">
                <p>
                  Showing <span className="font-semibold text-[#7a331b]">{activeViewLabel}</span>
                  {feedSort === 'oldest' ? (
                    <>
                      {' '}
                      (<span className="font-semibold text-[#7a331b]">oldest stories first</span>)
                    </>
                  ) : null}
                  {activeAuthorId ? (
                    <>
                      {' '}
                      from <span className="font-semibold text-[#7a331b]">{activeAuthorLabel || 'this member'}</span>
                    </>
                  ) : null}
                  {activePlace ? (
                    <>
                      {' '}
                      anchored to <span className="font-semibold text-[#7a331b]">{activePlace}</span>
                    </>
                  ) : null}
                  {activeTopic ? (
                    <>
                      {' '}
                      with angle{' '}
                      <span className="font-semibold text-[#7a331b]">
                        {COMMUNITY_STORY_TOPIC_LABELS[activeTopic as CommunityStoryTopicSlug]}
                      </span>
                    </>
                  ) : null}
                  {query ? (
                    <>
                      {' '}
                      for <span className="font-semibold text-[#7a331b]">&ldquo;{query}&rdquo;</span>
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {VIEW_OPTIONS.map((option) => {
                const isActive = option.value === activeView

                return (
                  <Link
                    key={option.value}
                    href={buildPlacesHref(option.value, query, 1, activeAuthorId, activeAuthorLabel, discoveryForHref)}
                    aria-current={isActive ? 'page' : undefined}
                    className={
                      isActive
                        ? 'inline-flex min-h-11 items-center justify-center rounded-full border border-[#e34b16]/30 bg-[#fff3ec] px-4 text-sm font-semibold text-[#7a331b]'
                        : 'inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
                    }
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>

            <ActiveMemberFilterBanner
              className="mt-4"
              memberLabel={activeAuthorLabel}
              clearHref={buildPlacesHref(activeView, query, 1, undefined, undefined, discoveryForHref)}
            />
          </section>

          <section className="editorial-card mt-6 space-y-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#7a331b]">Sort this feed slice</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildPlacesHref(activeView, query, 1, activeAuthorId, activeAuthorLabel, {
                      ...(activePlace ? { place: activePlace } : {}),
                      ...(activeTopic ? { topic: activeTopic } : {}),
                    })}
                    aria-current={feedSort === 'newest' ? 'page' : undefined}
                    className={
                      feedSort === 'newest'
                        ? 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#e34b16]/30 bg-[#fff3ec] px-4 text-sm font-semibold text-[#7a331b]'
                        : 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
                    }
                  >
                    Newest first
                  </Link>
                  <Link
                    href={buildPlacesHref(activeView, query, 1, activeAuthorId, activeAuthorLabel, {
                      ...(activePlace ? { place: activePlace } : {}),
                      ...(activeTopic ? { topic: activeTopic } : {}),
                      sort: 'oldest',
                    })}
                    aria-current={feedSort === 'oldest' ? 'page' : undefined}
                    className={
                      feedSort === 'oldest'
                        ? 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#e34b16]/30 bg-[#fff3ec] px-4 text-sm font-semibold text-[#7a331b]'
                        : 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
                    }
                  >
                    Oldest first
                  </Link>
                  {activePlace || activeTopic ? (
                    <Link
                      href={buildPlacesHref(activeView, query, 1, activeAuthorId, activeAuthorLabel)}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                    >
                      Clear place/topic anchors
                    </Link>
                  ) : null}
                </div>
              </div>
              <p className="max-w-xl text-xs leading-6 text-[#6d5849]">
                Place anchors and story angles reuse the submit/edit inputs—discovery never pretends GPS or inferred taste.
              </p>
            </div>

            {facets.topics.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">Story angles in your network</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {facets.topics.map((topic) => {
                    const selected = topic === activeTopic
                    return (
                      <Link
                        key={topic}
                        href={buildPlacesHref(activeView, query, 1, activeAuthorId, activeAuthorLabel, {
                          ...discoveryForHref,
                          topic,
                        })}
                        className={
                          selected
                            ? 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#e34b16]/35 bg-[#fff3ec] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a331b]'
                            : 'inline-flex min-h-10 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#9b7455] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
                        }
                      >
                        {COMMUNITY_STORY_TOPIC_LABELS[topic]}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6d5849]">Once members publish with story angles selected, shortcuts for those angles show up here.</p>
            )}

            {facets.places.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">Places members named recently</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {facets.places.slice(0, 24).map((placeFacet) => {
                    const facetKey = placeLabelMatchKey(placeFacet)
                    const selected = Boolean(activePlaceMatchKey && facetKey === activePlaceMatchKey)
                    return (
                      <Link
                        key={facetKey ?? placeFacet}
                        href={buildPlacesHref(activeView, query, 1, activeAuthorId, activeAuthorLabel, {
                          ...discoveryForHref,
                          place: placeFacet,
                        })}
                        title={placeFacet}
                        className={
                          selected
                            ? 'inline-flex max-w-[14rem] min-h-10 items-center justify-center truncate rounded-full border border-[#e34b16]/35 bg-[#fff3ec] px-4 text-xs font-semibold text-[#7a331b]'
                            : 'inline-flex max-w-[14rem] min-h-10 items-center justify-center truncate rounded-full border border-[#ead8c2] bg-white px-4 text-xs font-semibold text-[#9b7455] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
                        }
                      >
                        {placeFacet}
                      </Link>
                    )
                  })}
                  {facets.places.length > 24 ? (
                    <span className="self-center text-xs text-[#6d5849]">+ refining search narrows faster</span>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6d5849]">Owners can optionally name a city, venue, or neighborhood on each story—it unlocks anchored browsing here.</p>
            )}
          </section>

          {showFilteredEmptyState ? (
            <EmptyState
              id="places-filtered-empty"
              className="mt-6"
              variant="editorial"
              ariaLive="polite"
              title="No stories match this filter yet"
              description="Try a different keyword, switch views, or clear the filters to return to the full community feed."
              primaryAction={{
                label: 'Reset filters →',
                href: '/places',
                variant: 'link',
              }}
              extraActions={[
                ...(activeAuthorId
                  ? [
                      {
                        label: 'Show all members',
                        href: buildPlacesHref(activeView, query, 1, undefined, undefined, discoveryForHref),
                        variant: 'link' as const,
                      },
                    ]
                  : []),
                {
                  label: 'Open saved stories',
                  href: '/saved',
                  variant: 'link',
                },
              ]}
            />
          ) : (
            <>
              <section className="mt-6 grid gap-5 lg:grid-cols-2">
                {filteredPosts.map((post) => {
                const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
                const isOwnPost = post.author_id === user.id
                const coverImage = post.images[0]?.signedUrl ?? null
                const latestReport = latestReportsByPostId.get(post.id)
                const detailHref = buildStoryDetailHref(post.id, currentPath)
                const moreFromAuthorHref = buildPlacesHref(activeView, query, 1, post.author_id, authorName, discoveryForHref)

                return (
                  <CommunityStoryCard
                    key={post.id}
                    variant="feed"
                    postId={post.id}
                    title={post.title}
                    content={post.content}
                    isPublic={post.is_public}
                    isFeatured={post.is_featured}
                    imageCount={post.images.length}
                    detailHref={detailHref}
                    author={{
                      username: post.author?.username,
                      fullName: post.author?.full_name,
                      avatarUrl: post.authorAvatarUrl,
                    }}
                    authorDisplayName={authorName}
                    publishedAt={post.created_at}
                    formatPublishedAt={formatPublishedAt}
                    coverImageSrc={coverImage}
                    coverImageAlt={post.images[0]?.alt_text ?? post.title}
                    latestReport={latestReport ?? null}
                    isOwnPost={isOwnPost}
                    isSaved={savedPostIds.has(post.id)}
                    placeLabel={post.place_label}
                    storyTags={post.story_tags ?? []}
                    currentPath={currentPath}
                    moreFromAuthorHref={moreFromAuthorHref}
                  />
                )
                })}
              </section>

              {hasMorePosts ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-semibold text-[#7a331b]">Loaded {posts.length} stories so far</p>
                    <p className="mt-1 text-sm text-[#6d5849]">
                      Need more to browse? Load the next set of older stories without leaving your current filters.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {page > 1 ? (
                      <Link
                        href={buildPlacesHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel, discoveryForHref)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                      >
                        Show fewer
                      </Link>
                    ) : null}
                    <Link
                      href={buildPlacesHref(activeView, query, page + 1, activeAuthorId, activeAuthorLabel, discoveryForHref)}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                    >
                      Load older stories
                    </Link>
                  </div>
                </section>
              ) : page > 1 ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <p className="text-sm text-[#6d5849]">You have reached the oldest story in this feed slice.</p>
                  <Link
                    href={buildPlacesHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel, discoveryForHref)}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                  >
                    Show fewer
                  </Link>
                </section>
              ) : null}
            </>
          )}
        </>
      )}
    </main>
  )
}
