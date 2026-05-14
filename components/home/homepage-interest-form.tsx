'use client'

import { submitMarketingInterest, type MarketingInterestFormState } from '@/app/actions/marketing-interest'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitInterestButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-glow inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-brand-blue1 px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-brand-blue2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  )
}

type Props = {
  /** Stable slug persisted on the row (`marketing_interest.source`) — keep short, no PII */
  source: string
  /** Accessible label prefix for helper copy */
  formLabel?: string
  submitLabel?: string
}

export function HomepageInterestForm({ source, formLabel = 'Email for updates interest', submitLabel }: Props) {
  const [state, formAction] = useActionState<MarketingInterestFormState, FormData>(
    submitMarketingInterest,
    null
  )

  const submitText = submitLabel ?? 'Save my interest'

  return (
    <div className="mt-8 space-y-4">
      <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input type="hidden" name="source" value={source} />
        <label className="sr-only" htmlFor={`interest-email-${source}`}>
          {formLabel}
        </label>
        <input
          id={`interest-email-${source}`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="your@email.com"
          required
          maxLength={254}
          className="min-h-12 flex-1 rounded-full border-2 border-neutral-300 px-4 py-3 text-[#4a392f] placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue1 sm:min-w-0"
        />
        <SubmitInterestButton label={submitText} />
      </form>

      {state && 'success' in state ? (
        <p
          className="rounded-2xl border border-[#c8dfc4] bg-[#eef7ec] px-4 py-3 text-sm leading-6 text-[#2f4a34]"
          role="status"
        >
          {state.success}
        </p>
      ) : null}
      {state && 'error' in state ? (
        <p className="rounded-2xl border border-[#e8cbc1] bg-[#fff5f3] px-4 py-3 text-sm leading-6 text-[#8a3b2f]" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  )
}
