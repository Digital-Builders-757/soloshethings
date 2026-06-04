import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ActiveMemberFilterBanner } from '@/components/community/active-member-filter-banner'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { PendingReportWithdrawal } from '@/components/safety/pending-report-withdrawal'
import { MemberProfileLink } from '@/components/profile/member-profile-link'
import { EmptyState } from '@/components/ui/empty-state'
import { NoResultsState } from '@/components/ui/no-results-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { appendCommunityAuthorParams, buildCommunityWorkspaceHref, buildStoryDetailHref } from '@/lib/community-navigation'
import {
  REPORT_REASON_LABELS,
  getMemberPostReports,
} from '@/lib/queries/reports'
import {
  reportCardRailBg,
  reportSummaryChipClasses,
} from '@/lib/report-status-presentational'
import { getUser } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

const VIEW_OPTIONS = [
  { value: 'all', label: 'All reports' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Under review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'withdrawn', label: 'Withdrawn' },
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
    withdrawn: reports.filter((report) => report.status === 'withdrawn').length,
  }

  const matchingReports = reports.filter((report) => {
    const title = report.post?.title ?? 'Story no longer available'
    const authorName = report.post?.author?.full_name?.trim() || report.post?.author?.username || 'Solo SHE member'
    const matchesQuery =
      query.length === 0 ||
      [title, authorName, REPORT_REASON_LABELS[report.reason], report.description ?? '', report.admin_notes ?? '', report.reviewed_at ?? '']
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
  const workspaceHrefs = activeAuthorId
    ? {
        places: buildCommunityWorkspaceHref('places', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
        saved: buildCommunityWorkspaceHref('saved', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
        reports: buildCommunityWorkspaceHref('reports', { authorId: activeAuthorId, authorLabel: activeAuthorLabel }),
      }
    : undefined

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="places-hero-shell overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="places-hero-inner">
          <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Safety and moderation</p>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-pinkDark sm:text-4xl md:text-5xl">
            Your report history
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-brand-blue/85 sm:text-base">
            Only you and the moderation team can see these submissions. Use this page to check what is still queued,
            what is being reviewed, and what has been closed — without alerts or noise.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <span className="community-summary-chip text-xs font-semibold sm:text-sm">
              {filteredReports.length} of {reports.length} report{reports.length === 1 ? '' : 's'} showing
            </span>
            <span className={reportSummaryChipClasses('pending')}>{counts.pending} pending</span>
            <span className={reportSummaryChipClasses('reviewed')}>{counts.reviewed} under review</span>
            <span className={reportSummaryChipClasses('resolved')}>{counts.resolved} resolved</span>
            <span className={reportSummaryChipClasses('dismissed')}>{counts.dismissed} dismissed</span>
            <span className={reportSummaryChipClasses('withdrawn')}>{counts.withdrawn} withdrawn</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/places" className="cta-secondary inline-flex min-h-11 items-center justify-center px-6 text-sm">
              Browse stories
            </Link>
            <Link href="/dashboard" className="cta-secondary inline-flex min-h-11 items-center justify-center px-6 text-sm">
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <CommunitySurfaceNav active="reports" itemHrefs={workspaceHrefs} />

      {reports.length === 0 ? (
        <EmptyState
          id="reports-empty"
          className="mt-6 border-brand-pinkDark/12 bg-white shadow-[0_16px_40px_rgba(122,51,27,0.06)] sm:p-10"
          variant="community"
          eyebrow="No activity yet"
          title="You have not submitted any reports"
          description="If something on the feed concerns you, open the story and use Report — it will show up here with a clear status so you can follow moderation outcomes at your own pace."
          primaryAction={{
            label: 'Go to the feed',
            href: '/places',
            variant: 'secondary',
          }}
          extraActions={[
            {
              label: 'View saved stories',
              href: '/saved',
              variant: 'link',
              className:
                'community-filter-pill inline-flex min-h-12 items-center justify-center border-brand-pinkDark/15 bg-brand-cream/40 text-brand-pinkDark hover:border-brand-pinkDark/25 sm:min-h-11',
            },
          ]}
        />
      ) : (
        <>
          <section className="editorial-card mt-6 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <form method="get" className="flex-1">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="mb-2 block text-sm font-semibold text-brand-pinkDark">Search reports</span>
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Story title, reason, or notes"
                      className="min-h-12 w-full rounded-[1rem] border border-brand-pinkDark/18 bg-white px-4 text-base text-brand-blue outline-none transition placeholder:text-brand-pinkDark/45 focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/12 sm:min-h-11 sm:text-sm"
                    />
                  </label>
                  <input type="hidden" name="view" value={activeView} />
                  <input type="hidden" name="author" value={activeAuthorId} />
                  <input type="hidden" name="authorLabel" value={activeAuthorLabel} />
                  <div className="flex gap-3 sm:self-end">
                    <button
                      type="submit"
                      className="inline-flex min-h-12 min-w-[5.5rem] items-center justify-center rounded-full bg-brand-pinkDark px-5 text-sm font-semibold text-white transition hover:bg-brand-pinkDark/90 sm:min-h-11"
                    >
                      Apply
                    </button>
                    <Link
                      href="/reports"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-pinkDark/18 bg-white px-5 text-sm font-semibold text-brand-pinkDark transition hover:border-brand-orange/35 hover:text-brand-orange sm:min-h-11"
                    >
                      Clear
                    </Link>
                  </div>
                </div>
              </form>

              <div className="community-context-banner max-w-lg px-4 py-3 text-sm leading-relaxed text-brand-blue/85">
                <p>
                  Viewing <span className="font-semibold text-brand-pinkDark">{activeViewLabel}</span>
                  {activeAuthorLabel ? (
                    <>
                      {' '}
                      for stories by <span className="font-semibold text-brand-pinkDark">{activeAuthorLabel}</span>
                    </>
                  ) : null}
                  {query ? (
                    <>
                      {' '}
                      matching <span className="font-semibold text-brand-pinkDark">&ldquo;{query}&rdquo;</span>
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {VIEW_OPTIONS.map((option) => {
                const isActive = option.value === activeView

                return (
                  <Link
                    key={option.value}
                    href={buildReportsHref(option.value, query, 1, activeAuthorId, activeAuthorLabel)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn('community-filter-pill min-h-11', isActive && 'community-filter-pill-active')}
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
            <NoResultsState
              id="reports-filtered-empty"
              className="mt-6"
              variant="community"
              title="No reports match your filters"
              description="Try another status tab or clear search — your full history is unchanged."
              resetAction={{ label: 'Reset filters', href: '/reports' }}
              alternateActions={[
                ...(activeAuthorId
                  ? [
                      {
                        label: 'Clear member filter',
                        href: buildReportsHref(activeView, query, 1),
                        className:
                          'community-filter-pill inline-flex min-h-12 items-center justify-center sm:min-h-11',
                      },
                    ]
                  : []),
                {
                  label: 'Browse stories',
                  href: '/places',
                  className:
                    'community-filter-pill inline-flex min-h-12 items-center justify-center sm:min-h-11',
                },
              ]}
            />
          ) : (
            <>
              <section className="mt-6 space-y-4 sm:space-y-5">
                {filteredReports.map((report) => {
                  const postTitle = report.post?.title ?? 'Story no longer available'
                  const postHref = report.post?.id ? buildStoryDetailHref(report.post.id, currentPath) : null
                  const authorName =
                    report.post?.author?.full_name?.trim() || report.post?.author?.username || 'Solo SHE member'
                  const authorFilterHref = report.post?.author_id
                    ? buildReportsHref(activeView, query, 1, report.post.author_id, authorName)
                    : null

                  return (
                    <article key={report.id} className="editorial-card overflow-hidden p-0 shadow-[0_14px_36px_rgba(122,51,27,0.06)]">
                      <div className="flex min-w-0">
                        <div
                          className={cn('w-1.5 shrink-0 sm:w-2', reportCardRailBg(report.status))}
                          aria-hidden
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-blue/70">
                              <span>Submitted {formatDate(report.created_at)}</span>
                              <span className="text-brand-pinkDark/35" aria-hidden>
                                ·
                              </span>
                              <span>{REPORT_REASON_LABELS[report.reason]}</span>
                            </div>

                            <h2 className="mt-3 font-serif text-xl font-semibold text-brand-pinkDark sm:text-2xl">
                              {postHref ? (
                                <Link href={postHref} className="transition hover:text-brand-orange">
                                  {postTitle}
                                </Link>
                              ) : (
                                postTitle
                              )}
                            </h2>

                            <p className="mt-3 text-sm leading-relaxed text-brand-blue/85">
                              {report.description?.trim()
                                ? report.description
                                : 'No additional notes were added with this report.'}
                            </p>

                            {report.post ? (
                              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-blue/85">
                                <span>
                                  Story by{' '}
                                  <MemberProfileLink
                                    username={report.post.author?.username}
                                    className="font-semibold text-brand-pinkDark hover:text-brand-orange"
                                  >
                                    {authorName}
                                  </MemberProfileLink>
                                </span>
                                {authorFilterHref ? (
                                  <Link
                                    href={authorFilterHref}
                                    className="font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline"
                                  >
                                    Filter to this author
                                  </Link>
                                ) : null}
                              </div>
                            ) : null}

                            {report.reviewed_at ? (
                              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-brand-blue/65">
                                Last moderation update · {formatDate(report.reviewed_at)}
                              </p>
                            ) : null}
                            {report.admin_notes?.trim() ? (
                              <div className="mt-4 rounded-[1.15rem] border border-brand-pinkDark/12 bg-brand-cream/35 px-4 py-3 sm:px-5 sm:py-4">
                                <p className="profile-form-section-label text-[0.62rem]">Note from moderators</p>
                                <p className="mt-2 text-sm leading-relaxed text-brand-blue/90">{report.admin_notes}</p>
                              </div>
                            ) : null}
                            {report.status === 'pending' ? (
                              <PendingReportWithdrawal reportId={report.id} returnPath={currentPath} />
                            ) : null}
                          </div>

                          <div className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-brand-pinkDark/10 bg-brand-cream/30 p-4 sm:max-w-[15rem] sm:p-4">
                            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-blue/65">
                              Status
                            </p>
                            <StatusBadge
                              kind="report"
                              status={report.status}
                              className="min-h-10 w-full items-center justify-center text-center leading-snug sm:min-h-0 sm:w-auto sm:justify-start sm:px-4 sm:py-2"
                            />
                            <p className="text-xs leading-relaxed text-brand-blue/75">
                              Record updated {formatDate(report.updated_at)}
                            </p>
                            {postHref ? (
                              <Link
                                href={postHref}
                                className="text-sm font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline"
                              >
                                Open story
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </section>

              {hasMoreReports ? (
                <section className="editorial-card-strong mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-semibold text-brand-pinkDark">
                      Showing {filteredReports.length} report{filteredReports.length === 1 ? '' : 's'} in this view
                    </p>
                    <p className="mt-1 text-sm text-brand-blue/85">
                      Older entries load with the same filters so you can read chronologically.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {page > 1 ? (
                      <Link
                        href={buildReportsHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel)}
                        className="community-filter-pill inline-flex min-h-11 items-center justify-center"
                      >
                        Previous page
                      </Link>
                    ) : null}
                    <Link
                      href={buildReportsHref(activeView, query, page + 1, activeAuthorId, activeAuthorLabel)}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pinkDark px-6 text-sm font-semibold text-white transition hover:bg-brand-pinkDark/90"
                    >
                      Next page
                    </Link>
                  </div>
                </section>
              ) : page > 1 ? (
                <section className="editorial-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <p className="text-sm text-brand-blue/85">End of list for this filter.</p>
                  <Link
                    href={buildReportsHref(activeView, query, page - 1, activeAuthorId, activeAuthorLabel)}
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
    </main>
  )
}
