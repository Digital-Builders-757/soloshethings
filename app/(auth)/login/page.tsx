/**
 * Login Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

import { Suspense } from "react"
import { LoadingState } from '@/components/ui/loading-state'
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState variant="auth" label="Loading sign-in…" />}>
      <LoginForm />
    </Suspense>
  )
}
