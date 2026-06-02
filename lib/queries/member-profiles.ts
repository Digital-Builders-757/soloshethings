/**
 * Public member profile queries — /members/[username]
 *
 * MUST use resolve_member_profile RPC for gate states (auth_required, private, not_found).
 * MUST follow: docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md
 */

import 'server-only'

import {
  parseMemberProfileResolveResult,
  type MemberProfileResolveResult,
} from '@/lib/profile/member-profile-types'
import { logServerFailure } from '@/lib/server-log'
import { createClient } from '@/lib/supabase/server'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

function normalizeUsername(raw: string): string | null {
  const normalized = raw.trim().toLowerCase()
  if (normalized.length === 0 || !USERNAME_PATTERN.test(normalized)) {
    return null
  }
  return normalized
}

/**
 * Resolve a member profile for the public /members/[username] route.
 */
export async function resolveMemberProfile(rawUsername: string): Promise<MemberProfileResolveResult> {
  const username = normalizeUsername(rawUsername)

  if (!username) {
    return { status: 'not_found' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('resolve_member_profile', {
    p_username: username,
  })

  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'resolveMemberProfile.rpc',
      cause: error,
      context: { username },
    })
    return { status: 'error' }
  }

  const parsed = parseMemberProfileResolveResult(data)

  if (!parsed) {
    logServerFailure({
      category: 'query',
      operation: 'resolveMemberProfile.parse',
      cause: new Error('invalid_rpc_response_shape'),
      context: { username },
    })
    return { status: 'error' }
  }

  return parsed
}
