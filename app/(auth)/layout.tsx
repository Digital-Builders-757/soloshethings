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
    <div className="flex min-h-screen flex-col bg-[#fffaf0]">
      <Banner />
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
