import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type LoadingStateVariant = 'auth' | 'app' | 'inline'

export interface LoadingStateProps {
  /** Skeleton layout preset. @default 'inline' */
  variant?: LoadingStateVariant
  /** Accessible status message (visible for inline, sr-only for skeleton variants). */
  label?: string
  className?: string
}

const defaultLabels: Record<LoadingStateVariant, string> = {
  auth: 'Loading sign-in form…',
  app: 'Loading workspace…',
  inline: 'Loading…',
}

/**
 * Shared loading presentation for route segments and Suspense fallbacks.
 * Composes {@link Skeleton} — no new animation system.
 */
export function LoadingState({ variant = 'inline', label, className }: LoadingStateProps) {
  const message = label ?? defaultLabels[variant]

  if (variant === 'auth') {
    return (
      <main
        className={cn(
          'flex flex-1 items-center justify-center overflow-x-clip px-4 py-10 sm:px-6 sm:py-12',
          className,
        )}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#efdac1]/80 bg-white/90 p-7 shadow-sm sm:p-8">
          <p className="sr-only">{message}</p>
          <Skeleton className="mx-auto h-6 w-3/4 max-w-[12rem] rounded-md" aria-hidden />
          <Skeleton className="h-12 w-full rounded-2xl" aria-hidden />
          <Skeleton className="h-12 w-full rounded-2xl" aria-hidden />
          <Skeleton className="h-11 w-full rounded-full" aria-hidden />
        </div>
      </main>
    )
  }

  if (variant === 'app') {
    return (
      <div
        className={cn(
          'section-y shell-inline mx-auto w-full min-w-0 max-w-6xl space-y-6 overflow-x-clip',
          className,
        )}
        aria-busy="true"
        aria-live="polite"
      >
        <p className="sr-only">{message}</p>
        <Skeleton className="h-36 w-full max-w-3xl rounded-[1.75rem]" aria-hidden />
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0 space-y-3">
            <Skeleton className="h-8 w-40 rounded-lg" aria-hidden />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-28 min-h-[7rem] rounded-2xl" aria-hidden />
              <Skeleton className="h-28 min-h-[7rem] rounded-2xl" aria-hidden />
              <Skeleton className="h-28 min-h-[7rem] rounded-2xl sm:col-span-2" aria-hidden />
            </div>
          </div>
          <Skeleton className="hidden min-h-[16rem] rounded-[1.25rem] lg:block" aria-hidden />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-1 items-center justify-center overflow-x-clip px-4 py-16', className)}
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-[#6d5849]">{message}</p>
    </div>
  )
}
