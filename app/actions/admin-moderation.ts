'use server'

import { revalidatePath } from 'next/cache'

import { isPlatformAdmin } from '@/lib/auth/platform-admin'
import { logServerFailure } from '@/lib/server-log'
import { mapSupabaseErrorForUser } from '@/lib/supabase-errors'
import { createClient, getUser } from '@/lib/supabase/server'
import type { report_status } from '@/types/database'

export type ModerationReportActionState = {
  error?: string
  success?: boolean
}

const STATUS_SET = new Set<report_status>(['pending', 'reviewed', 'resolved', 'dismissed'])

function requireStatus(raw: unknown): report_status | null {
  if (typeof raw !== 'string' || !STATUS_SET.has(raw as report_status)) {
    return null
  }
  return raw as report_status
}

export async function moderateCommunityReportAction(
  _prev: ModerationReportActionState | null,
  formData: FormData
): Promise<ModerationReportActionState> {
  const user = await getUser()
  if (!user) {
    return { error: 'You must be signed in.' }
  }

  if (!(await isPlatformAdmin(user.id))) {
    return { error: 'You do not have access to moderation tools.' }
  }

  const reportId = `${formData.get('reportId') ?? ''}`.trim()
  const status = requireStatus(formData.get('status'))
  const notesRaw = `${formData.get('adminNotes') ?? ''}`.trim()
  const path = `${formData.get('path') ?? '/admin/moderation'}`.trim() || '/admin/moderation'

  if (!reportId) {
    return { error: 'Missing report id.' }
  }
  if (!status) {
    return { error: 'Pick a moderation status.' }
  }
  if (notesRaw.length > 2000) {
    return { error: 'Moderator notes must be 2,000 characters or fewer.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.rpc('moderator_update_report', {
    p_report_id: reportId,
    p_status: status,
    p_admin_notes: notesRaw === '' ? null : notesRaw,
  })

  if (error) {
    const mapped = mapSupabaseErrorForUser(error, 'Could not update that report yet. Please retry.')
    logServerFailure({
      category: 'mutation',
      operation: 'moderateCommunityReportAction',
      cause: error,
      context: { reportId },
    })
    return { error: mapped.userMessage }
  }

  revalidatePath('/admin/moderation')
  revalidatePath('/reports')
  revalidatePath('/places')
  revalidatePath(path)

  return { success: true }
}
