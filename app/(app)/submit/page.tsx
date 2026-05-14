/**
 * Submit a Spot/Story Page
 *
 * Authenticated route, server `getUser()` per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { RestoreCommunityPostButton } from '@/components/submit/restore-community-post-button'
import { SubmitForm } from '@/components/submit/submit-form'
import { buildStoryDetailHref } from '@/lib/community-navigation'
import { getRecentPostsForAuthor } from '@/lib/queries/community-posts'
import { getUser } from '@/lib/supabase/server'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All stories' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
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
  searchParams?: Promise<{ storyArchived?: string; storyRestored?: string; q?: string; view?: string; page?: string }>
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirectTo=/submit')
  }

  const params = searchParams ? await searchParams : {}
  const query = normalizeQuery(params.q)
  const activeView = normalizeView(params.view)
  const page = normalizePage(params.page)
  const recentPosts = await getRecentPostsForAuthor(user.id, 24)
  const counts = {
    published: recentPosts.filter((post) => post.status === 'published').length,
    archived: recentPosts.filter((post) => post.status === 'archived').length,
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
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-5xl flex-1 overflow-x-clip">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div>
          {params.storyArchived === '1' ? (
            <div className="mb-6 rounded-2xl border border-green-200/80 bg-green-50/90 p-4 text-sm text-green-800" role="status">
              Story archived. It is now out of the feed, detail, and saved surfaces.
            </div>
          ) : null}
          {params.storyRestored === '1' ? (
            <div className="mb-6 rounded-2xl border border-green-200/80 bg-green-50/90 p-4 text-sm text-green-800" role="status">
              Story restored. It is back in your community surfaces and ready for owner controls again.
            </div>
          ) : null}
          <SubmitForm recentPostCount={recentPosts.length} />
        </div>

        <aside className="space-y-4">
          <div className="surface-card p-5 text-foreground sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.2em]">What saves right now</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#6d5849]">
              <li>• Title, description, privacy, and optional images save into Supabase now.</li>
              <li>• Images upload server-side with validation and per-user storage paths.</li>
              <li>• Your recent submissions render back here with signed image URLs for verification.</li>
              <li>• Story detail now includes owner edit, archive, and photo-management controls for published posts.</li>
              <li>• Archived stories can now be restored from your recent submissions list when you want them live again.</li>
            </ul>
          </div>

          <CommunitySurfaceNav active="submit" />

          <div className="editorial-card p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">Recent submissions</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849]">
              A quick confirmation surface for your latest posts, now with search and owner-focused filters so archived, private,
              and photo-heavy stories are easier to manage without losing the restore handoff.
            </p>

            {recentPosts.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4 text-sm text-[#6d5849]">
                No posts yet. Your first saved spot or story will show up here.
              </p>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {filteredPosts.length} of {recentPosts.length} stories showing
                  </span>
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {counts.published} published
                  </span>
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {counts.archived} archived
                  </span>
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {counts.public} public
                  </span>
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {counts.private} private
                  </span>
                  <span className="inline-flex rounded-full border border-[#ead8c2] bg-white px-3 py-2 font-semibold text-[#7a331b]">
                    {counts.photos} with photos
                  </span>
                </div>

                <section className="mt-6 rounded-[1.75rem] border border-[#f0e1cf] bg-[#fffaf5] p-4 sm:p-5">
                  <div className="flex flex-col gap-5">
                    <form method="get" className="flex-1">
                      <input type="hidden" name="storyArchived" value={params.storyArchived ?? ''} />
                      <input type="hidden" name="storyRestored" value={params.storyRestored ?? ''} />
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="flex-1">
                          <span className="mb-2 block text-sm font-semibold text-[#7a331b]">Search your stories</span>
                          <input
                            type="search"
                            name="q"
                            defaultValue={query}
                            placeholder="Search by title or story text"
                            className="min-h-11 w-full rounded-[1rem] border border-[#d9c4a8] bg-white px-4 text-sm text-[#4f4034] outline-none transition placeholder:text-[#9b7455] focus:border-[#e34b16]/50 focus:ring-2 focus:ring-[#e34b16]/15"
                          />
                        </label>
                        <input type="hidden" name="view" value={activeView} />
                        <div className="flex gap-3 sm:self-end">
                          <button
                            type="submit"
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                          >
                            Apply
                          </button>
                          <Link
                            href="/submit"
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                          >
                            Clear
                          </Link>
                        </div>
                      </div>
                    </form>

                    <div className="rounded-[1.25rem] border border-[#ead8c2] bg-white px-4 py-3 text-sm text-[#6d5849]">
                      <p>
                        Showing <span className="font-semibold text-[#7a331b]">{activeViewLabel}</span>
                        {query ? (
                          <>
                            {' '}
                            for <span className="font-semibold text-[#7a331b]">“{query}”</span>
                          </>
                        ) : null}
                        .
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {VIEW_OPTIONS.map((option) => {
                      const isActive = option.value === activeView

                      return (
                        <Link
                          key={option.value}
                          href={buildSubmitHref(option.value, query, 1)}
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
                </section>

                {showFilteredEmptyState ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4 text-sm text-[#6d5849]">
                    No stories match this view yet. Try a different keyword or switch filters to get back to your full submission history.
                  </div>
                ) : (
                  <>
                    <div className="mt-6 space-y-4">
                      {filteredPosts.map((post) => {
                      const isArchived = post.status === 'archived'
                      const detailHref = buildStoryDetailHref(post.id, currentPath)

                      return (
                        <article key={post.id} className="overflow-hidden rounded-3xl border border-[#ead8c2] bg-white shadow-sm">
                          {post.images[0]?.signedUrl ? (
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6efe4]">
                              <Image
                                src={post.images[0].signedUrl}
                                alt={post.images[0].alt_text ?? post.title}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 28rem, 100vw"
                                unoptimized
                              />
                            </div>
                          ) : null}

                          <div className="space-y-3 p-5">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
                              <span>{post.is_public ? 'Public' : 'Private'}</span>
                              <span aria-hidden>•</span>
                              <span>{isArchived ? 'Archived' : 'Published'}</span>
                              <span aria-hidden>•</span>
                              <span>
                                {post.images.length} image{post.images.length === 1 ? '' : 's'}
                              </span>
                            </div>

                            <div>
                              <h3 className="font-serif text-xl font-semibold text-[#7a331b]">{post.title}</h3>
                              <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#6d5849]">{post.content}</p>
                            </div>

                            {isArchived ? (
                              <div className="space-y-3 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-3 text-sm text-[#6d5849]">
                                <p>
                                  Archived stories stay off community surfaces until you restore them. Restoring puts them back into the feed, detail, and saved surfaces.
                                </p>
                                <RestoreCommunityPostButton postId={post.id} path={currentPath} />
                              </div>
                            ) : null}

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-xs text-muted-foreground">Saved {formatSubmittedAt(post.created_at)}</p>
                              <div className="flex flex-wrap items-center gap-3">
                                <Link href="/places" className="text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]">
                                  Browse feed
                                </Link>
                                {!isArchived ? (
                                  <Link href={detailHref} className="text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                                    Manage story →
                                  </Link>
                                ) : (
                                  <span className="text-sm font-semibold text-[#9b7455]">Restore to reopen owner controls</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                      })}
                    </div>

                    {hasMorePosts ? (
                      <section className="mt-6 rounded-[1.75rem] border border-[#f0e1cf] bg-[#fffaf5] p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#7a331b]">Loaded {filteredPosts.length} submission entries so far</p>
                            <p className="mt-1 text-sm text-[#6d5849]">
                              Need older owner history? Load the next set without dropping your current filter handoff.
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            {page > 1 ? (
                              <Link
                                href={buildSubmitHref(activeView, query, page - 1)}
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                              >
                                Show fewer
                              </Link>
                            ) : null}
                            <Link
                              href={buildSubmitHref(activeView, query, page + 1)}
                              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                            >
                              Load older submissions
                            </Link>
                          </div>
                        </div>
                      </section>
                    ) : page > 1 ? (
                      <section className="mt-6 rounded-[1.75rem] border border-[#f0e1cf] bg-[#fffaf5] p-4 sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-[#6d5849]">You have reached the oldest story in this filtered submission history.</p>
                          <Link
                            href={buildSubmitHref(activeView, query, page - 1)}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                          >
                            Show fewer
                          </Link>
                        </div>
                      </section>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
