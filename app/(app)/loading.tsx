import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 overflow-x-clip section-y shell-inline">
      <Skeleton className="h-36 w-full max-w-3xl rounded-[1.75rem]" />
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-3">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-28 min-h-[7rem] rounded-2xl" />
            <Skeleton className="h-28 min-h-[7rem] rounded-2xl" />
            <Skeleton className="h-28 min-h-[7rem] rounded-2xl sm:col-span-2" />
          </div>
        </div>
        <Skeleton className="hidden min-h-[16rem] rounded-[1.25rem] lg:block" />
      </div>
    </div>
  )
}
