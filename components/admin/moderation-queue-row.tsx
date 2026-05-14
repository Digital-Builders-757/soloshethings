'use client'

import { moderateCommunityReportAction } from '@/app/actions/admin-moderation'
import type { ModerationPostReportRow } from '@/lib/queries/admin-reports'
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '@/lib/constants/report-labels'
import type { report_status } from '@/types/database'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

function SaveModerationDecisionButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-[#7a331b] px-4 text-sm font-semibold text-white transition hover:bg-[#632815] disabled:opacity-50"
    >
      {pending ? 'Saving…' : label}
    </button>
  )
}

const NEXT_STATUS: Partial<Record<report_status, { value: report_status; label: string }[]>> = {
  pending: [
    { value: 'reviewed', label: 'Mark under review' },
    { value: 'resolved', label: 'Resolve' },
    { value: 'dismissed', label: 'Dismiss' },
  ],
  reviewed: [
    { value: 'resolved', label: 'Resolve' },
    { value: 'dismissed', label: 'Dismiss' },
    { value: 'pending', label: 'Back to pending' },
  ],
  resolved: [
    { value: 'reviewed', label: 'Reopen review' },
    { value: 'dismissed', label: 'Dismiss instead' },
  ],
  dismissed: [
    { value: 'pending', label: 'Reopen as pending' },
    { value: 'reviewed', label: 'Reopen review' },
  ],
  withdrawn: [{ value: 'pending', label: 'Reopen as pending' }],
}

export function ModerationQueueRow({
  row,
  returnPath,
}: {
  row: ModerationPostReportRow
  returnPath: string
}) {
  const router = useRouter()
  const [state, action] = useActionState(moderateCommunityReportAction, null)

  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [router, state?.success])

  const postTitle = row.post?.title ?? 'Story unavailable'
  const authorName =
    row.post?.author?.full_name?.trim() || row.post?.author?.username || 'Solo SHE member'
  const reporterLabel = row.reporter?.full_name?.trim() || row.reporter?.username || 'Reporter'
  const transitions = NEXT_STATUS[row.status] ?? []
  const postHref = row.post?.id ? `/places/${row.post.id}` : null

  return (
    <article className="editorial-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9b7455]">
            <span>Report #{row.id.slice(0, 8)}</span>
            <span aria-hidden>•</span>
            <span>{REPORT_REASON_LABELS[row.reason]}</span>
            <span aria-hidden>•</span>
            <span>Queued {formatWhen(row.created_at)}</span>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#7a331b]">
              {postHref ? (
                <Link href={postHref} className="transition hover:text-[#e34b16]">
                  {postTitle}
                </Link>
              ) : (
                postTitle
              )}
            </h2>
            <p className="mt-2 text-sm text-[#6d5849]">
              Story owner <span className="font-semibold text-[#7a331b]">{authorName}</span> • Reporter{' '}
              <span className="font-semibold text-[#7a331b]">{reporterLabel}</span>
              {row.post?.status ? (
                <>
                  {' '}
                  • Post status{' '}
                  <span className="font-semibold text-[#7a331b]">{row.post.status}</span>
                </>
              ) : null}
            </p>
          </div>
          {row.description?.trim() ? (
            <p className="text-sm leading-6 text-[#6d5849]">
              <span className="font-semibold text-[#7a331b]">Reporter context: </span>
              {row.description}
            </p>
          ) : (
            <p className="text-sm text-[#9b7455]">No extra reporter context.</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-[#6d5849]">
            <span className="rounded-full border border-[#ead8c2] px-3 py-1 font-semibold text-[#7a331b]">
              Status · {REPORT_STATUS_LABELS[row.status]}
            </span>
            {row.reviewed_at ? (
              <span className="rounded-full border border-[#ead8c2] px-3 py-1">
                Moderation timestamp · {formatWhen(row.reviewed_at)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="w-full min-w-[16rem] max-w-xl space-y-3 rounded-2xl border border-[#f0e1cf] bg-[#fffaf5] p-4 lg:shrink-0">
          {state?.error ? (
            <p className="text-sm text-red-700" role="alert">
              {state.error}
            </p>
          ) : state?.success ? (
            <p className="text-sm text-green-800" role="status">
              Updated. Refreshing timeline…
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">Moderation decision</p>
              <form action={action} className="space-y-4">
                <input type="hidden" name="reportId" value={row.id} />
                <input type="hidden" name="path" value={returnPath} />
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#9b7455]" htmlFor={`status-${row.id}`}>
                  Next status
                </label>
                <select
                  id={`status-${row.id}`}
                  name="status"
                  defaultValue={transitions[0]?.value ?? row.status}
                  className="editorial-input warm-focus-ring w-full px-4 py-3 text-sm text-[#4f4034]"
                >
                  {transitions.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#9b7455]" htmlFor={`notes-${row.id}`}>
                  Member-visible note (max 2000 characters)
                </label>
                <textarea
                  id={`notes-${row.id}`}
                  name="adminNotes"
                  rows={5}
                  defaultValue={row.admin_notes ?? ''}
                  className="editorial-input warm-focus-ring w-full resize-y px-4 py-3 text-sm leading-6 text-[#4f4034]"
                  placeholder="Brief, respectful summary surfaced to the reporter on /reports"
                />
                <SaveModerationDecisionButton label="Apply decision" />
              </form>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
