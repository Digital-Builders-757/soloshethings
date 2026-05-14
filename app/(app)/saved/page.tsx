import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buildStoryDetailHref } from '@/lib/community-navigation'
import { getLatestMemberPostReportsForPosts, REPORT_STATUS_LABELS } from '@/lib/queries/reports'
import { getSavedCommunityPosts } from '@/lib/queries/saved-posts'
import { getUser } from '@/lib/supabase/server'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All saves' },
  { value: 'featured', label: 'Featured' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'mine', label: 'Your stories' },
  { value: 'reported', label: 'Reported by you' },
  { value: 'photos', label: 'With photos' },
] as const

type ViewFilter = (typeof VIEW_OPTIONS)[number]['value']

type Props = {
  searchParams?: Promise<{
    q?: string
    view?: string
    page?: string
  }>
}

function formatDate(value: string) {
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

function normalizePage(value?: string) {
  const parsed = Number.parseInt(value ?? '1', 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, 5)
}

function reportStatusTone(status: 'pending' | 'reviewed' | 'resolved' | 'dismissed') {
  switch (status) {
    case 'resolved':
      return 'border-green-200 bg-green-50 text-green-800'
    case 'dismissed':
      return 'border-slate-200 bg-slate-50 text-slate-700'
    case 'reviewed':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    default:
      return 'border-[#ead8c2] bg-white text-[#7a331b]'
  }
}

function buildSavedHref(view: ViewFilter, query: string, page = 1) {
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

  const search = params.toString()
  return search ? `/saved?${search}` : '/saved'
}

export default async function SavedPostsPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = normalizeQuery(resolvedSearchParams?.q)
  const activeView = normalizeView(resolvedSearchParams?.view)
  const page = normalizePage(resolvedSearchParams?.page)
  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/saved')
  }

  const savedPosts = await getSavedCommunityPosts(user.id)
  const latestReportsByPostId = await getLatestMemberPostReportsForPosts(
    user.id,
    savedPosts.map((post) => post.id)
  )
  const ownSavedPostsCount = savedPosts.filter((post) => post.author_id === user.id).length
  const publicSavedPostsCount = savedPosts.filter((post) => post.is_public).length
  const privateSavedPostsCount = savedPosts.filter((post) => !post.is_public).length
  const featuredSavedPostsCount = savedPosts.filter((post) => post.is_featured).length
  const reportedSavedPostsCount = savedPosts.filter((post) => latestReportsByPostId.has(post.id)).length
  const postsWithPhotosCount = savedPosts.filter((post) => post.images.length > 0).length

  const matchingPosts = savedPosts.filter((post) => {
    const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
    const matchesQuery =
      query.length === 0 ||
      [post.title, post.content, authorName]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())

    const matchesView =
      activeView === 'all' ||
      (activeView === 'featured' && post.is_featured) ||
      (activeView === 'public' && post.is_public) ||
      (activeView === 'private' && !post.is_public) ||
      (activeView === 'mine' && post.author_id === user.id) ||
      (activeView === 'reported' && latestReportsByPostId.has(post.id)) ||
      (activeView === 'photos' && post.images.length > 0)

    return matchesQuery && matchesView
  })

  const pageSize = 12
  const requestedPostCount = page * pageSize
  const hasMorePosts = matchingPosts.length > requestedPostCount
  const filteredPosts = matchingPosts.slice(0, requestedPostCount)

  const activeViewLabel = VIEW_OPTIONS.find((option) => option.value === activeView)?.label ?? 'All saves'
  const showFilteredEmptyState = savedPosts.length > 0 && matchingPosts.length === 0
  const currentPath = buildSavedHref(activeView, query, page)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Saved stories</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
          Keep the stories you want to come back to close
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          This first pass saves community stories into your own private list. It now gives you a lightweight way to
          search and narrow that list without changing who can see what.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {filteredPosts.length} of {savedPosts.length} saved stor{savedPosts.length === 1 ? 'y' : 'ies'} showing
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {publicSavedPostsCount} public
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {privateSavedPostsCount} private
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {featuredSavedPostsCount} featured
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {ownSavedPostsCount} yours
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {reportedSavedPostsCount} reported by you
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {postsWithPhotosCount} with photos
          </Badge>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/places"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
          >
            Browse stories
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <CommunitySurfaceNav active="saved" />

      {savedPosts.length === 0 ? (
        <section className="editorial-card mt-6 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">Nothing saved yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
            Use the save button on a story card or detail page and it will appear here for your account only.
          </p>
          <Link href="/places" className="mt-6 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
            Explore the feed →
          </Link>
        </section>
      ) : (
        <>
          <section className="editorial-card mt-6 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <form method="get" className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="mb-2 block text-sm font-semibold text-[#7a331b]">Search saved stories</span>
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Search by title, story text, or member name"
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
                      href="/saved"
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

            <div className="mt-5 flex flex-wrap gap-3">
              {VIEW_OPTIONS.map((option) => {
                const isActive = option.value === activeView

                return (
                  <Link
                    key={option.value}
                    href={buildSavedHref(option.value, query, 1)}
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
            <section className="editorial-card mt-6 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">No saved stories match this view yet</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
                Try a different keyword, switch filters, or clear this view to return to your full saved list.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/saved" className="inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                  Reset saved filters →
                </Link>
                <Link href="/places" className="inline-flex text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]">
                  Browse stories
                </Link>
              </div>
            </section>
          ) : (
            <>
              <section className="mt-6 grid gap-5 lg:grid-cols-2">
                {filteredPosts.map((post) => {
                const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
                const coverImage = post.images[0]?.signedUrl ?? null
                const isOwnPost = post.author_id === user.id
                const latestReport = latestReportsByPostId.get(post.id)
                const detailHref = buildStoryDetailHref(post.id, currentPath)

                return (
                  <article key={post.id} className="editorial-card overflow-hidden">
                    {coverImage ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f6efe4]">
                        <Image
                          src={coverImage}
                          alt={post.images[0]?.alt_text ?? post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
                        <span>{post.is_public ? 'Public story' : 'Private to you'}</span>
                        <span aria-hidden>•</span>
                        <span>Saved {formatDate(post.saved_at)}</span>
                        {isOwnPost ? (
                          <>
                            <span aria-hidden>•</span>
                            <span>Your post</span>
                          </>
                        ) : null}
                        {post.is_featured ? (
                          <>
                            <span aria-hidden>•</span>
                            <span>Featured</span>
                          </>
                        ) : null}
                        {post.images.length > 0 ? (
                          <>
                            <span aria-hidden>•</span>
                            <span>{post.images.length} photo{post.images.length === 1 ? '' : 's'}</span>
                          </>
                        ) : null}
                        {latestReport ? (
                          <>
                            <span aria-hidden>•</span>
                            <span>Reported by you</span>
                          </>
                        ) : null}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Avatar
                          src={post.authorAvatarUrl}
                          fallback={authorName.slice(0, 2).toUpperCase()}
                          alt={`${authorName} avatar`}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#7a331b]">{authorName}</p>
                          <p className="text-xs text-[#6d5849]">Published {formatDate(post.created_at)}</p>
                        </div>
                      </div>

                      <h2 className="mt-4 font-serif text-2xl font-semibold text-[#7a331b]">
                        <Link href={detailHref} className="transition hover:text-[#e34b16]">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#6d5849] sm:text-base">{post.content}</p>

                      {latestReport ? (
                        <div className={`mt-6 inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${reportStatusTone(latestReport.status)}`}>
                          {REPORT_STATUS_LABELS[latestReport.status]}
                        </div>
                      ) : null}

                      <div className="mt-6 space-y-3">
                        <SaveCommunityPostButton postId={post.id} path={currentPath} initialSaved variant="card" />
                        <div className="flex flex-wrap items-center gap-4">
                          <Link href={detailHref} className="inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                            Open story →
                          </Link>
                          {latestReport ? (
                            <Link href="/reports" className="inline-flex text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]">
                              Track report
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                )
                })}
              </section>

              {hasMorePosts ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-semibold text-[#7a331b]">Loaded {filteredPosts.length} saved stories so far</p>
                    <p className="mt-1 text-sm text-[#6d5849]">
                      Need more from your library? Load the next set without dropping your current search or filters.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {page > 1 ? (
                      <Link
                        href={buildSavedHref(activeView, query, page - 1)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                      >
                        Show fewer
                      </Link>
                    ) : null}
                    <Link
                      href={buildSavedHref(activeView, query, page + 1)}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                    >
                      Load more saves
                    </Link>
                  </div>
                </section>
              ) : page > 1 ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <p className="text-sm text-[#6d5849]">You have reached the oldest saved story in this filtered view.</p>
                  <Link
                    href={buildSavedHref(activeView, query, page - 1)}
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
