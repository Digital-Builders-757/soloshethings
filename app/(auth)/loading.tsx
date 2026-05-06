import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <main className="flex flex-1 items-center justify-center overflow-x-clip px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#efdac1]/80 bg-white/90 p-7 shadow-sm sm:p-8">
        <Skeleton className="mx-auto h-6 w-3/4 max-w-[12rem] rounded-md" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </main>
  )
}
