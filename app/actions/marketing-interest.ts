'use server'

import { logServerFailure } from '@/lib/server-log'
import { mapSupabaseErrorForUser } from '@/lib/supabase-errors'
import { createServiceRoleClient } from '@/lib/supabase/server'

/** Max RFC-friendly local+domain length commonly enforced by providers */
const EMAIL_MAX = 254

export type MarketingInterestFormState =
  | null
  | { error: string }
  | { success: string }

function parseEmail(formData: FormData): string | null {
  const raw = `${formData.get('email') ?? ''}`.trim()
  if (!raw || raw.length > EMAIL_MAX) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return null
  return raw
}

function parseSource(formData: FormData): string {
  const s = `${formData.get('source') ?? ''}`.trim()
  if (s.length < 2 || s.length > 110) return 'homepage_newsletter'
  return s.replace(/\s+/g, '_').slice(0, 110)
}

/**
 * Store a mailing-list-style interest submission in `marketing_interest`.
 * Requires `SUPABASE_SERVICE_ROLE_KEY` — no transactional email is sent here.
 */
export async function submitMarketingInterest(
  _prev: MarketingInterestFormState,
  formData: FormData
): Promise<MarketingInterestFormState> {
  const email = parseEmail(formData)
  const source = parseSource(formData)

  if (!email) {
    return {
      error: 'Please enter a valid email address.',
    }
  }

  let sb
  try {
    sb = createServiceRoleClient()
  } catch (cause) {
    logServerFailure({
      category: 'unknown',
      operation: 'submitMarketingInterest',
      cause,
    })
    return {
      error:
        'Saving your email is not available right now because this environment is missing server credentials. Contact us instead, or sign up — your account email is usable for SoloSheThings access.',
    }
  }

  const normalized = email.toLowerCase().trim()
  const nowIso = new Date().toISOString()

  const { error: insertError } = await sb.from('marketing_interest').insert({
    email,
    source,
    last_submitted_at: nowIso,
  })

  if (insertError?.code === '23505') {
    const { error: updateError } = await sb
      .from('marketing_interest')
      .update({
        source,
        last_submitted_at: nowIso,
      })
      .eq('email_normalized', normalized)

    if (updateError) {
      logServerFailure({
        category: 'mutation',
        operation: 'submitMarketingInterest.updateDuplicate',
        cause: updateError,
        context: { source },
      })
      const { userMessage } = mapSupabaseErrorForUser(updateError, 'We could not update your submission. Try again in a minute.')
      return { error: userMessage }
    }
  } else if (insertError) {
    logServerFailure({
      category: 'mutation',
      operation: 'submitMarketingInterest.insert',
      cause: insertError,
      context: { source },
    })
    const { userMessage } = mapSupabaseErrorForUser(insertError, 'Something went wrong while saving your email. Try again.')
    return { error: userMessage }
  }

  return {
    success:
      'Thanks — your email was saved so we know you’re interested in SoloSheThings updates. We’re not sending marketing email from here yet (no newsletters or broadcasts are automated until we wire a provider); this is manual follow-up territory for now.',
  }
}
