/**
 * Submit a Spot/Story Page
 *
 * Authenticated route, server `getUser()` per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { EmptyState } from '@/components/ui/empty-state'
import { NoResultsState } from '@/components/ui/no-results-state'
import { SectionHeader } from '@/components/ui/section-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { UpgradePrompt } from '@/components/ui/upgrade-prompt'
import { RestoreCommunityPostButton } from '@/components/submit/restore-community-post-button'
import { SubmitForm } from '@/components/submit/submit-form'
import { buildStoryDetailHref } from '@/lib/community-navigation'
import { getMembershipTier } from '@/lib/billing/entitlements'
import { getRecentPostsForAuthor } from '@/lib/queries/community-posts'
import { getUser } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All stories' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'removed', label: 'Permanently removed' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'photos', label: 'With photos' },
] as const

type ViewFilter = (typeof VIEW_OPTIONS)[number]['value']

function normalizePage(value?: string) {
  const parsed = Number.parseInt(value ?? '1', 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, 5)
}

function formatSubmittedAt(value: string) {
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

function buildSubmitHref(view: ViewFilter, query: string, page = 1) {
  const params = new URLSearchParams()

  if (view !== 'all') {
    params.set('view', view)
  }

  if (query) {
    params.set('q', query)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  return `/submit${params.size > 0 ? `?${params.toString()}` : ''}`
}

type SubmitPageProps = {
  searchParams?: Promise<{
    storyArchived?: string
    storyRestored?: string
    storyRemoved?: string
    q?: string
    view?: string
    page?: string
  }>
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirectTo=/submit')
  }

  const membershipTier = await getMembershipTier(user.id)

  const params = searchParams ? await searchParams : {}
  const query = normalizeQuery(params.q)
  const activeView = normalizeView(params.view)
  const page = normalizePage(params.page)
  const recentPosts = await getRecentPostsForAuthor(user.id, 24)
  const counts = {
    published: recentPosts.filter((post) => post.status === 'published').length,
    archived: recentPosts.filter((post) => post.status === 'archived').length,
    removed: recentPosts.filter((post) => post.status === 'removed').length,
    public: recentPosts.filter((post) => post.is_public).length,
    private: recentPosts.filter((post) => !post.is_public).length,
    photos: recentPosts.filter((post) => post.images.length > 0).length,
  }
  const matchingPosts = recentPosts.filter((post) => {
    const matchesQuery =
      query.length === 0 || [post.title, post.content].join(' ').toLowerCase().includes(query.toLowerCase())

    const matchesView =
      activeView === 'all' ||
      (activeView === 'published' && post.status === 'published') ||
      (activeView === 'archived' && post.status === 'archived') ||
      (activeView === 'removed' && post.status === 'removed') ||
      (activeView === 'public' && post.is_public) ||
      (activeView === 'private' && !post.is_public) ||
      (activeView === 'photos' && post.images.length > 0)

    return matchesQuery && matchesView
  })
  const pageSize = 8
  const requestedPostCount = page * pageSize
  const hasMorePosts = matchingPosts.length > requestedPostCount
  const filteredPosts = matchingPosts.slice(0, requestedPostCount)

  const activeViewLabel = VIEW_OPTIONS.find((option) => option.value === activeView)?.label ?? 'All stories'
  const showFilteredEmptyState = recentPosts.length > 0 && matchingPosts.length === 0
  const currentPath = buildSubmitHref(activeView, query, page)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="places-hero-shell mb-8 overflow-hidden p-6 sm:mb-10 sm:p-8 lg:p-10">
        <div className="places-hero-inner">
          <SectionHeader
            id="submit-hero"
            as="div"
            tone="community"
            eyebrow="Member workspace"
            title="Submit spots and stories"
            description="Compose on the left, track your shelf on the right. Publishing uses the same privacy, storage, and moderation rules as the community feed, saved list, and report history."
          />
        </div>
      </header>

      <CommunitySurfaceNav active="submit" />

      <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(17.5rem,0.88fr)] lg:items-start lg:gap-12">
        <div className="min-w-0 space-y-6">
          {params.storyArchived === '1' ? (
            <div
              className="rounded-[1.25rem] border border-emerald-300/75 bg-emerald-50/95 p-4 text-sm leading-relaxed text-emerald-950"
              role="status"
            >
              Story archived. It is out of the feed, detail, and saved surfaces until you restore it from your shelf.
            </div>
          ) : null}
          {params.storyRestored === '1' ? (
            <div
              className="rounded-[1.25rem] border border-emerald-300/75 bg-emerald-50/95 p-4 text-sm leading-relaxed text-emerald-950"
              role="status"
            >
              Story restored. It is back in community surfaces with full owner controls on the detail page.
            </div>
          ) : null}
          {params.storyRemoved === '1' ? (
            <div
              className="rounded-[1.25rem] border border-amber-300/80 bg-amber-50/95 p-4 text-sm leading-relaxed text-amber-950"
              role="status"
            >
              Story permanently removed from community surfaces. Your timeline below keeps the reference for your account only.
            </div>
          ) : null}
          {membershipTier === 'limited' ? <UpgradePrompt variant="studio" /> : null}

          <SubmitForm recentPostCount={recentPosts.length} />
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <div className="editorial-card-sun p-5 sm:p-6">
            <SectionHeader
              size="compact"
              tone="community"
              eyebrow="Trust & safety"
              title="What happens when you publish"
              description="The same privacy, storage, and moderation rules apply across browse, saved, and report history."
            />
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-brand-blue/85">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange/80" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-pinkDark">Uploads:</span> Photos validate server-side (type, size, count), then
                  save to your account storage. They follow the same visibility as your story.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange/80" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-pinkDark">Privacy:</span> Public stories appear to signed-in members in the feed.
                  Private stories stay visible only to you — saves and reports still respect that boundary.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange/80" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-pinkDark">Moderation:</span> Members can report public stories that feel unsafe.
                  Moderators review reports; you can track your own report history from the workspace nav.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange/80" aria-hidden />
                <span>
                  <span className="font-semibold text-brand-pinkDark">Lifecycle:</span> Published rows can be managed on the story detail page.
                  Archive hides from community surfaces; permanent remove cannot be reopened.
                </span>
              </li>
            </ul>
          </div>

          <div className="editorial-card-strong overflow-hidden p-0 shadow-[0_18px_46px_rgba(122,51,27,0.08)]">
            <div className="border-b border-brand-pinkDark/10 bg-brand-cream/25 px-5 py-5 sm:px-6 sm:py-6">
              <SectionHeader
                id="submit-shelf-header"
                size="compact"
                tone="community"
                eyebrow="Your shelf"
                title="Recent submissions"
                description="Search and filter by lifecycle, visibility, or photos. Badges show where each story sits today."
              />
              <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Story lifecycle legend">
                <StatusBadge kind="lifecycle" status="draft" />
                <StatusBadge kind="lifecycle" status="published" />
                <StatusBadge kind="lifecycle" status="archived" />
                <StatusBadge kind="lifecycle" status="removed" />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {recentPosts.length === 0 ? (
                <EmptyState
                  id="submit-shelf-empty"
                  variant="inline"
                  useCommunitySectionLabel
                  eyebrow="Empty shelf"
                  title="No stories yet"
                  description="Publish your first spot or narrative from the compose column — it lands here with thumbnails when you add photos."
                  primaryAction={{
                    label: 'Go to compose →',
                    href: '#submit-compose',
                    variant: 'link',
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="community-summary-chip text-xs font-semibold sm:text-sm">
                      {filteredPosts.length} of {recentPosts.length} showing
                    </span>
                    <span className="community-summary-chip community-summary-chip-gold text-xs font-semibold sm:text-sm">
                      {counts.published} published
                    </span>
                    <span className="community-summary-chip text-xs font-semibold sm:text-sm">{counts.archived} archived</span>
                    <span className="community-summary-chip community-summary-chip-ember text-xs font-semibold sm:text-sm">
                      {counts.removed} removed
                    </span>
                    <span className="community-summary-chip community-summary-chip-gold text-xs font-semibold sm:text-sm">
                      {counts.public} public
                    </span>
                    <span className="community-summary-chip text-xs font-semibold sm:text-sm">{counts.private} private</span>
                    <span className="community-summary-chip community-summary-chip-gold text-xs font-semibold sm:text-sm">
                      {counts.photos} with photos
                    </span>
                  </div>

                  <section className="mt-6 rounded-[1.35rem] border border-brand-pinkDark/10 bg-white/90 p-4 sm:p-5">
                    <div className="flex flex-col gap-5">
                      <form method="get" className="flex-1">
                        <input type="hidden" name="storyArchived" value={params.storyArchived ?? ''} />
                        <input type="hidden" name="storyRestored" value={params.storyRestored ?? ''} />
                        <input type="hidden" name="storyRemoved" value={params.storyRemoved ?? ''} />
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <label className="flex-1">
                            <span className="mb-2 block text-sm font-semibold text-brand-pinkDark">Search shelf</span>
                            <input
                              type="search"
                              name="q"
                              defaultValue={query}
                              placeholder="Title or story text"
                              className="min-h-12 w-full rounded-[1rem] border border-brand-pinkDark/18 bg-white px-4 text-base text-brand-blue outline-none transition placeholder:text-brand-pinkDark/45 focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/12 sm:min-h-11 sm:text-sm"
                            />
                          </label>
                          <input type="hidden" name="view" value={activeView} />
                          <div className="flex gap-3 sm:self-end">
                            <button
                              type="submit"
                              className="inline-flex min-h-12 min-w-[5.5rem] items-center justify-center rounded-full bg-brand-pinkDark px-5 text-sm font-semibold text-white transition hover:bg-brand-pinkDark/90 sm:min-h-11"
                            >
                              Apply
                            </button>
                            <Link
                              href="/submit"
                              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-pinkDark/18 bg-white px-5 text-sm font-semibold text-brand-pinkDark transition hover:border-brand-orange/35 hover:text-brand-orange sm:min-h-11"
                            >
                              Clear
                            </Link>
                          </div>
                        </div>
                      </form>

                      <div className="community-context-banner px-4 py-3 text-sm leading-relaxed text-brand-blue/85">
                        <p>
                          Showing <span className="font-semibold text-brand-pinkDark">{activeViewLabel}</span>
                          {query ? (
                            <>
                              {' '}
                              for <span className="font-semibold text-brand-pinkDark">&ldquo;{query}&rdquo;</span>
                            </>
                          ) : null}
                          .
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                      {VIEW_OPTIONS.map((option) => {
                        const isActive = option.value === activeView

                        return (
                          <Link
                            key={option.value}
                            href={buildSubmitHref(option.value, query, 1)}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn('community-filter-pill min-h-11 text-center sm:text-left', isActive && 'community-filter-pill-active')}
                          >
                            {option.label}
                          </Link>
                        )
                      })}
                    </div>
                  </section>

                  {showFilteredEmptyState ? (
                    <NoResultsState
                      id="submit-filtered-empty"
                      className="mt-6"
                      variant="inline"
                      filterEyebrow="No matches"
                      title="Nothing on this shelf row"
                      description="Try another keyword or tab — your stories are still here."
                      resetAction={{ label: 'Reset filters', href: '/submit' }}
                    />
                  ) : (
                    <>
                      <div className="mt-6 space-y-5">
                        {filteredPosts.map((post) => {
                          const isArchived = post.status === 'archived'
                          const isRemoved = post.status === 'removed'
                          const detailHref = buildStoryDetailHref(post.id, currentPath)

                          return (
                            <article
                              key={post.id}
                              className={cn(
                                'editorial-card overflow-hidden p-0 shadow-[0_12px_34px_rgba(122,51,27,0.06)] transition-shadow duration-200 hover:shadow-[0_20px_44px_rgba(122,51,27,0.09)]',
                                post.status === 'draft' && 'ring-1 ring-brand-orange/30',
                                isArchived && 'ring-1 ring-slate-200/85',
                                isRemoved && 'ring-1 ring-amber-200/90'
                              )}
                            >
                              {post.images[0]?.signedUrl ? (
                                <div className="story-detail-photo-frame relative aspect-[4/3] w-full border-x-0 border-t-0">
                                  <Image
                                    src={post.images[0].signedUrl}
                                    alt={post.images[0].alt_text ?? post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 28rem, 100vw"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="border-b border-brand-pinkDark/10 bg-brand-cream/25 px-5 py-6 text-center sm:px-6">
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue/65">Text-only story</p>
                                </div>
                              )}

                              <div className="space-y-4 p-5 sm:p-6">
                                <div className="flex flex-wrap items-center gap-2">
                                  <StatusBadge
                                    kind="post-visibility"
                                    visibility={post.is_public ? 'public' : 'private'}
                                  />
                                  <StatusBadge kind="lifecycle" status={post.status} />
                                  <span className="story-meta-chip text-[0.58rem]">
                                    {post.images.length} image{post.images.length === 1 ? '' : 's'}
                                  </span>
                                </div>

                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-brand-pinkDark sm:text-xl">{post.title}</h3>
                                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-brand-blue/85">{post.content}</p>
                                </div>

                                {!isRemoved && isArchived ? (
                                  <div className="space-y-3 rounded-[1.15rem] border border-dashed border-brand-pinkDark/22 bg-brand-cream/35 p-4 text-sm leading-relaxed text-brand-blue/85">
                                    <p>
                                      Archived stories stay off community surfaces until you restore them. Restoring returns them to the feed,
                                      detail, and saved lists.
                                    </p>
                                    <RestoreCommunityPostButton postId={post.id} path={currentPath} />
                                  </div>
                                ) : null}

                                {isRemoved ? (
                                  <div className="rounded-[1.15rem] border border-amber-300/75 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950">
                                    Permanently removed stories cannot be reopened here. Use archive when you might want a story back.
                                  </div>
                                ) : null}

                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-pinkDark/10 pt-4">
                                  <p className="text-xs font-medium text-brand-blue/70">Submitted {formatSubmittedAt(post.created_at)}</p>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <Link
                                      href="/places"
                                      className="text-sm font-semibold text-brand-pinkDark transition hover:text-brand-orange"
                                    >
                                      Browse feed
                                    </Link>
                                    {isRemoved ? (
                                      <span className="text-sm font-semibold text-brand-blue/65">Detail unavailable</span>
                                    ) : isArchived ? (
                                      <span className="text-sm font-semibold text-brand-blue/65">Restore to manage</span>
                                    ) : (
                                      <Link
                                        href={detailHref}
                                        className="text-sm font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline"
                                      >
                                        Manage story
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </article>
                          )
                        })}
                      </div>

                      {hasMorePosts ? (
                        <section className="editorial-card-strong mt-6 p-5 sm:flex sm:items-center sm:justify-between sm:p-6">
                          <div className="max-w-xl">
                            <p className="text-sm font-semibold text-brand-pinkDark">
                              Showing {filteredPosts.length} stor{filteredPosts.length === 1 ? 'y' : 'ies'} in this view
                            </p>
                            <p className="mt-1 text-sm text-brand-blue/85">Load older rows without losing filters.</p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                            {page > 1 ? (
                              <Link
                                href={buildSubmitHref(activeView, query, page - 1)}
                                className="community-filter-pill inline-flex min-h-11 items-center justify-center"
                              >
                                Previous page
                              </Link>
                            ) : null}
                            <Link
                              href={buildSubmitHref(activeView, query, page + 1)}
                              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pinkDark px-6 text-sm font-semibold text-white transition hover:bg-brand-pinkDark/90"
                            >
                              Next page
                            </Link>
                          </div>
                        </section>
                      ) : page > 1 ? (
                        <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                          <p className="text-sm text-brand-blue/85">Oldest entries for this filter.</p>
                          <Link
                            href={buildSubmitHref(activeView, query, page - 1)}
                            className="community-filter-pill inline-flex min-h-11 items-center justify-center"
                          >
                            Previous page
                          </Link>
                        </section>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
