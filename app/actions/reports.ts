'use server'

import { revalidatePath } from 'next/cache'

import { logServerFailure } from '@/lib/server-log'
import { mapSupabaseErrorForUser } from '@/lib/supabase-errors'
import { createClient, getUser } from '@/lib/supabase/server'
import type { report_reason } from '@/types/database'

const REPORT_REASONS: report_reason[] = ['spam', 'harassment', 'inappropriate', 'copyright', 'other']

type CreatePostReportState = {
  error?: string
  success?: boolean
  message?: string
}

function isReportReason(value: string): value is report_reason {
  return REPORT_REASONS.includes(value as report_reason)
}

export async function createPostReport(
  _prevState: CreatePostReportState | null,
  formData: FormData
): Promise<CreatePostReportState> {
  const user = await getUser()

  if (!user) {
    return { error: 'You need to be logged in to report a story.' }
  }

  const postId = `${formData.get('postId') ?? ''}`.trim()
  const path = `${formData.get('path') ?? ''}`.trim() || '/submit'
  const rawReason = `${formData.get('reason') ?? ''}`.trim()
  const description = `${formData.get('description') ?? ''}`.trim()

  if (!postId) {
    return { error: 'Missing story details for this report.' }
  }

  if (!isReportReason(rawReason)) {
    return { error: 'Choose the reason that best matches the problem.' }
  }

  if (description.length > 1000) {
    return { error: 'Keep the extra context under 1,000 characters.' }
  }

  const supabase = await createClient()

  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, author_id, title, is_public, status')
    .eq('id', postId)
    .maybeSingle()

  if (postError) {
    const mapped = mapSupabaseErrorForUser(postError, 'Could not check that story right now. Please try again.')
    logServerFailure({
      category: 'query',
      operation: 'createPostReport.postLookup',
      cause: postError,
      context: { postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  if (!post || post.status !== 'published' || !post.is_public) {
    return { error: 'That story is not available to report from this surface.' }
  }

  if (post.author_id === user.id) {
    return { error: 'You cannot report your own story from this page.' }
  }

  const { data: existingReports, error: existingReportsError } = await supabase
    .from('reports')
    .select('id, status')
    .eq('reporter_id', user.id)
    .eq('post_id', postId)
    .in('status', ['pending', 'reviewed'])
    .limit(1)

  if (existingReportsError) {
    const mapped = mapSupabaseErrorForUser(
      existingReportsError,
      'Could not check your prior reports right now. Please try again.'
    )
    logServerFailure({
      category: 'query',
      operation: 'createPostReport.duplicateCheck',
      cause: existingReportsError,
      context: { postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  if ((existingReports?.length ?? 0) > 0) {
    return { error: 'You already sent a report for this story. Thanks, it is in the queue.' }
  }

  const { error: insertError } = await supabase.from('reports').insert({
    reporter_id: user.id,
    post_id: postId,
    reason: rawReason,
    description: description || null,
  })

  if (insertError) {
    const mapped = mapSupabaseErrorForUser(insertError, 'Could not send your report right now. Please try again.')
    logServerFailure({
      category: 'mutation',
      operation: 'createPostReport.insert',
      cause: insertError,
      context: { postId, ...(mapped.devHint ? { devHint: mapped.devHint } : {}) },
    })
    return { error: mapped.userMessage }
  }

  revalidatePath(path)

  return {
    success: true,
    message: `Thanks. Your report for “${post.title}” is now in the moderation queue.`,
  }
}
