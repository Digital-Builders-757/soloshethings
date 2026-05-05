/**
 * Profile Page
 *
 * MVP: Minimal editable profile
 */

import { ProfileErrorFallback } from '@/components/profile/profile-error-fallback'
import { ProfileForm } from '@/components/profile/profile-form'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfileWithBoundedRepair(user.id, user.email)

  if (!profile) {
    return <ProfileErrorFallback context="profile" />
  }

  return <ProfileForm profile={profile} />
}
