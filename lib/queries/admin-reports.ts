import 'server-only'

import type { Database, report_status } from '@/types/database'

import { logServerFailure } from '@/lib/server-log'
import { createClient } from '@/lib/supabase/server'

type ReportRow = Database['public']['Tables']['reports']['Row']
type Profile = Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username' | 'full_name'>
type CommunityPost = Pick<
  Database['public']['Tables']['community_posts']['Row'],
  'id' | 'author_id' | 'title' | 'content' | 'is_public' | 'is_featured' | 'status' | 'created_at'
> & {
  author: Profile | null
}

export type ModerationPostReportRow = Pick<
  ReportRow,
  'id' | 'reporter_id' | 'post_id' | 'reason' | 'description' | 'status' | 'admin_notes' | 'created_at' | 'updated_at' | 'reviewed_at' | 'reviewed_by'
> & {
  reporter: Profile | null
  post: CommunityPost | null
}

type RawRow = Pick<
  ReportRow,
  'id' | 'reporter_id' | 'post_id' | 'reason' | 'description' | 'status' | 'admin_notes' | 'created_at' | 'updated_at' | 'reviewed_at' | 'reviewed_by'
> & {
  reporter: Profile | Profile[] | null
  community_posts: CommunityPost | CommunityPost[] | null
}

export async function getModerationPostReports(options?: {
  limit?: number
  statuses?: readonly report_status[]
}): Promise<ModerationPostReportRow[]> {
  const limit = Math.min(Math.max(options?.limit ?? 150, 1), 250)
  const statuses = options?.statuses?.length ? options!.statuses! : undefined

  const supabase = await createClient()
  let qb = supabase
    .from('reports')
    .select(
      `
        id,
        reporter_id,
        post_id,
        reason,
        description,
        status,
        admin_notes,
        reviewed_at,
        reviewed_by,
        created_at,
        updated_at,
        reporter:profiles!reports_reporter_id_fkey (
          id,
          username,
          full_name
        ),
        community_posts:community_posts!reports_post_id_fkey (
          id,
          author_id,
          title,
          content,
          is_public,
          is_featured,
          status,
          created_at,
          author:profiles!community_posts_author_id_fkey (
            id,
            username,
            full_name
          )
        )
      `
    )
    .not('post_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (statuses && statuses.length > 0) {
    qb = qb.in('status', statuses as report_status[])
  }

  const { data, error } = await qb

  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'getModerationPostReports',
      cause: error,
      context: { limit, statusCount: statuses?.length ?? 'all' },
    })
    return []
  }

  return ((data ?? []) as RawRow[]).map((row) => ({
    id: row.id,
    reporter_id: row.reporter_id,
    post_id: row.post_id,
    reason: row.reason,
    description: row.description,
    status: row.status,
    admin_notes: row.admin_notes,
    reviewed_at: row.reviewed_at,
    reviewed_by: row.reviewed_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    reporter: Array.isArray(row.reporter) ? (row.reporter[0] ?? null) : row.reporter,
    post: normalizePost(row.community_posts),
  }))
}

function normalizePost(post: RawRow['community_posts']): CommunityPost | null {
  if (!post) {
    return null
  }

  const base = Array.isArray(post) ? (post[0] ?? null) : post

  if (!base) {
    return null
  }

  const author = Array.isArray(base.author) ? (base.author[0] ?? null) : base.author

  return {
    ...base,
    author,
  }
}
