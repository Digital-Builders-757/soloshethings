import type { privacy_level } from '@/types/database'

export const PRIVACY_DISPLAY_LABELS: Record<privacy_level, string> = {
  public: 'Public',
  limited: 'Limited',
  private: 'Private',
}

export function getPrivacyDisplayLabel(level: privacy_level): string {
  return PRIVACY_DISPLAY_LABELS[level]
}
