/**
 * Signup Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

'use client'

import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, null)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full surface-card rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-brand-navy">Create Account</h1>

        {state?.error && (
          <div className="mb-4 p-4 bg-red-50/80 border border-red-200/60 rounded-xl text-red-700 text-sm backdrop-blur-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-neutral-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2 text-neutral-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all"
              placeholder="choose a username"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
              required
            />
          </div>

          <div className="bg-brand-peach/20 border border-brand-peach/40 text-foreground p-4 rounded-xl">
            <p className="text-sm font-medium">
              🎁 Start with a 7-day free trial - Full access to all features
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-coral text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-coral/90 transition-all active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-brand-coral hover:text-brand-coral/80 font-medium"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

