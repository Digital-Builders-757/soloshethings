import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { user_role } from '@/types/database'

export async function getProfileRole(userId: string): Promise<user_role | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()

  if (error || !data) {
    return null
  }

  return data.role
}

export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const role = await getProfileRole(userId)
  return role === 'admin'
}
