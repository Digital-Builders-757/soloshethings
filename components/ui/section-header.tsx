'use client'

import type { ElementType } from 'react'

import { cn } from '@/lib/utils'
import type { SectionHeaderProps, SectionHeaderSize, SectionHeaderTone } from '@/types/ui-primitives'

const sizeConfig: Record<
  SectionHeaderSize,
  { heading: ElementType; headingClass: string }
> = {
  page: {
    heading: 'h1',
    headingClass:
      'mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl',
  },
  section: {
    heading: 'h2',
    headingClass: 'mt-2 font-serif text-2xl font-semibold sm:text-3xl',
  },
  compact: {
    heading: 'h3',
    headingClass: 'mt-2 font-serif text-xl font-semibold sm:text-2xl',
  },
}

const toneConfig: Record<
  SectionHeaderTone,
  { title: string; description: string; eyebrowClass: string }
> = {
  warm: {
    title: 'text-brand-pinkDark',
    description: 'mt-3 max-w-3xl text-sm leading-7 text-brand-blue/85 sm:text-base',
    eyebrowClass: 'eyebrow text-[0.65rem] tracking-[0.22em]',
  },
  community: {
    title: 'text-brand-pinkDark',
    description: 'mt-4 max-w-3xl text-sm leading-relaxed text-brand-blue/85 sm:text-base',
    eyebrowClass: 'eyebrow text-[0.65rem] tracking-[0.22em]',
  },
  blog: {
    title: 'text-balance break-words text-brand-orange',
    description: 'mt-4 max-w-3xl text-sm leading-relaxed text-brand-blue/85 sm:text-base',
    eyebrowClass: 'eyebrow text-[0.65rem] tracking-[0.22em]',
  },
}

/**
 * Reusable section header: eyebrow, title, description, and optional actions slot.
 * Composes existing `.eyebrow` and brand typography — no new color system.
 *
 * @example Dashboard module
 * ```tsx
 * <SectionHeader size="compact" title="Profile readiness" description="..." />
 * ```
 *
 * @example Community page hero (inside existing shell)
 * ```tsx
 * <SectionHeader
 *   as="header"
 *   eyebrow="Community feed"
 *   title="Browse member stories"
 *   description="..."
 * />
 * ```
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  size = 'page',
  tone = 'warm',
  className,
  id,
  as: Wrapper = 'div',
}: SectionHeaderProps) {
  const { heading: Heading, headingClass } = sizeConfig[size]
  const toneStyles = toneConfig[tone]
  const titleId = id ? `${id}-title` : undefined
  const descriptionId = id && description ? `${id}-description` : undefined
  const hasActions = Boolean(actions)

  return (
    <Wrapper
      id={id}
      className={cn(hasActions && 'flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between', className)}
      {...(Wrapper === 'header' ? {} : { role: 'group' })}
      {...(titleId ? { 'aria-labelledby': titleId } : {})}
      {...(descriptionId ? { 'aria-describedby': descriptionId } : {})}
    >
      <div className={cn(hasActions && 'min-w-0 flex-1')}>
        {eyebrow ? (
          <p className={toneStyles.eyebrowClass}>{eyebrow}</p>
        ) : null}
        <Heading id={titleId} className={cn(headingClass, toneStyles.title)}>
          {title}
        </Heading>
        {description ? (
          <p id={descriptionId} className={toneStyles.description}>
            {description}
          </p>
        ) : null}
      </div>
      {hasActions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </Wrapper>
  )
}
