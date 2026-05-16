/**
 * User-safe auth error copy — no stack traces or raw provider internals.
 */

import type { AuthError } from '@supabase/supabase-js'

export function formatSignInError(error: AuthError | Error): string {
  const code = 'code' in error ? String((error as AuthError).code ?? '') : ''
  const msg = (error.message ?? '').toLowerCase()

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Email or password is incorrect. Please try again.'
  }
  if (
    msg.includes('email not confirmed') ||
    msg.includes('not confirmed') ||
    code === 'email_not_confirmed'
  ) {
    return 'Please confirm your email before signing in. Check your inbox for the link.'
  }
  if (msg.includes('too many requests') || code === 'over_request_rate_limit') {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return 'Sign in failed. Please check your details and try again.'
}

export function formatSignUpError(error: AuthError | Error): string {
  const msg = (error.message ?? '').toLowerCase()

  if (msg.includes('already registered') || msg.includes('user already')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (msg.includes('password')) {
    return 'Password does not meet requirements. Use at least 6 characters.'
  }
  return 'Sign up failed. Please check your details and try again.'
}

/**
 * Password reset request errors — never reveal whether an email account exists.
 * Only rate-limit errors are safe to surface to the user.
 */
export function formatPasswordResetError(error: AuthError | Error): string {
  const code = 'code' in error ? String((error as AuthError).code ?? '') : ''
  const msg = (error.message ?? '').toLowerCase()

  if (
    msg.includes('too many requests') ||
    msg.includes('rate limit') ||
    code === 'over_request_rate_limit'
  ) {
    return 'Too many attempts. Please wait a few minutes before trying again.'
  }

  return 'Something went wrong. Please try again in a moment.'
}

/**
 * Password update errors — safe user-facing copy.
 */
export function formatUpdatePasswordError(error: AuthError | Error): string {
  const msg = (error.message ?? '').toLowerCase()

  if (
    msg.includes('same password') ||
    msg.includes('different from the old') ||
    msg.includes('should be different')
  ) {
    return 'Your new password must be different from your current password.'
  }

  if (
    msg.includes('token') ||
    msg.includes('expired') ||
    msg.includes('invalid') ||
    msg.includes('session')
  ) {
    return 'Your reset link has expired or is no longer valid. Please request a new one.'
  }

  return 'Password update failed. Please try again or request a new reset link.'
}
