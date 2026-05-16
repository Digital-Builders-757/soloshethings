'use client'

/**
 * Forgot Password Form
 *
 * Client Component — uses useActionState + useFormStatus, mirrors login/signup patterns.
 * useSearchParams() is why this needs a Suspense boundary in the parent page.
 */

import { requestPasswordReset } from '@/app/actions/auth'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#e34b16] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(227,75,22,0.35)] transition-all hover:bg-[#c74010] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
    >
      {pending ? 'Sending link…' : 'Send reset link'}
    </button>
  )
}

const BrandedPanel = () => (
  <div className="relative isolate hidden flex-col justify-center overflow-hidden bg-[#7a331b] px-8 py-12 text-[#fff5df] lg:flex lg:px-12 lg:py-16">
    <div
      className="pointer-events-none absolute -right-10 bottom-1/4 h-44 w-44 rounded-full bg-[#fab642]/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -left-12 top-1/3 h-36 w-36 rounded-full bg-[#f7e8be]/8 blur-3xl"
      aria-hidden="true"
    />

    <div className="relative z-10">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Locked out?</p>
      <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#f7e8be] xl:text-[2.75rem]">
        Reset your{' '}
        <span className="italic text-[#fab642]">password</span>
      </h1>
      <p className="mt-5 max-w-sm text-base leading-7 text-[#fff5df]/82">
        Enter the email you signed up with and we&apos;ll send a secure link to get you back in.
      </p>
      <ul className="mt-8 space-y-3 text-sm leading-6 text-[#fff5df]/88">
        <li className="flex gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]" aria-hidden="true" />
          The link expires after a short window — open it promptly.
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]" aria-hidden="true" />
          Check spam or promotions if it doesn&apos;t land in your inbox.
        </li>
      </ul>
      <Link
        href="/login"
        className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-[#fab642] transition-colors hover:text-[#f5b137]"
      >
        ← Back to sign in
      </Link>
    </div>
  </div>
)

const MobileBrandStrip = () => (
  <div className="border-b border-[#efdac1] bg-[#7a331b] px-6 py-8 text-center lg:hidden">
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Locked out?</p>
    <h1 className="mt-2 font-serif text-2xl font-bold text-[#f7e8be]">Reset password</h1>
  </div>
)

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, null)
  const searchParams = useSearchParams()
  const notice = searchParams.get('notice')

  // ── Success state — form is replaced by a confirmation panel ──────────────
  if (state?.sent) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
        <div className="editorial-card-strong grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.02fr_0.98fr]">
          <BrandedPanel />
          <MobileBrandStrip />

          <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
            <div className="mx-auto w-full max-w-md">
              <div
                className="rounded-2xl border border-[#d7e8cc] bg-[#f4fbef] p-6 text-sm leading-6 text-[#365229]"
                role="status"
              >
                <p className="font-serif text-base font-bold text-[#2d4a22]">Check your inbox</p>
                <p className="mt-3 leading-relaxed text-[#4a6838]/95">
                  If an account with that email exists, you&apos;ll receive a password reset link
                  shortly. Open the email and tap the link to set a new password.
                </p>
                <p className="mt-3 leading-relaxed text-[#4a6838]/80">
                  If nothing arrives in a couple of minutes, check your{' '}
                  <span className="font-medium text-[#365229]">Spam</span> or{' '}
                  <span className="font-medium text-[#365229]">Promotions</span> folder.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-[#e34b16] underline-offset-4 transition-colors hover:text-[#c74010] hover:underline"
                >
                  Back to sign in
                </Link>
              </div>

              <p className="mt-8 text-center text-xs text-[#6d5849]/85">
                <Link href="/" className="font-medium text-[#7a331b] underline-offset-2 hover:underline">
                  ← Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── Default form state ─────────────────────────────────────────────────────
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
      <div className="editorial-card-strong grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.02fr_0.98fr]">
        <BrandedPanel />
        <MobileBrandStrip />

        <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow lg:hidden">Account recovery</p>
            <h2 className="mt-2 hidden font-serif text-3xl font-bold text-[#7a331b] lg:block">
              Forgot password
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849] lg:mt-3">
              Enter the email address on your account and we&apos;ll send you a reset link.
            </p>

            {notice === 'link_expired' && (
              <div
                className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm text-red-800"
                role="alert"
              >
                <p className="font-medium">That link has expired or is no longer valid.</p>
                <p className="mt-1 text-red-700/90">Enter your email below to request a fresh one.</p>
              </div>
            )}

            {state?.error && (
              <div
                className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm text-red-800"
                role="alert"
              >
                {state.error}
              </div>
            )}

            <form action={formAction} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="editorial-input warm-focus-ring py-3.5 pl-11 pr-4 placeholder:text-[#b28b6f]"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <SubmitButton />
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#e34b16] underline-offset-4 transition-colors hover:text-[#c74010] hover:underline"
              >
                Remembered it? Sign in
              </Link>
            </div>

            <p className="mt-8 text-center text-xs text-[#6d5849]/85">
              <Link href="/" className="font-medium text-[#7a331b] underline-offset-2 hover:underline">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
