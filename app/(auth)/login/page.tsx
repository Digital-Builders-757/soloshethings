/**
 * Login Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

"use client"

import { login } from "@/app/actions/auth"
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { Mail, Lock, Sparkles } from "lucide-react"
import { useRef } from "react"

// Demo credentials for testing
const DEMO_EMAIL = "demo@soloshethings.com"
const DEMO_PASSWORD = "DemoUser123!"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#e34b16] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(227,75,22,0.35)] transition-all hover:bg-[#c74010] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null)
  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleDemoLogin = () => {
    if (emailRef.current && passwordRef.current && formRef.current) {
      emailRef.current.value = DEMO_EMAIL
      passwordRef.current.value = DEMO_PASSWORD
      formRef.current.requestSubmit()
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#efdac1] bg-white shadow-[0_30px_80px_rgba(122,51,27,0.12)] lg:grid-cols-[1.02fr_0.98fr]">
        {/* Branded panel */}
        <div className="relative isolate hidden flex-col justify-center overflow-hidden bg-[#d85a23] px-8 py-12 text-[#fff5df] lg:flex lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-85"
            style={{
              backgroundImage: "url('/images/wavy-pattern.png')",
              backgroundPosition: "center top",
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -left-12 top-1/3 h-40 w-40 rounded-full bg-[#f7e8be]/12 blur-3xl" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Welcome back</p>
            <h1 className="mt-4 font-serif text-4xl font-bold uppercase leading-tight tracking-[0.03em] text-[#fff4df] xl:text-5xl">
              Sign in to{" "}
              <span className="italic font-normal normal-case text-[#fab642]">Solo SHE Things</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#fff6e8]/88">
              Pick up where you left off—your dashboard, profile, and community tools are waiting.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-[#efd4b2]/70 bg-[#fff6e8]/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-[#fff4df]">New here?</p>
              <p className="mt-2 text-sm leading-6 text-[#fff6e8]/80">
                Create an account to join the journey and unlock the full experience.
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#fab642] transition-colors hover:text-[#f5b137]"
              >
                Start your journey →
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile brand strip */}
        <div className="border-b border-[#efdac1] bg-[#d85a23] px-6 py-8 text-center lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Welcome back</p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#fff4df]">Sign in</h1>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a14b24] lg:hidden">Account</p>
            <h2 className="mt-2 hidden font-serif text-3xl font-bold text-[#7a331b] lg:block">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849] lg:mt-3">
              Enter your email and password to access your account.
            </p>

            {state?.error && (
              <div
                className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm text-red-800"
                role="alert"
              >
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction} className="mt-8 flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full rounded-2xl border border-[#efdac1] bg-white py-3.5 pl-11 pr-4 text-[#3a3a3a] shadow-sm placeholder:text-[#b28b6f] outline-none transition-shadow focus:ring-2 focus:ring-[#e34b16]/25"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    className="w-full rounded-2xl border border-[#efdac1] bg-white py-3.5 pl-11 pr-4 text-[#3a3a3a] shadow-sm placeholder:text-[#b28b6f] outline-none transition-shadow focus:ring-2 focus:ring-[#e34b16]/25"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <SubmitButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#efdac1]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#fffaf0] px-2 text-[#6d5849]">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#fab642] bg-[#fff8eb] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition-all hover:bg-[#fab642]/20 active:scale-[0.98]"
              >
                <Sparkles className="size-4" />
                Try Demo Account
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/signup"
                className="text-sm font-semibold text-[#e34b16] underline-offset-4 transition-colors hover:text-[#c74010] hover:underline"
              >
                Don&apos;t have an account? Sign up
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
