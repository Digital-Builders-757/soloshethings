import Link from 'next/link'

import { cn } from '@/lib/utils'
import type {
  EmptyStateActionLink,
  EmptyStateActionVariant,
  EmptyStateProps,
  EmptyStateVariant,
} from '@/types/ui-primitives'

const variantShell: Record<EmptyStateVariant, string> = {
  editorial: 'editorial-card p-6 sm:p-8',
  community:
    'rounded-[1.5rem] border border-brand-pinkDark/12 bg-brand-cream/25 p-6 sm:p-8',
  blog: 'py-16 text-center',
  inline:
    'rounded-[1.35rem] border border-brand-pinkDark/12 bg-brand-cream/30 p-5 sm:p-6',
}

const titleClassByVariant: Record<EmptyStateVariant, string> = {
  editorial: 'font-serif text-2xl font-semibold text-brand-pinkDark',
  community: 'font-serif text-2xl font-semibold text-brand-pinkDark sm:text-3xl',
  blog: 'font-serif text-2xl font-semibold text-brand-pinkDark',
  inline: 'font-serif text-lg font-semibold text-brand-pinkDark',
}

const descriptionClassByVariant: Record<EmptyStateVariant, string> = {
  editorial: 'mt-3 max-w-2xl text-sm leading-7 text-brand-blue/85 sm:text-base',
  community: 'mt-3 max-w-2xl text-sm leading-relaxed text-brand-blue/85 sm:text-base',
  blog: 'mt-3 text-sm leading-relaxed text-brand-blue/85 sm:text-base',
  inline: 'mt-2 text-sm leading-relaxed text-brand-blue/85',
}

function actionClassName(variant: EmptyStateActionVariant = 'link'): string {
  switch (variant) {
    case 'primary':
      return 'cta-primary inline-flex min-h-11 items-center justify-center px-6 text-sm sm:min-h-12'
    case 'secondary':
      return 'cta-secondary inline-flex min-h-11 items-center justify-center px-6 text-sm sm:min-h-12'
    case 'link':
    default:
      return 'inline-flex text-sm font-semibold text-brand-orange transition hover:text-brand-coral'
  }
}

function EmptyStateAction({ action }: { action: EmptyStateActionLink }) {
  const { label, href, variant = 'link', className } = action

  return (
    <Link href={href} className={cn(actionClassName(variant), className)}>
      {label}
    </Link>
  )
}

function EmptyStateActions({
  primaryAction,
  secondaryAction,
  extraActions,
  variant,
}: Pick<EmptyStateProps, 'primaryAction' | 'secondaryAction' | 'extraActions' | 'variant'>) {
  const actionsMt = variant === 'inline' ? 'mt-5' : variant === 'blog' ? 'mt-8' : 'mt-6'

  return (
    <div
      className={cn(
        actionsMt,
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center',
        variant === 'blog' && 'justify-center',
      )}
    >
      <EmptyStateAction action={primaryAction} />
      {secondaryAction ? <EmptyStateAction action={secondaryAction} /> : null}
      {extraActions?.map((action) => (
        <EmptyStateAction key={`${action.href}-${action.label}`} action={action} />
      ))}
    </div>
  )
}

/**
 * Reusable empty-state panel: optional icon/eyebrow, title, description, and actions.
 * Uses shared editorial surfaces and CTA classes from `globals.css`.
 */
export function EmptyState({
  icon,
  eyebrow,
  useCommunitySectionLabel = false,
  title,
  description,
  primaryAction,
  secondaryAction,
  extraActions,
  variant = 'editorial',
  className,
  id,
  ariaLive,
}: EmptyStateProps) {
  const titleId = id ? `${id}-title` : undefined
  const descriptionId = id ? `${id}-description` : undefined
  const isBlog = variant === 'blog'

  const content = (
    <>
      {icon ? (
        <div className={cn('flex justify-center', isBlog ? 'mb-6' : 'mb-4')} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      {eyebrow ? (
        <p
          className={cn(
            useCommunitySectionLabel
              ? 'community-section-label text-[0.65rem]'
              : 'eyebrow text-[0.65rem] tracking-[0.22em]',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 id={titleId} className={cn(eyebrow && 'mt-2', titleClassByVariant[variant])}>
        {title}
      </h2>
      <p id={descriptionId} className={descriptionClassByVariant[variant]}>
        {description}
      </p>
      <EmptyStateActions
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        extraActions={extraActions}
        variant={variant}
      />
    </>
  )

  return (
    <section
      id={id}
      className={cn(variantShell[variant], className)}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...(ariaLive ? { 'aria-live': ariaLive } : {})}
    >
      {isBlog ? <div className="mx-auto max-w-md">{content}</div> : content}
    </section>
  )
}
