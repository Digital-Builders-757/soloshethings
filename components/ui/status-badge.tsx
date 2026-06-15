import { forwardRef } from 'react'

import { getStatusBadgePresentation } from '@/lib/status-badge-presentational'
import { cn } from '@/lib/utils'
import type { StatusBadgeProps } from '@/types/status-badge'

export type { StatusBadgeProps } from '@/types/status-badge'

export type StatusBadgeComponentProps = StatusBadgeProps & {
  className?: string
  id?: string
}

/**
 * Unified status badge for reports, membership, lifecycle, privacy, and story markers.
 * Delegates color semantics to existing token mappings — no new palette.
 */
export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeComponentProps>(
  function StatusBadge(props, ref) {
    const { className: propClassName, id, ...presentationProps } = props
    const { label, className } = getStatusBadgePresentation(presentationProps)
    const isReportStatus = presentationProps.kind === 'report'

    return (
      <span
        ref={ref}
        id={id}
        className={cn(className, propClassName)}
        {...(isReportStatus ? { 'aria-label': `Report status: ${label}` } : {})}
      >
        {label}
      </span>
    )
  },
)

StatusBadge.displayName = 'StatusBadge'
