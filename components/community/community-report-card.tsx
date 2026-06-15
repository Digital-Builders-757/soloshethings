import Link from 'next/link'

import { MemberProfileLink } from '@/components/profile/member-profile-link'
import { PendingReportWithdrawal } from '@/components/safety/pending-report-withdrawal'
import { StatusBadge } from '@/components/ui/status-badge'
import { REPORT_REASON_LABELS } from '@/lib/queries/reports'
import { reportCardRailBg } from '@/lib/report-status-presentational'
import { cn } from '@/lib/utils'
import type { report_reason, report_status } from '@/types/database'

const reportLinkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange'

export type CommunityReportCardProps = {
  reportId: string
  status: report_status
  reason: report_reason
  description?: string | null
  createdAt: string
  updatedAt: string
  reviewedAt?: string | null
  adminNotes?: string | null
  formatDate: (iso: string) => string
  postTitle: string
  postHref?: string | null
  authorName: string
  authorUsername?: string | null
  authorFilterHref?: string | null
  hasPost: boolean
  currentPath: string
  className?: string
}

export function CommunityReportCard({
  reportId,
  status,
  reason,
  description,
  createdAt,
  updatedAt,
  reviewedAt,
  adminNotes,
  formatDate,
  postTitle,
  postHref,
  authorName,
  authorUsername,
  authorFilterHref,
  hasPost,
  currentPath,
  className,
}: CommunityReportCardProps) {
  return (
    <article className={cn('editorial-card overflow-hidden p-0 shadow-[0_14px_36px_rgba(122,51,27,0.06)]', className)}>
      <div className="flex min-w-0">
        <div className={cn('w-1.5 shrink-0 sm:w-2', reportCardRailBg(status))} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-blue/70">
              <span>Submitted {formatDate(createdAt)}</span>
              <span className="text-brand-pinkDark/35" aria-hidden>
                ·
              </span>
              <span>{REPORT_REASON_LABELS[reason]}</span>
            </div>

            <h2 className="mt-3 font-serif text-xl font-semibold text-brand-pinkDark sm:text-2xl">
              {postHref ? (
                <Link
                  href={postHref}
                  className={cn('transition hover:text-brand-orange', reportLinkFocus)}
                >
                  {postTitle}
                </Link>
              ) : (
                postTitle
              )}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-brand-blue/85">
              {description?.trim() ? description : 'No additional notes were added with this report.'}
            </p>

            {hasPost ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-blue/85">
                <span>
                  Story by{' '}
                  <MemberProfileLink
                    username={authorUsername}
                    className="font-semibold text-brand-pinkDark hover:text-brand-orange"
                  >
                    {authorName}
                  </MemberProfileLink>
                </span>
                {authorFilterHref ? (
                  <Link
                    href={authorFilterHref}
                    className={cn(
                      'font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline',
                      reportLinkFocus,
                    )}
                  >
                    Filter to this author
                  </Link>
                ) : null}
              </div>
            ) : null}

            {reviewedAt ? (
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-brand-blue/65">
                Last moderation update · {formatDate(reviewedAt)}
              </p>
            ) : null}
            {adminNotes?.trim() ? (
              <div className="mt-4 rounded-[1.15rem] border border-brand-pinkDark/12 bg-brand-cream/35 px-4 py-3 sm:px-5 sm:py-4">
                <p className="profile-form-section-label text-[0.62rem]">Note from moderators</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-blue/90">{adminNotes}</p>
              </div>
            ) : null}
            {status === 'pending' ? (
              <PendingReportWithdrawal reportId={reportId} returnPath={currentPath} />
            ) : null}
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-brand-pinkDark/10 bg-brand-cream/30 p-4 sm:max-w-[15rem] sm:p-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-blue/65">
              Status
            </p>
            <StatusBadge
              kind="report"
              status={status}
              className="min-h-10 w-full items-center justify-center text-center leading-snug sm:min-h-0 sm:w-auto sm:justify-start sm:px-4 sm:py-2"
            />
            <p className="text-xs leading-relaxed text-brand-blue/75">Record updated {formatDate(updatedAt)}</p>
            {postHref ? (
              <Link
                href={postHref}
                className={cn(
                  'text-sm font-semibold text-brand-orange underline-offset-2 transition hover:text-brand-coral hover:underline',
                  reportLinkFocus,
                )}
              >
                Open story
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
