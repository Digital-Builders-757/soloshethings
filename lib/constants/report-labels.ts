import type { report_reason, report_status } from '@/types/database'

export const REPORT_REASON_LABELS: Record<report_reason, string> = {
  spam: 'Spam or scammy promotion',
  harassment: 'Harassment or bullying',
  inappropriate: 'Unsafe, explicit, or inappropriate content',
  copyright: 'Copyright issue',
  other: 'Something else',
}

export const REPORT_STATUS_LABELS: Record<report_status, string> = {
  pending: 'Pending review',
  reviewed: 'Under review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  withdrawn: 'Withdrawn',
}
