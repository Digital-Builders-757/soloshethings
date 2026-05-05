/**
 * Authenticated App Layout
 *
 * Routes in this group require authentication (middleware + server checks).
 * Shared shell: banner, header, and a dedicated main region for dashboard-style pages.
 */

import { Banner } from "@/components/layout/Banner"
import { SiteHeader } from "@/components/layout/SiteHeader"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0]">
      <Banner />
      <SiteHeader />
      <main
        id="app-main"
        className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      >
        {children}
      </main>
    </div>
  )
}
