'use client'

import { submitMarketingInterest, type MarketingInterestFormState } from '@/app/actions/marketing-interest'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const SUBMIT_BUTTON_CLASS = {
  default:  'btn-glow inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-brand-blue1 px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-brand-blue2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
  editorial: 'inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#fffaf0] px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#0c1015] transition hover:bg-[#fff8ee] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 lg:min-w-[9.5rem]',
} as const

function SubmitInterestButton({ label, variant }: { label: string; variant: keyof typeof SUBMIT_BUTTON_CLASS }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={SUBMIT_BUTTON_CLASS[variant]}
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
  variant?: keyof typeof SUBMIT_BUTTON_CLASS
  /** Center form and messages for editorial newsletter blocks */
  centered?: boolean
  /** Stacked email + button for sidebar placement */
  stacked?: boolean
}

export function HomepageInterestForm({
  source,
  formLabel = 'Email for updates interest',
  submitLabel,
  variant = 'default',
  centered = false,
  stacked = false,
}: Props) {
  const [state, formAction] = useActionState<MarketingInterestFormState, FormData>(
    submitMarketingInterest,
    null
  )

  const submitText = submitLabel ?? 'Save my interest'

  const inputClass =
    variant === 'editorial'
      ? 'min-h-12 w-full rounded-full border border-[#fffaf0]/30 bg-transparent px-6 py-3 font-navbar-jakarta text-sm font-normal leading-normal tracking-normal text-[#fffaf0] placeholder:font-navbar-jakarta placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-[#fffaf0]/45 focus:border-[#fffaf0]/55 focus:outline-none focus:ring-1 focus:ring-[#fffaf0]/35 sm:min-w-0'
      : 'min-h-12 flex-1 rounded-full border-2 border-neutral-300 px-4 py-3 font-navbar-jakarta text-sm font-normal text-[#4a392f] placeholder:font-normal placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue1 sm:min-w-0'

  const successClass =
    variant === 'editorial'
      ? 'truncate font-navbar-jakarta text-sm font-normal leading-normal tracking-normal text-[#fffaf0]/80'
      : 'rounded-2xl border border-[#c8dfc4] bg-[#eef7ec] px-4 py-3 font-navbar-jakarta text-sm font-normal leading-6 text-[#2f4a34]'

  const errorClass =
    variant === 'editorial'
      ? 'truncate font-navbar-jakarta text-sm font-normal leading-normal tracking-normal text-[#fffaf0]/90'
      : 'rounded-2xl border border-[#e8cbc1] bg-[#fff5f3] px-4 py-3 text-sm leading-6 text-[#8a3b2f]'

  const wrapperClass = stacked
    ? 'w-full min-w-0 max-w-[35rem] space-y-4'
    : centered
      ? 'mt-12 w-full max-w-[26rem] space-y-4'
      : 'mt-10 w-full max-w-xl space-y-4'

  const formClass = stacked
    ? 'flex w-full flex-col gap-3 lg:flex-row lg:items-stretch'
    : centered
      ? 'flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center'
      : 'flex flex-col gap-4 sm:flex-row sm:items-stretch'

  return (
    <div className={wrapperClass}>
      <form action={formAction} className={formClass}>
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
          className={stacked ? `${inputClass} min-w-0 flex-1` : centered ? inputClass : `${inputClass} flex-1`}
        />
        <SubmitInterestButton label={submitText} variant={variant} />
      </form>

      {state && 'success' in state ? (
        <p className={successClass} role="status">
          {state.success}
        </p>
      ) : null}
      {state && 'error' in state ? (
        <p className={errorClass} role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  )
}
