'use client'

/**
 * Reset Password Form
 *
 * Client Component — uses useActionState + useFormStatus, mirrors login/signup patterns.
 * The parent page.tsx has already verified an active recovery session exists.
 */

import { updatePassword } from '@/app/actions/auth'
import { Lock } from 'lucide-react'
import Link from 'next/link'
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
      {pending ? 'Updating password…' : 'Set new password'}
    </button>
  )
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, null)

  const isExpiredError =
    state?.error != null &&
    (state.error.toLowerCase().includes('expired') ||
      state.error.toLowerCase().includes('no longer valid'))

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
      <div className="editorial-card-strong grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.02fr_0.98fr]">
        {/* Branded panel — orange, matches login page tone */}
        <div className="relative isolate hidden flex-col justify-center overflow-hidden bg-[#d85a23] px-8 py-12 text-[#fff5df] lg:flex lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-85"
            style={{
              backgroundImage: "url('/images/wavy-pattern.png')",
              backgroundPosition: 'center top',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'cover',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-12 top-1/3 h-40 w-40 rounded-full bg-[#f7e8be]/12 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">
              Almost there
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold uppercase leading-tight tracking-[0.03em] text-[#fff4df] xl:text-5xl">
              Create a new{' '}
              <span className="italic font-normal normal-case text-[#fab642]">password</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#fff6e8]/88">
              Choose something strong and memorable — you&apos;re almost back in.
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-[#fff5df]/88">
              <li className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]"
                  aria-hidden="true"
                />
                Use at least 8 characters.
              </li>
              <li className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]"
                  aria-hidden="true"
                />
                Mix letters, numbers, or symbols for extra strength.
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile brand strip */}
        <div className="border-b border-[#efdac1] bg-[#d85a23] px-6 py-8 text-center lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">
            Almost there
          </p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#fff4df]">New password</h1>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow lg:hidden">Account recovery</p>
            <h2 className="mt-2 hidden font-serif text-3xl font-bold text-[#7a331b] lg:block">
              Set new password
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849] lg:mt-3">
              Your reset link is active. Choose a new password and you&apos;re done.
            </p>

            {state?.error && (
              <div
                className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm text-red-800"
                role="alert"
              >
                <p>{state.error}</p>
                {isExpiredError && (
                  <p className="mt-2">
                    <Link
                      href="/forgot-password"
                      className="font-semibold underline underline-offset-2 hover:text-red-900"
                    >
                      Request a new reset link →
                    </Link>
                  </p>
                )}
              </div>
            )}

            <form action={formAction} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#7a331b]"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="editorial-input warm-focus-ring py-3.5 pl-11 pr-4 placeholder:text-[#b28b6f]"
                    placeholder="••••••••"
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-[#6d5849]">At least 8 characters.</p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#7a331b]"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="editorial-input warm-focus-ring py-3.5 pl-11 pr-4 placeholder:text-[#b28b6f]"
                    placeholder="••••••••"
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <SubmitButton />
            </form>

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
