'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-md">
      {notice ? (
        <p
          className="mb-4 rounded-2xl border border-[#ead8c2] bg-[#fffaf4] px-4 py-3 text-center text-sm text-[#6d5849]"
          role="status"
        >
          {notice}
        </p>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          // TODO: Implement newsletter signup
          setNotice('Newsletter signup is coming soon. Thanks for your interest!')
        }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 rounded-full border-2 border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue1"
        />
        <button
          type="submit"
          className="btn-glow rounded-full bg-brand-blue1 px-8 py-3 font-semibold text-white transition-all hover:bg-brand-blue2 active:scale-[0.98]"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}
