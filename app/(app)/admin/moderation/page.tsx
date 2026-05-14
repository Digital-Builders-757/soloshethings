import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ModerationQueueRow } from '@/components/admin/moderation-queue-row'
import type { ModerationPostReportRow } from '@/lib/queries/admin-reports'
import { getModerationPostReports } from '@/lib/queries/admin-reports'
import { REPORT_STATUS_LABELS } from '@/lib/queries/reports'
import { isPlatformAdmin } from '@/lib/auth/platform-admin'
import { getUser } from '@/lib/supabase/server'
import type { report_status } from '@/types/database'

type Search = {
  view?: string
}

type Props = {
  searchParams?: Promise<Search>
}

function normalizeView(raw?: string): 'open' | 'all' | report_status {
  if (raw === 'open' || raw === 'all') {
    return raw
  }

  const statuses = Object.keys(REPORT_STATUS_LABELS) as report_status[]
  if (raw && statuses.includes(raw as report_status)) {
    return raw as report_status
  }

  return 'open'
}

function moderationPriority(status: report_status): number {
  switch (status) {
    case 'pending':
      return 0
    case 'reviewed':
      return 1
    case 'withdrawn':
      return 2
    case 'resolved':
      return 3
    case 'dismissed':
      return 4
    default:
      return 9
  }
}

function compareQueueRows(a: ModerationPostReportRow, b: ModerationPostReportRow): number {
  const pri = moderationPriority(a.status) - moderationPriority(b.status)

  if (pri !== 0) {
    return pri
  }

  return Date.parse(a.created_at) - Date.parse(b.created_at)
}

export default async function AdminModerationPage({ searchParams }: Props) {
  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin/moderation')
  }

  if (!(await isPlatformAdmin(user.id))) {
    redirect('/dashboard?moderation=forbidden')
  }

  const params = searchParams ? await searchParams : {}
  const view = normalizeView(params.view)

  const rows =
    view === 'open'
      ? await getModerationPostReports({
          statuses: ['pending', 'reviewed'],
        })
      : view === 'all'
        ? await getModerationPostReports()
        : await getModerationPostReports({ statuses: [view as report_status] })

  rows.sort(compareQueueRows)

  const filteredLabel =
    view === 'open'
      ? 'Pending + under review'
      : view === 'all'
        ? 'Everything'
        : REPORT_STATUS_LABELS[view]

  const statusTabs = Object.keys(REPORT_STATUS_LABELS) as report_status[]

  function buildModerationListHref(next: 'open' | 'all' | report_status): string {
    if (next === 'open') {
      return '/admin/moderation'
    }
    const u = new URLSearchParams()
    u.set('view', next)
    return `/admin/moderation?${u.toString()}`
  }

  const returnPath = buildModerationListHref(view)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong space-y-4 p-6 sm:p-9">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Moderation</p>
        <h1 className="font-serif text-4xl font-bold text-[#7a331b]">Community reports queue</h1>
        <p className="max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          Operational surface for SoloSHEThings platform admins (<span className="font-semibold">profiles.role = admin</span>).
          Actions log <span className="font-semibold">reviewed_at</span>/<span className="font-semibold">reviewed_by</span>; member-visible notes
          show on each reporter&apos;s <Link href="/reports" className="font-semibold text-[#e34b16] underline-offset-4 hover:underline">/reports</Link>{' '}
          page only for their submissions.
        </p>
        <div className="flex flex-wrap gap-3 pt-3 text-xs font-semibold uppercase tracking-[0.14em]">
          <Link
            href={buildModerationListHref('open')}
            aria-current={view === 'open' ? 'page' : undefined}
            className={
              view === 'open'
                ? 'rounded-full bg-[#7a331b] px-4 py-2 text-white'
                : 'rounded-full border border-[#ead8c2] px-4 py-2 text-[#7a331b] hover:border-[#e34b16]/60'
            }
          >
            Open queue
          </Link>
          <Link
            href={buildModerationListHref('all')}
            aria-current={view === 'all' ? 'page' : undefined}
            className={
              view === 'all'
                ? 'rounded-full bg-[#7a331b] px-4 py-2 text-white'
                : 'rounded-full border border-[#ead8c2] px-4 py-2 text-[#7a331b] hover:border-[#e34b16]/60'
            }
          >
            All statuses
          </Link>
          {statusTabs.map((chip) => (
            <Link
              key={chip}
              href={buildModerationListHref(chip)}
              aria-current={view === chip ? 'page' : undefined}
              className={
                view === chip
                  ? 'rounded-full bg-[#fffaf5] px-4 py-2 text-[#7a331b] ring-1 ring-[#e34b16]/40'
                  : 'rounded-full border border-[#ead8c2] px-4 py-2 text-[#7a331b] hover:border-[#e34b16]/60'
              }
            >
              {REPORT_STATUS_LABELS[chip]}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-auto rounded-full border border-[#ead8c2] px-4 py-2 text-[#7a331b] hover:border-[#e34b16]/60"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-sm text-[#6d5849]">
          <p>
            Showing <span className="font-semibold text-[#7a331b]">{filteredLabel}</span> · {rows.length} report
            {rows.length === 1 ? '' : 's'}
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="editorial-card p-8 text-center text-[#6d5849]">Nothing queued for this view.</div>
        ) : (
          rows.map((row) => <ModerationQueueRow key={row.id} row={row} returnPath={returnPath} />)
        )}
      </section>
    </main>
  )
}
