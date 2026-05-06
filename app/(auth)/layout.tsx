/**
 * Auth Layout
 *
 * Login, signup, password reset routes — aligned with public brand shell
 */

import { Banner } from "@/components/layout/Banner"
import { SiteHeader } from "@/components/layout/SiteHeader"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-[#fffaf0]">
      <Banner />
      <SiteHeader />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip shell-pb-safe">{children}</div>
    </div>
  )
}
