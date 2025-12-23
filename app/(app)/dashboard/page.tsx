/**
 * Dashboard Page
 *
 * Authenticated user dashboard
 * Phase 1: Basic welcome page
 * Phase 3: Full dashboard with feed, quick actions, etc.
 */

import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to SoloSHEThings!</h1>
        <p className="text-xl text-neutral-600 mb-8">
          You're successfully logged in as {user.email}
        </p>

        <div className="surface-card rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Coming Soon</h2>
          <p className="text-neutral-700 mb-4">
            Phase 1 (Backend Foundation) is complete! The full dashboard with community feed,
            quick actions, and personalized content will be built in Phase 3.
          </p>
          <p className="text-neutral-700">
            For now, you can explore the navigation menu to see what's available.
          </p>
        </div>
      </div>
    </main>
  );
}
