import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="shell-inline py-8 sm:py-10">
      <div className="mx-auto min-w-0 max-w-2xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <div className="surface-card space-y-5 rounded-[1.25rem] p-6 sm:p-8">
          <Skeleton className="h-8 w-48 max-w-full rounded-lg" />
          <Skeleton className="h-4 w-full max-w-md rounded-md" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 min-h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 min-h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
