import type { ReactNode } from 'react'

/**
 * Shared types for Phase B UI primitives (SectionHeader, EmptyState, NoResultsState).
 * Visual/composition only — no data or auth contracts.
 */

/** Section title scale for page heroes, in-page sections, and compact module headers. */
export type SectionHeaderSize = 'page' | 'section' | 'compact'

/**
 * Color/typography tone aligned with existing route families.
 * - warm: editorial community surfaces (places, saved, profile-adjacent)
 * - community: workspace routes using brand-pinkDark / brand-blue aliases
 * - blog: public editorial list/article headers
 */
export type SectionHeaderTone = 'warm' | 'community' | 'blog'

export interface SectionHeaderProps {
  /** Optional uppercase label above the title (uses `.eyebrow`). */
  eyebrow?: string
  /** Main heading content (string or rich text). */
  title: ReactNode
  /** Supporting copy below the title. */
  description?: ReactNode
  /** Optional trailing actions (links, buttons) — laid out beside title on large screens. */
  actions?: ReactNode
  /** Heading level and type scale. @default 'page' */
  size?: SectionHeaderSize
  /** Title/body color pairing. @default 'warm' */
  tone?: SectionHeaderTone
  /** Root element class names. */
  className?: string
  /**
   * Stable id for `aria-labelledby` on parent landmarks.
   * Title id becomes `{id}-title` when provided.
   */
  id?: string
  /** Semantic wrapper; use `header` for page-level heroes. @default 'div' */
  as?: 'header' | 'div'
}

/** CTA presentation for empty-state actions. */
export type EmptyStateActionVariant = 'primary' | 'secondary' | 'link'

export interface EmptyStateActionLink {
  label: string
  href: string
  variant?: EmptyStateActionVariant
  className?: string
}

/**
 * Surface treatment for empty states across routes.
 * - editorial: `.editorial-card` (places, saved global empty)
 * - community: cream panel with brown border (reports filtered empty)
 * - blog: centered publication-style block
 * - inline: nested shelf/workspace panels (submit)
 */
export type EmptyStateVariant = 'editorial' | 'community' | 'blog' | 'inline'

export interface EmptyStateProps {
  /** Optional decorative icon (rendered with `aria-hidden`). */
  icon?: ReactNode
  /** Optional label above the title (`.eyebrow` or `.community-section-label`). */
  eyebrow?: string
  /** Whether eyebrow uses community-section-label styling. @default false */
  useCommunitySectionLabel?: boolean
  /** Primary empty-state headline. */
  title: ReactNode
  /** Explanatory body copy. */
  description: ReactNode
  /** Primary call to action (required). */
  primaryAction: EmptyStateActionLink
  /** Optional secondary call to action. */
  secondaryAction?: EmptyStateActionLink
  /** Additional link actions after primary/secondary (e.g. cross-nav). */
  extraActions?: EmptyStateActionLink[]
  /** Card/surface variant. @default 'editorial' */
  variant?: EmptyStateVariant
  className?: string
  /**
   * Stable id for `aria-labelledby` / `aria-describedby`.
   * Title id becomes `{id}-title` when provided.
   */
  id?: string
  /**
   * Live region politeness for dynamic empty results (e.g. filtered lists).
   * @default undefined
   */
  ariaLive?: 'polite' | 'assertive' | 'off'
}

export interface NoResultsStateProps
  extends Omit<
    EmptyStateProps,
    'primaryAction' | 'secondaryAction' | 'extraActions' | 'eyebrow'
  > {
  /**
   * Filter-context label above the title.
   * @default 'Nothing in this view'
   */
  filterEyebrow?: string
  /** @default true */
  useCommunitySectionLabel?: boolean
  /** Clears active filters (typically `cta-secondary`). */
  resetAction: EmptyStateActionLink
  /** Optional alternate navigation (e.g. saved, show all members). */
  alternateActions?: EmptyStateActionLink[]
}
