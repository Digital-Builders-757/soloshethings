import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ActiveMemberFilterBanner } from '@/components/community/active-member-filter-banner'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { Badge } from '@/components/ui/badge'
import { appendCommunityAuthorParams, buildStoryDetailHref } from '@/lib/community-navigation'
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS, getMemberPostReports } from '@/lib/queries/reports'
import { getUser } from '@/lib/supabase/server'
import type { report_status } from '@/types/database'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All reports' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Under review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
] as const

type ViewFilter = (typeof VIEW_OPTIONS)[number]['value']

type Props = {
  searchParams?: Promise<{
    q?: string
    view?: string
    page?: string
    author?: string
    authorLabel?: string
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

function normalizeAuthor(value?: string) {
  return value?.trim() ?? ''
}

function normalizePage(value?: string) {
  const parsed = Number.parseInt(value ?? '1', 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, 5)
}

function buildReportsHref(view: ViewFilter, query: string, page = 1, authorId?: string, authorLabel?: string) {
  const params = new URLSearchParams()

  if (view !== 'all') {
    params.set('view', view)
  }

  if (query) {
    params.set('q', query)
  }

  appendCommunityAuthorParams(params, authorId, authorLabel)

  if (page > 1) {
    params.set('page', String(page))
  }

  const search = params.toString()
  return search ? `/reports?${search}` : '/reports'
}

function statusTone(status: report_status) {
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

export default async function ReportsPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const query = normalizeQuery(resolvedSearchParams?.q)
  const activeView = normalizeView(resolvedSearchParams?.view)
  const activeAuthorId = normalizeAuthor(resolvedSearchParams?.author)
  const activeAuthorLabel = normalizeAuthor(resolvedSearchParams?.authorLabel)
  const page = normalizePage(resolvedSearchParams?.page)
  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/reports')
  }

  const reports = await getMemberPostReports(user.id)
  const counts = {
    pending: reports.filter((report) => report.status === 'pending').length,
    reviewed: reports.filter((report) => report.status === 'reviewed').length,
    resolved: reports.filter((report) => report.status === 'resolved').length,
    dismissed: reports.filter((report) => report.status === 'dismissed').length,
  }

  const matchingReports = reports.filter((report) => {
    const title = report.post?.title ?? 'Story no longer available'
    const authorName = report.post?.author?.full_name?.trim() || report.post?.author?.username || 'Solo SHE member'
    const matchesQuery =
      query.length === 0 ||
      [title, authorName, REPORT_REASON_LABELS[report.reason], report.description ?? '', report.admin_notes ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())

    const matchesView = activeView === 'all' || report.status === activeView
    const matchesAuthor = activeAuthorId.length === 0 || report.post?.author_id === activeAuthorId

    return matchesQuery && matchesView && matchesAuthor
  })

  const pageSize = 12
  const requestedReportCount = page * pageSize
  const hasMoreReports = matchingReports.length > requestedReportCount
  const filteredReports = matchingReports.slice(0, requestedReportCount)

  const activeViewLabel = VIEW_OPTIONS.find((option) => option.value === activeView)?.label ?? 'All reports'
  const showFilteredEmptyState = reports.length > 0 && matchingReports.length === 0
  const currentPath = buildReportsHref(activeView, query, page, activeAuthorId, activeAuthorLabel)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Safety reports</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
          Track the stories you flagged for moderation
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          Reports stay private to you and the moderation team. This page gives members a simple place to check what is still waiting,
          what is under review, and what has been resolved.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {filteredReports.length} of {reports.length} report{reports.length === 1 ? '' : 's'} showing
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {counts.pending} pending
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {counts.reviewed} under review
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {counts.resolved} resolved
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {counts.dismissed} dismissed
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

      <CommunitySurfaceNav active="reports" />

      {reports.length === 0 ? (
        <section className="editorial-card mt-6 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">No reports from your account yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
            If you report a public story from its detail page, it will appear here with its moderation status.
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
                    <span className="mb-2 block text-sm font-semibold text-[#7a331b]">Search your reports</span>
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Search by story title, reason, or your notes"
                      className="min-h-11 w-full rounded-[1rem] border border-[#d9c4a8] bg-white px-4 text-sm text-[#4f4034] outline-none transition placeholder:text-[#9b7455] focus:border-[#e34b16]/50 focus:ring-2 focus:ring-[#e34b16]/15"
                    />
                  </label>
                  <input type="hidden" name="view" value={activeView} />
                  <input type="hidden" name="author" value={activeAuthorId} />
                  <input type="hidden" name="authorLabel" value={activeAuthorLabel} />
                  <div className="flex gap-3 sm:self-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                    >
                      Apply
                    </button>
                    <Link
                      href="/reports"
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
                  {activeAuthorLabel ? (
                    <>
                      {' '}
                      for stories by <span className="font-semibold text-[#7a331b]">{activeAuthorLabel}</span>
                    </>
                  ) : null}
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
                    href={buildReportsHref(option.value, query, 1, activeAuthorId, activeAuthorLabel)}
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
              clearHref={buildReportsHref(activeView, query, 1)}
            />
          </section>

          {showFilteredEmptyState ? (
            <section className="editorial-card mt-6 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">No reports match this view yet</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
                Try a different keyword or switch filters to return to your full report history.
              </p>
              <Link href="/reports" className="mt-6 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                Reset report filters →
              </Link>
            </section>
          ) : (
            <>
              <section className="mt-6 space-y-4">
                {filteredReports.map((report) => {
                const postTitle = report.post?.title ?? 'Story no longer available'
                const postHref = report.post?.id ? buildStoryDetailHref(report.post.id, currentPath) : null
                const authorName = report.post?.author?.full_name?.trim() || report.post?.author?.username || 'Solo SHE member'
                const authorFilterHref = report.post?.author_id
                  ? buildReportsHref(activeView, query, 1, report.post.author_id, authorName)
                  : null

                return (
                  <article key={report.id} className="editorial-card p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
                          <span>Sent {formatDate(report.created_at)}</span>
                          <span aria-hidden>•</span>
                          <span>Reason: {REPORT_REASON_LABELS[report.reason]}</span>
                        </div>

                        <h2 className="mt-3 font-serif text-2xl font-semibold text-[#7a331b]">
                          {postHref ? (
                            <Link href={postHref} className="transition hover:text-[#e34b16]">
                              {postTitle}
                            </Link>
                          ) : (
                            postTitle
                          )}
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-[#6d5849]">
                          {report.description?.trim()
                            ? report.description
                            : 'You did not add extra notes for this report.'}
                        </p>

                        {report.post ? (
                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#6d5849]">
                            <span>
                              Story by <span className="font-semibold text-[#7a331b]">{authorName}</span>
                            </span>
                            {authorFilterHref ? (
                              <Link href={authorFilterHref} className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                                Only this member&apos;s stories
                              </Link>
                            ) : null}
                          </div>
                        ) : null}

                        {report.admin_notes?.trim() ? (
                          <div className="mt-4 rounded-[1.25rem] border border-[#f0e1cf] bg-[#fffaf5] p-4 text-sm text-[#6d5849]">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">Moderator notes</p>
                            <p className="mt-2 leading-6">{report.admin_notes}</p>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[14rem] lg:items-end">
                        <span className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${statusTone(report.status)}`}>
                          {REPORT_STATUS_LABELS[report.status]}
                        </span>
                        <p className="text-sm text-[#6d5849] lg:text-right">
                          Last updated {formatDate(report.updated_at)}
                        </p>
                        {postHref ? (
                          <Link href={postHref} className="inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                            Open story →
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
                })}
              </section>

              {hasMoreReports ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-semibold text-[#7a331b]">Loaded {filteredReports.length} reports so far</p>
                    <p className="mt-1 text-sm text-[#6d5849]">
                      Need older moderation updates? Load the next set without dropping your current status view.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {page > 1 ? (
                      <Link
                        href={buildReportsHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
                      >
                        Show fewer
                      </Link>
                    ) : null}
                    <Link
                      href={buildReportsHref(activeView, query, page + 1, activeAuthorId, activeAuthorLabel)}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#632815]"
                    >
                      Load older reports
                    </Link>
                  </div>
                </section>
              ) : page > 1 ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <p className="text-sm text-[#6d5849]">You have reached the oldest report in this filtered history.</p>
                  <Link
                    href={buildReportsHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel)}
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
