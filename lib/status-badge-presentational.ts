/**
 * Visual mappings for {@link StatusBadge}.
 * Reuses report-status-presentational and community surface classes.
 */

import { REPORT_STATUS_LABELS } from '@/lib/constants/report-labels'
import { reportStatusBadgeClasses } from '@/lib/report-status-presentational'
import { cn } from '@/lib/utils'
import type { post_status, privacy_level } from '@/types/database'
import type { StatusBadgePresentation, StatusBadgeProps } from '@/types/status-badge'

const REPORT_BADGE_BASE =
  'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm'

const COMPACT_BADGE_BASE =
  'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.08em]'

const MEMBERSHIP_LABELS = {
  full: 'Full access',
  limited: 'Starter mode',
} as const

const MEMBERSHIP_CLASSES = {
  full: 'border-emerald-400/35 bg-emerald-50/95 text-emerald-950',
  limited: 'border-brand-orange/35 bg-brand-orange/10 text-brand-pinkDark',
} as const

const LIFECYCLE_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  removed: 'Permanently removed',
} as const

function lifecycleBadgeClasses(status: post_status): string {
  switch (status) {
    case 'draft':
      return cn(
        COMPACT_BADGE_BASE,
        'border-brand-orange/35 bg-brand-orange/10 text-brand-pinkDark',
      )
    case 'published':
      return cn('story-meta-chip community-chip-public text-[0.58rem]')
    case 'archived':
      return cn(
        COMPACT_BADGE_BASE,
        'border-slate-400/50 bg-slate-50 text-slate-800',
      )
    case 'removed':
      return cn(
        COMPACT_BADGE_BASE,
        'border-amber-400/55 bg-amber-50 text-amber-950',
      )
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

const PRIVACY_LABELS = {
  public: 'Public',
  limited: 'Limited',
  private: 'Private',
} as const

function privacyBadgeClasses(level: privacy_level): string {
  switch (level) {
    case 'public':
      return cn('story-meta-chip community-chip-public text-[0.58rem]')
    case 'limited':
      return cn(
        COMPACT_BADGE_BASE,
        'border-brand-gold/45 bg-brand-cream/55 text-brand-pinkDark',
      )
    case 'private':
      return cn('story-meta-chip community-chip-private text-[0.58rem]')
    default: {
      const _exhaustive: never = level
      return _exhaustive
    }
  }
}

const STORY_MARKER_LABELS = {
  featured: 'Featured',
  reported: 'Reported by you',
  saved: 'Saved',
} as const

type StoryMarker = 'featured' | 'reported' | 'saved'

function storyMarkerClasses(marker: StoryMarker): string {
  switch (marker) {
    case 'featured':
      return cn('community-badge-featured')
    case 'reported':
      return cn('community-badge-reported')
    case 'saved':
      return cn('community-pill-saved')
    default: {
      const _exhaustive: never = marker
      return _exhaustive
    }
  }
}

export function getStatusBadgePresentation(props: StatusBadgeProps): StatusBadgePresentation {
  switch (props.kind) {
    case 'report':
      return {
        label: props.label ?? REPORT_STATUS_LABELS[props.status],
        className: cn(REPORT_BADGE_BASE, reportStatusBadgeClasses(props.status), props.className),
      }
    case 'membership':
      return {
        label: props.label ?? MEMBERSHIP_LABELS[props.tier],
        className: cn(COMPACT_BADGE_BASE, MEMBERSHIP_CLASSES[props.tier], props.className),
      }
    case 'lifecycle':
      return {
        label: props.label ?? LIFECYCLE_LABELS[props.status],
        className: cn(lifecycleBadgeClasses(props.status), props.className),
      }
    case 'privacy':
      return {
        label: props.label ?? PRIVACY_LABELS[props.level],
        className: cn(privacyBadgeClasses(props.level), props.className),
      }
    case 'post-visibility':
      return {
        label: props.label ?? (props.visibility === 'public' ? 'Public' : 'Private'),
        className: cn(
          props.visibility === 'public'
            ? 'story-meta-chip community-chip-public text-[0.58rem]'
            : 'story-meta-chip community-chip-private text-[0.58rem]',
          props.className,
        ),
      }
    case 'story-marker':
      return {
        label: props.label ?? STORY_MARKER_LABELS[props.marker],
        className: cn(storyMarkerClasses(props.marker), props.className),
      }
    default: {
      const _exhaustive: never = props
      return _exhaustive
    }
  }
}
