import { Skeleton } from '@/components/ui/skeleton'

export default function MemberProfileLoading() {
  return (
    <div className="profile-page-stage shell-inline shell-pb-safe pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="profile-page-inner mx-auto min-w-0 max-w-3xl space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-3 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-3 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-px w-full rounded-none" />

        <div className="rounded-[1.5rem] border border-[#c8a882]/15 p-6 sm:p-7">
          <Skeleton className="mb-5 h-4 w-20 rounded-md" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#fab642]/15 p-6 sm:p-7">
          <Skeleton className="mb-6 h-4 w-32 rounded-md" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="mt-6 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
