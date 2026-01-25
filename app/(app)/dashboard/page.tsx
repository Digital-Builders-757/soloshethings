/**
 * Dashboard Page
 *
 * Authenticated user dashboard
 * MVP: Basic welcome page with profile info
 * Phase 3: Full dashboard with feed, quick actions, etc.
 */

import { getUser } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/queries/profiles'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile (with bounded repair if needed)
  let profile = await getCurrentUserProfile()

  if (!profile) {
    // Profile missing - attempt repair (bounded, max 1 retry)
    const { generateUsername } = await import('@/lib/auth-utils')
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: generateUsername(user.email || 'user'),
          role: 'talent',
          privacy_level: 'public',
        })
        .select('id, username, full_name, bio, avatar_url, role, privacy_level, created_at, updated_at')
        .single()

      if (error || !data) {
        // Repair failed - show error state, don't redirect (prevent loop)
        return (
          <main className="min-h-screen px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="surface-card rounded-xl p-8 text-center">
                <h1 className="text-2xl font-semibold mb-4 text-red-600">Profile Error</h1>
                <p className="text-neutral-700 mb-4">
                  Your profile could not be loaded. Please contact support.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-brand-blue1 text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-blue2 transition-all"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </main>
        )
      }
      
      profile = data
    } catch (error) {
      console.error('Profile repair failed:', error)
      return (
        <main className="min-h-screen px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="surface-card rounded-xl p-8 text-center">
              <h1 className="text-2xl font-semibold mb-4 text-red-600">Profile Error</h1>
              <p className="text-neutral-700 mb-4">
                Your profile could not be loaded. Please contact support.
              </p>
              <Link
                href="/login"
                className="inline-block bg-brand-blue1 text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-blue2 transition-all"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </main>
      )
    }
  }

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to SoloSHEThings!</h1>
        <p className="text-xl text-neutral-600 mb-8">
          You&apos;re successfully logged in as {user.email}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <div className="surface-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-2">
              <p className="text-neutral-700">
                <span className="font-medium">Username:</span> {profile.username}
              </p>
              {profile.full_name && (
                <p className="text-neutral-700">
                  <span className="font-medium">Name:</span> {profile.full_name}
                </p>
              )}
              {profile.bio && (
                <p className="text-neutral-700">
                  <span className="font-medium">Bio:</span> {profile.bio}
                </p>
              )}
            </div>
            <Link
              href="/profile"
              className="inline-block mt-4 text-brand-blue1 hover:text-brand-blue2 font-medium"
            >
              Edit Profile →
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="surface-card rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/profile"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-brand-blue1/5 transition-colors text-neutral-700 hover:text-brand-blue1"
              >
                ✏️ Edit Profile
              </Link>
              <Link
                href="/blog"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-brand-blue1/5 transition-colors text-neutral-700 hover:text-brand-blue1"
              >
                📖 Read Blog
              </Link>
              <Link
                href="/collections"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-brand-blue1/5 transition-colors text-neutral-700 hover:text-brand-blue1"
              >
                🗺️ Browse Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="surface-card rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Coming Soon</h2>
          <p className="text-neutral-700 mb-4">
            Phase 1 (Backend Foundation) is complete! The full dashboard with community feed,
            quick actions, and personalized content will be built in Phase 3.
          </p>
          <p className="text-neutral-700">
            For now, you can explore the navigation menu to see what&apos;s available.
          </p>
        </div>
      </div>
    </main>
  );
}
