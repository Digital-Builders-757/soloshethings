'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type RetryPageButtonProps = {
  className?: string
}

/**
 * Prefer soft refresh (new RSC request, bounded repair can run again); full reload still available.
 */
export function RetryPageButton({ className }: RetryPageButtonProps) {
  const router = useRouter()

  return (
    <div className={cn('flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2', className)}>
      <button
        type="button"
        onClick={() => router.refresh()}
        className={cn(
          'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#e34b16]/35 bg-[#fffaf0] px-6 text-sm font-semibold text-[#e34b16] transition hover:bg-[#e34b16]/10 sm:w-auto'
        )}
      >
        Refresh page
      </button>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className={cn(
          'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16] sm:w-auto'
        )}
      >
        Hard reload
      </button>
    </div>
  )
}
