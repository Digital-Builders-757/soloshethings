import type { post_status, privacy_level, report_status } from '@/types/database'

/**
 * Discriminated props for {@link StatusBadge} presentation resolution.
 * Visual/composition only — no auth or entitlement logic.
 */
export type StatusBadgeProps =
  | {
      kind: 'report'
      status: report_status
      /** Override default label from REPORT_STATUS_LABELS. */
      label?: string
      className?: string
    }
  | {
      kind: 'membership'
      tier: 'full' | 'limited'
      label?: string
      className?: string
    }
  | {
      kind: 'lifecycle'
      status: post_status
      label?: string
      className?: string
    }
  | {
      kind: 'privacy'
      level: privacy_level
      label?: string
      className?: string
    }
  | {
      kind: 'post-visibility'
      visibility: 'public' | 'private'
      label?: string
      className?: string
    }
  | {
      kind: 'story-marker'
      marker: 'featured' | 'reported' | 'saved'
      label?: string
      className?: string
    }

export interface StatusBadgePresentation {
  label: string
  className: string
}
