/**
 * Authenticated App Layout
 * 
 * Routes in this group require authentication.
 * Middleware handles auth checks.
 */

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/queries/profiles"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const profile = await getProfile(user.id)

  const userData = {
    email: user.email || "",
    full_name: profile?.full_name || null,
    avatar_url: profile?.avatar_url || null,
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile Navigation */}
      <MobileNav user={userData} />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <DashboardSidebar user={userData} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-6 px-4 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
