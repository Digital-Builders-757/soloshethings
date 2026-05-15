import type { report_status } from '@/types/database'

/**
 * Member-facing /reports styling — calm contrast between statuses, not flashy.
 */
export function reportStatusBadgeClasses(status: report_status): string {
  switch (status) {
    case 'pending':
      return 'border-brand-pinkDark/22 bg-brand-cream/60 text-brand-pinkDark'
    case 'reviewed':
      return 'border-amber-400/40 bg-amber-50 text-amber-950'
    case 'resolved':
      return 'border-emerald-400/40 bg-emerald-50 text-emerald-950'
    case 'dismissed':
      return 'border-slate-300/90 bg-slate-50 text-slate-800'
    case 'withdrawn':
      return 'border-violet-400/40 bg-violet-50 text-violet-950'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export function reportCardRailBg(status: report_status): string {
  switch (status) {
    case 'pending':
      return 'bg-brand-pinkDark/20'
    case 'reviewed':
      return 'bg-amber-400/45'
    case 'resolved':
      return 'bg-emerald-500/40'
    case 'dismissed':
      return 'bg-slate-400/45'
    case 'withdrawn':
      return 'bg-violet-500/38'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

/** Compact stat chip in the page header — pairs visually with each status lane. */
export function reportSummaryChipClasses(status: report_status): string {
  const base =
    'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm'

  switch (status) {
    case 'pending':
      return `${base} border-brand-pinkDark/18 bg-brand-cream/65 text-brand-pinkDark`
    case 'reviewed':
      return `${base} border-amber-400/35 bg-amber-50/95 text-amber-950`
    case 'resolved':
      return `${base} border-emerald-400/35 bg-emerald-50/95 text-emerald-950`
    case 'dismissed':
      return `${base} border-slate-300/90 bg-slate-50 text-slate-800`
    case 'withdrawn':
      return `${base} border-violet-400/35 bg-violet-50/95 text-violet-950`
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}
