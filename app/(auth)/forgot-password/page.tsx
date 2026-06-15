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
import { LoadingState } from '@/components/ui/loading-state'
import { ForgotPasswordForm } from './forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingState variant="auth" label="Loading password reset…" />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
