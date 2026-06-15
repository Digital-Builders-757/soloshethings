import { EmptyState } from '@/components/ui/empty-state'
import type { NoResultsStateProps } from '@/types/ui-primitives'

const DEFAULT_FILTER_EYEBROW = 'Nothing in this view'

/**
 * Filtered-list empty state built on {@link EmptyState}.
 * Standardizes reset + alternate navigation for active filter/search misses.
 */
export function NoResultsState({
  filterEyebrow = DEFAULT_FILTER_EYEBROW,
  resetAction,
  alternateActions,
  useCommunitySectionLabel = true,
  ...emptyStateProps
}: NoResultsStateProps) {
  return (
    <EmptyState
      {...emptyStateProps}
      eyebrow={filterEyebrow}
      useCommunitySectionLabel={useCommunitySectionLabel}
      primaryAction={{
        ...resetAction,
        variant: resetAction.variant ?? 'secondary',
      }}
      extraActions={alternateActions?.map((action) => ({
        ...action,
        variant: action.variant ?? 'link',
      }))}
      ariaLive="polite"
    />
  )
}
