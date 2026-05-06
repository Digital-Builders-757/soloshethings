import { Skeleton } from "@/components/ui/skeleton"

/**
 * Instant feedback while public (marketing) routes resolve — avoids blank first paint.
 */
export default function PublicLoading() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-8 overflow-x-clip section-y shell-inline">
      <div className="space-y-3">
        <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 min-h-[11rem] rounded-2xl sm:h-52" />
        ))}
      </div>
    </div>
  )
}
