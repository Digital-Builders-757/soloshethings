import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  UPGRADE_PROMPT_ARIA_LABEL,
  type UpgradePromptProps,
  type UpgradePromptVariant,
} from '@/types/upgrade-prompt'

const variantShell: Record<UpgradePromptVariant, string> = {
  feed:
    'rounded-2xl border border-[#ead8c2] bg-[#fff8ec] px-4 py-3 text-sm text-brand-pinkDark',
  studio:
    'rounded-[1.25rem] border border-brand-orange/28 bg-gradient-to-br from-brand-cream/60 to-white p-4 text-sm leading-relaxed text-brand-pinkDark sm:p-5',
  dashboard:
    'rounded-2xl border border-brand-gold/32 bg-gradient-to-br from-brand-cream/45 to-white px-4 py-3.5 text-sm leading-relaxed text-brand-pinkDark',
}

/**
 * Reusable limited-tier upgrade notice with preset variants for feed, studio, and dashboard.
 * Composition-only — does not read membership state or gate access.
 */
export function UpgradePrompt({
  variant = 'feed',
  subscribeHref = '/subscribe',
  className,
}: UpgradePromptProps) {
  return (
    <aside
      role="note"
      aria-label={UPGRADE_PROMPT_ARIA_LABEL}
      className={cn(variantShell[variant], className)}
    >
      {variant === 'feed' ? (
        <p>
          <span className="font-semibold">Limited member access:</span>{' '}
          you can open up to three other members&apos; stories per day (UTC). Subscribe for
          unlimited reads, saves, and posting.{' '}
          <Link
            href={subscribeHref}
            className="font-semibold text-brand-orange underline underline-offset-2 hover:text-brand-coral"
          >
            Open billing
          </Link>
        </p>
      ) : null}

      {variant === 'studio' ? (
        <p>
          <span className="font-semibold">Posting needs membership.</span> Start a trial from{' '}
          <Link
            href={subscribeHref}
            className="font-semibold text-brand-orange underline-offset-2 hover:text-brand-coral hover:underline"
          >
            Billing
          </Link>
          — drafts stay here until you subscribe.
        </p>
      ) : null}

      {variant === 'dashboard' ? (
        <p>
          <span className="font-semibold">Starter mode:</span> You are in limited-access mode until
          you start the subscription flow.{' '}
          <Link
            href={subscribeHref}
            className="font-semibold text-brand-orange underline underline-offset-2 hover:text-brand-coral"
          >
            View billing
          </Link>
        </p>
      ) : null}
    </aside>
  )
}
