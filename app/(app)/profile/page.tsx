/**
 * Profile Page
 *
 * MVP: Minimal editable profile
 * Users can update username, full name, and bio
 */

import { getUser } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/queries/profiles'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getCurrentUserProfile()

  if (!profile) {
    // Profile missing - attempt repair (bounded)
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
        return (
          <main className="min-h-screen px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="surface-card rounded-xl p-8 text-center">
                <h1 className="text-2xl font-semibold mb-4 text-red-600">Profile Error</h1>
                <p className="text-neutral-700 mb-4">
                  Your profile could not be loaded. Please contact support.
                </p>
                <a
                  href="/dashboard"
                  className="inline-block bg-brand-coral text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-coral/90 transition-all"
                >
                  Return to Dashboard
                </a>
              </div>
            </div>
          </main>
        )
      }
      
      return <ProfileForm profile={data} />
    } catch (error) {
      console.error('Profile repair failed:', error)
      return (
        <main className="min-h-screen px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="surface-card rounded-xl p-8 text-center">
              <h1 className="text-2xl font-semibold mb-4 text-red-600">Profile Error</h1>
              <p className="text-neutral-700 mb-4">
                Your profile could not be loaded. Please contact support.
              </p>
              <a
                href="/dashboard"
                className="inline-block bg-brand-coral text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-coral/90 transition-all"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </main>
      )
    }
  }

  return <ProfileForm profile={profile} />
}

