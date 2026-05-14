import 'server-only'

import type { Database } from '@/types/database'

export { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '@/lib/constants/report-labels'
import { logServerFailure } from '@/lib/server-log'
import { createClient } from '@/lib/supabase/server'

type ReportRow = Database['public']['Tables']['reports']['Row']
type Profile = Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username' | 'full_name'>
type CommunityPost = Pick<
  Database['public']['Tables']['community_posts']['Row'],
  'id' | 'author_id' | 'title' | 'is_public' | 'is_featured' | 'status' | 'created_at'
> & {
  author: Profile | null
}

type ReportRowWithPost = Pick<
  ReportRow,
  | 'id'
  | 'post_id'
  | 'reason'
  | 'description'
  | 'status'
  | 'admin_notes'
  | 'created_at'
  | 'updated_at'
  | 'reviewed_at'
> & {
  community_posts: CommunityPost | CommunityPost[] | null
}

export type MemberPostReport = Pick<
  ReportRow,
  | 'id'
  | 'post_id'
  | 'reason'
  | 'description'
  | 'status'
  | 'admin_notes'
  | 'created_at'
  | 'updated_at'
  | 'reviewed_at'
> & {
  post: CommunityPost | null
}

export type MemberPostReportSummary = Pick<
  ReportRow,
  'id' | 'post_id' | 'reason' | 'status' | 'created_at' | 'updated_at'
>

export async function getMemberPostReports(userId: string): Promise<MemberPostReport[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reports')
    .select(
      `
        id,
        post_id,
        reason,
        description,
        status,
        admin_notes,
        created_at,
        updated_at,
        reviewed_at,
        community_posts:community_posts!reports_post_id_fkey (
          id,
          author_id,
          title,
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
    .eq('reporter_id', userId)
    .not('post_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'getMemberPostReports',
      cause: error,
      context: { userId },
    })
    return []
  }

  return ((data ?? []) as ReportRowWithPost[]).map((report) => ({
    id: report.id,
    post_id: report.post_id,
    reason: report.reason,
    description: report.description,
    status: report.status,
    admin_notes: report.admin_notes,
    created_at: report.created_at,
    updated_at: report.updated_at,
    reviewed_at: report.reviewed_at,
    post: Array.isArray(report.community_posts) ? (report.community_posts[0] ?? null) : report.community_posts,
  }))
}

export async function getLatestMemberPostReportsForPosts(
  userId: string,
  postIds: string[]
): Promise<Map<string, MemberPostReportSummary>> {
  if (postIds.length === 0) {
    return new Map()
  }

  const uniquePostIds = Array.from(new Set(postIds))
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reports')
    .select('id, post_id, reason, status, created_at, updated_at')
    .eq('reporter_id', userId)
    .in('post_id', uniquePostIds)
    .order('created_at', { ascending: false })

  if (error) {
    logServerFailure({
      category: 'query',
      operation: 'getLatestMemberPostReportsForPosts',
      cause: error,
      context: { userId, postIdCount: uniquePostIds.length },
    })
    return new Map()
  }

  const latestByPostId = new Map<string, MemberPostReportSummary>()

  for (const report of (data ?? []) as MemberPostReportSummary[]) {
    if (!report.post_id || latestByPostId.has(report.post_id)) {
      continue
    }

    latestByPostId.set(report.post_id, report)
  }

  return latestByPostId
}
