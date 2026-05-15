"use client"

import { login } from "@/app/actions/auth"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

const redirectLabels: Record<string, string> = {
  "/dashboard": "your dashboard",
  "/profile": "your profile",
  "/submit": "the submission form",
  "/settings": "settings",
}

function LoginSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#e34b16] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(227,75,22,0.35)] transition-all hover:bg-[#c74010] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? ""
  const notice = searchParams.get("notice")
  const signedOut = searchParams.get("signedOut")
  const redirectPath = redirectTo.split("?")[0] || redirectTo
  const redirectLabel = redirectLabels[redirectPath]
  const signupHref = redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/signup"

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
      <div className="editorial-card-strong grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.02fr_0.98fr]">
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
                Create an account to save your profile and stay close as the platform grows.
              </p>
              <Link
                href={signupHref}
                className="mt-4 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#fab642] transition-colors hover:text-[#f5b137]"
              >
                Start your journey →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-b border-[#efdac1] bg-[#d85a23] px-6 py-8 text-center lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Welcome back</p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#fff4df]">Sign in</h1>
        </div>

        <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow lg:hidden">Account</p>
            <h2 className="mt-2 hidden font-serif text-3xl font-bold text-[#7a331b] lg:block">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849] lg:mt-3">
              Enter your email and password to access your account.
            </p>

            {notice === "confirm_email" && (
              <div
                className="mt-6 rounded-2xl border border-[#efd4b2] bg-[#f7e8be]/40 p-4 text-sm leading-6 text-[#7a331b]"
                role="status"
              >
                <p className="font-medium">Almost there—we sent a confirmation link to your inbox.</p>
                <p className="mt-2 text-[#6d5849]">
                  Open the email and tap the link to verify your address, then sign in below whenever you&apos;re ready.
                  If nothing shows up within a minute or two, check your <span className="font-medium text-[#7a331b]">Spam</span> or{" "}
                  <span className="font-medium text-[#7a331b]">Promotions</span> folder; providers sometimes tuck it away.
                </p>
              </div>
            )}

            {notice === "confirmed_email" && (
              <div
                className="mt-6 rounded-2xl border border-[#d7e8cc] bg-[#f4fbef] p-4 text-sm leading-6 text-[#365229]"
                role="status"
              >
                <p className="font-medium">Your email is confirmed—nice work.</p>
                <p className="mt-2 text-[#4a6838]/95">Sign in below and we&apos;ll take you wherever you wanted to go next.</p>
              </div>
            )}

            {signedOut === "1" && (
              <div
                className="mt-6 rounded-2xl border border-[#ead8c2] bg-white p-4 text-sm text-[#6d5849]"
                role="status"
              >
                You&apos;re signed out. Come back anytime.
              </div>
            )}

            {redirectTo && redirectLabel && (
              <div
                className="mt-6 rounded-2xl border border-[#efd4b2] bg-[#fff5e8] p-4 text-sm text-[#7a331b]"
                role="status"
              >
                Sign in to continue to {redirectLabel}.
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
              <input type="hidden" name="redirectTo" value={redirectTo} />

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
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="editorial-input warm-focus-ring py-3.5 pl-11 pr-4 placeholder:text-[#b28b6f]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <LoginSubmitButton />
            </form>

            <div className="mt-8 text-center">
              <Link
                href={signupHref}
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
