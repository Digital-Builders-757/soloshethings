/**
 * Reset Password Page
 *
 * Server Component — verifies an active recovery session exists before rendering
 * the password form. If the session is missing (link expired / not clicked),
 * the user is sent back to /forgot-password to request a fresh link.
 *
 * Route: /reset-password
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { ResetPasswordForm } from './reset-password-form'

function ResetPasswordFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <p className="text-sm font-semibold text-[#6d5849]">Loading…</p>
    </main>
  )
}

export default async function ResetPasswordPage() {
  const user = await getUser()

  // No active session — the recovery link was never clicked, already used, or expired
  if (!user) {
    redirect('/forgot-password?notice=link_expired')
  }

  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
