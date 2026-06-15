import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface ErrorRecoveryCardProps {
  title: ReactNode
  description: ReactNode
  /** Optional reference id surfaced for support. */
  digest?: string
  /** Recovery actions (buttons/links). */
  children: ReactNode
  /** Optional content between title and description (e.g. signed-in email). */
  supplementary?: ReactNode
  id?: string
  className?: string
}

/**
 * Shared error/recovery panel for route errors and profile repair fallbacks.
 */
export function ErrorRecoveryCard({
  title,
  description,
  digest,
  children,
  supplementary,
  id = 'error-recovery',
  className,
}: ErrorRecoveryCardProps) {
  const titleId = `${id}-title`

  return (
    <div className={cn('mx-auto w-full max-w-lg shell-inline py-10 sm:py-14', className)}>
      <div
        className="surface-card rounded-[1.5rem] px-5 py-9 text-center sm:px-8 sm:py-11"
        role="alert"
        aria-labelledby={titleId}
      >
        <h1 id={titleId} className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl">
          {title}
        </h1>
        {supplementary}
        <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</div>
        {digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: <span className="select-all">{digest}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
