/**
 * Free-tier community story reads: max 3 distinct stories per UTC day (excluding own stories).
 */
import 'server-only'

import { getMembershipTier } from '@/lib/billing/entitlements'
import { createClient } from '@/lib/supabase/server'

const FREE_TIER_STORIES_PER_DAY = 3

function utcCalendarDay(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export async function ensureCommunityStoryReadAllowed(params: {
  readerId: string
  authorId: string
  postId: string
}): Promise<{ ok: true } | { ok: false; reason: 'read_cap' }> {
  const { readerId, authorId, postId } = params

  if (readerId === authorId) {
    return { ok: true }
  }

  const tier = await getMembershipTier(readerId)
  if (tier === 'full') {
    return { ok: true }
  }

  const supabase = await createClient()
  const readDay = utcCalendarDay()

  const { data: alreadyToday } = await supabase
    .from('community_post_reads')
    .select('id')
    .eq('user_id', readerId)
    .eq('community_post_id', postId)
    .eq('read_day', readDay)
    .maybeSingle()

  if (alreadyToday) {
    return { ok: true }
  }

  const { count, error: countErr } = await supabase
    .from('community_post_reads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', readerId)
    .eq('read_day', readDay)

  if (countErr || (count ?? 0) >= FREE_TIER_STORIES_PER_DAY) {
    return { ok: false, reason: 'read_cap' }
  }

  const { error: insertErr } = await supabase.from('community_post_reads').insert({
    user_id: readerId,
    community_post_id: postId,
    read_day: readDay,
  })

  if (insertErr) {
    return { ok: false, reason: 'read_cap' }
  }

  return { ok: true }
}
