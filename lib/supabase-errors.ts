/**
 * Map Supabase Postgrest / storage errors to safe user copy and dev hints (hints are for logging only).
 */
import type { PostgrestError } from '@supabase/supabase-js'

export type MappedSupabaseError = {
  userMessage: string
  /** For logs/Sentry tags only — never show in UI */
  devHint?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPostgrestError(error: unknown): error is PostgrestError {
  if (!isRecord(error)) return false
  return typeof error.message === 'string' && typeof error.code === 'string'
}

function messageLower(error: unknown): string {
  if (error instanceof Error) return error.message.toLowerCase()
  if (isPostgrestError(error)) return error.message.toLowerCase()
  return ''
}

/**
 * Returns a calm, user-safe message and an optional dev-only classification.
 */
export function mapSupabaseErrorForUser(error: unknown, fallbackUserMessage: string): MappedSupabaseError {
  const msg = messageLower(error)

  if (isPostgrestError(error)) {
    const code = error.code

    if (code === '23505') {
      return {
        userMessage:
          'That information conflicts with an existing record. If you were setting a username, try another one.',
        devHint: 'unique_violation',
      }
    }

    if (code === '23503') {
      return {
        userMessage:
          'We could not link your profile to your account. Please try again in a moment, or contact support if this continues.',
        devHint: 'profiles_fk_parent_missing',
      }
    }

    if (code === '42703') {
      return {
        userMessage:
          'Something is out of sync on our side. Please try again shortly. If this continues, contact support.',
        devHint: 'schema_column_or_object_missing',
      }
    }

    if (code === '42501' || msg.includes('permission denied') || msg.includes('row-level security')) {
      return {
        userMessage: 'You do not have permission to do that. If you are signed in, try signing out and back in.',
        devHint: 'rls_or_privilege',
      }
    }

    if (code === 'PGRST205') {
      return {
        userMessage:
          process.env.NODE_ENV === 'development'
            ? 'Database schema is missing a required table. Apply Supabase migrations for this project (see server logs).'
            : 'Something is misconfigured on our side. Please try again later.',
        devHint: 'schema_table_missing',
      }
    }

    if (code === 'PGRST116' || msg.includes('cannot coerce the result to a single json object')) {
      return {
        userMessage: 'We could not find that record, or it is no longer available.',
        devHint: 'not_found',
      }
    }
  }

  if (
    msg.includes('jwt') ||
    msg.includes('session') ||
    msg.includes('not authenticated') ||
    msg.includes('invalid token')
  ) {
    return {
      userMessage: 'Your session expired or is invalid. Please sign in again.',
      devHint: 'auth_session',
    }
  }

  if (msg.includes('storage') && (msg.includes('object') || msg.includes('bucket') || msg.includes('upload'))) {
    return {
      userMessage: 'We could not process your file upload. Check size and format, then try again.',
      devHint: 'storage',
    }
  }

  if (msg.includes('network') || msg.includes('fetch failed') || msg.includes('econnreset')) {
    return {
      userMessage: 'A network issue occurred. Please check your connection and try again.',
      devHint: 'network',
    }
  }

  if (msg.includes('timeout')) {
    return {
      userMessage: 'The request took too long. Please try again.',
      devHint: 'timeout',
    }
  }

  return { userMessage: fallbackUserMessage, devHint: 'unmapped' }
}

/** Only allowlisted messages from deliberate throws may reach users; everything else uses fallback. */
export function safeThrownErrorMessage(
  error: unknown,
  fallback: string,
  allowedUserMessages: readonly string[],
): string {
  if (!(error instanceof Error)) return fallback
  return allowedUserMessages.includes(error.message) ? error.message : fallback
}
