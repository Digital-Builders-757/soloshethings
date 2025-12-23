/**
 * Signup Page
 *
 * Functional authentication with server actions
 * Follows: docs/contracts/AUTH_CONTRACT.md
 */

import { signup } from '@/app/actions/auth'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Create Account</h1>

        <form action={signup} className="space-y-6">
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
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-blue1 focus:border-transparent"
              placeholder="choose a username"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
              required
            />
          </div>

          <div className="bg-brand-yellow1 text-black p-4 rounded-lg">
            <p className="text-sm font-medium">
              🎁 Start with a 7-day free trial - Full access to all features
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-blue2 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-brand-blue1 hover:text-brand-blue2 font-medium"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

