/**
 * Login Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

import { Suspense } from "react"
import { LoginForm } from "./login-form"

function LoginFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <p className="text-sm font-semibold text-[#6d5849]">Loading sign-in…</p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
