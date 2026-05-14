import type { Database, report_reason, report_status } from '@/types/database'

import { createClient } from '@/lib/supabase/server'

type ReportRow = Database['public']['Tables']['reports']['Row']
type CommunityPost = Pick<
  Database['public']['Tables']['community_posts']['Row'],
  'id' | 'author_id' | 'title' | 'is_public' | 'is_featured' | 'status' | 'created_at'
>

type ReportRowWithPost = Pick<ReportRow, 'id' | 'post_id' | 'reason' | 'description' | 'status' | 'admin_notes' | 'created_at' | 'updated_at'> & {
  community_posts: CommunityPost | CommunityPost[] | null
}

export type MemberPostReport = Pick<
  ReportRow,
  'id' | 'post_id' | 'reason' | 'description' | 'status' | 'admin_notes' | 'created_at' | 'updated_at'
> & {
  post: CommunityPost | null
}

export const REPORT_REASON_LABELS: Record<report_reason, string> = {
  spam: 'Spam or scammy promotion',
  harassment: 'Harassment or bullying',
  inappropriate: 'Unsafe, explicit, or inappropriate content',
  copyright: 'Copyright issue',
  other: 'Something else',
}

export const REPORT_STATUS_LABELS: Record<report_status, string> = {
  pending: 'Pending review',
  reviewed: 'Under review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

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
        community_posts:community_posts!reports_post_id_fkey (
          id,
          author_id,
          title,
          is_public,
          is_featured,
          status,
          created_at
        )
      `
    )
    .eq('reporter_id', userId)
    .not('post_id', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch member post reports:', error)
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
    post: Array.isArray(report.community_posts) ? (report.community_posts[0] ?? null) : report.community_posts,
  }))
}
