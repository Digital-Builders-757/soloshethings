/**
 * Login Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

'use client'

import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null)

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Sign In</h1>

        {state?.error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-blue2 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/signup"
            className="text-brand-blue1 hover:text-brand-blue2 font-medium"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

