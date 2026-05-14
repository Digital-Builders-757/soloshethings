/**
 * Signup Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

"use client"

import { signup } from "@/app/actions/auth"
import { Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useFormState, useFormStatus } from "react-dom"

function SignupSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-[#e34b16] py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(227,75,22,0.35)] transition-all hover:bg-[#c74010] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
    >
      {pending ? "Creating account..." : "Sign up"}
    </button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? ""
  const loginHref = redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
      <div className="editorial-card-strong grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.02fr_0.98fr]">
        {/* Branded panel */}
        <div className="relative isolate hidden flex-col justify-center overflow-hidden bg-[#7a331b] px-8 py-12 text-[#fff5df] lg:flex lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-30"
            style={{
              backgroundImage: "url('/images/wavy-pattern.png')",
              backgroundPosition: "center bottom",
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-10 bottom-1/4 h-44 w-44 rounded-full bg-[#fab642]/10 blur-3xl" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Join the circle</p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#f7e8be] xl:text-[2.75rem]">
              Create your{" "}
              <span className="italic text-[#fab642]">Solo SHE</span> account
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#fff5df]/82">
              Stories, safety-minded notes, and community—built for women who are learning to trust
              themselves on the road.
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-[#fff5df]/88">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]" />
                Save your profile and keep your journey organized.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#fab642]" />
                Be first to know when new chapters of the platform go live.
              </li>
            </ul>
            <Link
              href={loginHref}
              className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-[#fab642] transition-colors hover:text-[#f5b137]"
            >
              Already have an account? Sign in →
            </Link>
          </div>
        </div>

        {/* Mobile brand strip */}
        <div className="border-b border-[#efdac1] bg-[#7a331b] px-6 py-8 text-center lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">Join the circle</p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#f7e8be]">Create account</h1>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center bg-[#fffaf0] px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow lg:hidden">Account</p>
            <h2 className="mt-2 hidden font-serif text-3xl font-bold text-[#7a331b] lg:block">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849] lg:mt-3">
              A few details and you are in—same warmth as the homepage, none of the cold SaaS vibes.
            </p>

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
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="editorial-input warm-focus-ring py-3.5 pl-11 pr-4 placeholder:text-[#b28b6f]"
                    placeholder="choose a username"
                    pattern="[a-zA-Z0-9_]+"
                    title="Username can only contain letters, numbers, and underscores"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-[#6d5849]">Letters, numbers, and underscores only.</p>
              </div>

              <div className="rounded-2xl border border-[#efd4b2] bg-[#f7e8be]/50 p-4 text-[#7a331b]">
                <p className="text-sm font-semibold leading-6">
                  Create your member profile now. Paid tiers and premium access are still being rolled out, so this screen only promises account creation and member updates.
                </p>
              </div>

              <SignupSubmitButton />
            </form>

            <div className="mt-8 text-center">
              <Link
                href={loginHref}
                className="text-sm font-semibold text-[#e34b16] underline-offset-4 transition-colors hover:text-[#c74010] hover:underline"
              >
                Already have an account? Sign in
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
