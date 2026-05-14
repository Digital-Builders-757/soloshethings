'use client'

import { HomepageInterestForm } from '@/components/home/homepage-interest-form'

/** Legacy landing embed — same honesty rules as homepage interest capture. Not currently mounted in routes; kept for reuse. */
export function NewsletterSignup() {
  return <HomepageInterestForm source="landing_embed_interest" formLabel="Email for SoloSheThings interest list" submitLabel="Save email" />
}
