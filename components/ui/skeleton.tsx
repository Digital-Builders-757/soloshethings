import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Loading placeholder — pulse animation for perceived performance (route `loading.tsx` segments).
 */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-md bg-muted motion-safe:animate-pulse-soft", className)}
      {...props}
    />
  )
}

export { Skeleton }
