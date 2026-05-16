/**
 * Forgot Password Page
 *
 * Server Component wrapper — renders the Client Component form inside a Suspense
 * boundary (required because ForgotPasswordForm calls useSearchParams()).
 *
 * Route: /forgot-password
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

import { Suspense } from 'react'
import { ForgotPasswordForm } from './forgot-password-form'

function ForgotPasswordFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <p className="text-sm font-semibold text-[#6d5849]">Loading…</p>
    </main>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
