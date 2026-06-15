/**
 * UpgradePrompt surface variants for limited-tier membership messaging.
 * Visual/composition only — links to billing; no entitlement checks.
 */

export type UpgradePromptVariant = 'feed' | 'studio' | 'dashboard'

export interface UpgradePromptProps {
  /** Preset copy/layout aligned with future consumer routes. @default 'feed' */
  variant?: UpgradePromptVariant
  /** Subscribe/billing destination. @default '/subscribe' */
  subscribeHref?: string
  className?: string
}

export const UPGRADE_PROMPT_ARIA_LABEL = 'Membership upgrade information'
