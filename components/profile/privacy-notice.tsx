import { cn } from '@/lib/utils'

interface PrivacyNoticeProps {
  className?: string
}

/**
 * Quiet reassurance about profile visibility on community surfaces.
 * Visual/composition only — does not read or set privacy values.
 */
export function PrivacyNotice({ className }: PrivacyNoticeProps) {
  return (
    <aside
      role="note"
      aria-label="How privacy applies on community surfaces"
      className={cn('community-context-banner px-4 py-3.5 sm:px-5', className)}
    >
      <p className="community-section-label mb-2 text-[0.65rem]">On community surfaces</p>
      <p className="text-sm leading-relaxed text-brand-blue/85">
        <span className="font-semibold text-brand-pinkDark">Public</span> profiles can appear on
        story cards and member links.{' '}
        <span className="font-semibold text-brand-pinkDark">Limited</span> and{' '}
        <span className="font-semibold text-brand-pinkDark">Private</span> choices reduce what other
        members see when they browse — your stories still follow each post&apos;s own visibility
        rules.
      </p>
    </aside>
  )
}
