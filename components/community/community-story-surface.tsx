import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Warm list card — aliases `editorial-card`; optional featured ring + hover lift. */
export function communityWarmCardClassName(options?: { featured?: boolean; interactiveLift?: boolean }) {
  return cn(
    'community-card-warm overflow-hidden',
    options?.featured && 'story-card-featured',
    options?.interactiveLift !== false && 'community-card-lift'
  )
}

/** Cocoa/dark panel — aliases `editorial-card-dark`; same featured + lift hooks as warm. */
export function communityDarkCardClassName(options?: { featured?: boolean; interactiveLift?: boolean }) {
  return cn(
    'community-card-dark overflow-hidden',
    options?.featured && 'story-card-featured',
    options?.interactiveLift !== false && 'community-card-lift'
  )
}

export function CommunityChipPublic({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('story-meta-chip community-chip-public', className)} {...rest}>
      {children}
    </span>
  )
}

export function CommunityChipPrivate({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('story-meta-chip community-chip-private', className)} {...rest}>
      {children}
    </span>
  )
}

export function CommunityBadgeFeatured({ className, children = 'Featured', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('community-badge-featured', className)} {...rest}>
      {children}
    </span>
  )
}

export function CommunityBadgeReported({ className, children = 'Reported by you', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('community-badge-reported', className)} {...rest}>
      {children}
    </span>
  )
}

export function CommunityPillSaved({ className, children = 'Saved', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('community-pill-saved', className)} {...rest}>
      {children}
    </span>
  )
}

export function CommunityChipTopic({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('community-chip-topic', className)} {...rest}>
      {children}
    </span>
  )
}

/** Neutral emphasis chip (e.g. “Your post”) — gold-tinted like public, slightly softer than featured badge. */
export function CommunityChipEmphasis({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('story-meta-chip story-meta-chip-highlight', className)} {...rest}>
      {children}
    </span>
  )
}

type SavedTimestampChipProps = HTMLAttributes<HTMLSpanElement> & { children: ReactNode }

export function CommunityChipSavedTimestamp({ className, children, ...rest }: SavedTimestampChipProps) {
  return (
    <span className={cn('community-summary-chip community-summary-chip-gold text-[0.58rem] font-bold uppercase tracking-[0.1em]', className)} {...rest}>
      {children}
    </span>
  )
}
