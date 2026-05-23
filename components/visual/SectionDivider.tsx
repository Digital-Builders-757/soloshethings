/**
 * SectionDivider
 *
 * Editorial SVG section dividers. Used to separate content zones
 * with personality and warmth rather than a generic <hr />.
 *
 * All dividers are aria-hidden, purely decorative.
 *
 * Variants:
 *   wave     — A gentle S-curve flowing across the full width.
 *              Classic magazine section break.
 *   slash    — A clean diagonal rule. Creates forward momentum.
 *   mark     — A centered warm mark between two rule segments.
 *              Use for editorial pauses, not full section breaks.
 *   horizon  — A straight rule with warm gradient fade at edges.
 *              The most restrained option; use freely.
 *   double   — Two thin rules, slightly offset. Print-editorial weight.
 *
 * Usage:
 *   <SectionDivider variant="wave" className="my-12" />
 *   <SectionDivider variant="mark" label="✦" className="my-8" />
 */

import { cn } from '@/lib/utils'

type DividerVariant = 'wave' | 'slash' | 'mark' | 'horizon' | 'double'

interface SectionDividerProps {
  variant?: DividerVariant
  /** Used by the "mark" variant as the centered editorial symbol */
  label?: string
  /** Stroke color (CSS color value). Defaults to warm brown. */
  color?: string
  /** Stroke opacity */
  opacity?: number
  className?: string
}

export function SectionDivider({
  variant = 'horizon',
  label = '✦',
  color = '#7a331b',
  opacity = 0.22,
  className,
}: SectionDividerProps) {
  if (variant === 'mark') {
    return (
      <div
        className={cn('flex items-center gap-4', className)}
        aria-hidden
        role="presentation"
      >
        {/* Left rule */}
        <svg
          viewBox="0 0 580 4"
          className="h-px flex-1"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="rule-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0} />
              <stop offset="100%" stopColor={color} stopOpacity={opacity} />
            </linearGradient>
          </defs>
          <line x1="0" y1="2" x2="580" y2="2" stroke="url(#rule-left)" strokeWidth="1" />
        </svg>

        {/* Central mark */}
        <span
          className="shrink-0 select-none font-display text-[0.6rem] font-bold"
          style={{ color, opacity: opacity * 1.4 }}
        >
          {label}
        </span>

        {/* Right rule */}
        <svg
          viewBox="0 0 580 4"
          className="h-px flex-1"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="rule-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={opacity} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <line x1="0" y1="2" x2="580" y2="2" stroke="url(#rule-right)" strokeWidth="1" />
        </svg>
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <svg
        viewBox="0 0 1200 40"
        className={cn('w-full overflow-visible', className)}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        role="presentation"
      >
        <defs>
          <linearGradient id="wave-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={color} stopOpacity={0} />
            <stop offset="10%"  stopColor={color} stopOpacity={opacity} />
            <stop offset="90%"  stopColor={color} stopOpacity={opacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/*
         * A gentle single-period S-wave.
         * Control points create a soft, non-aggressive curve.
         * Slightly off-axis (y=22 at left, y=18 at right) adds asymmetry.
         */}
        <path
          d="M -10,22 C 180,4 420,40 600,22 C 780,4 1020,40 1210,18"
          fill="none"
          stroke="url(#wave-fade)"
          strokeWidth="1"
        />
      </svg>
    )
  }

  if (variant === 'slash') {
    return (
      <svg
        viewBox="0 0 1200 30"
        className={cn('w-full overflow-visible', className)}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        role="presentation"
      >
        <defs>
          <linearGradient id="slash-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={color} stopOpacity={0} />
            <stop offset="8%"   stopColor={color} stopOpacity={opacity} />
            <stop offset="92%"  stopColor={color} stopOpacity={opacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Diagonal — starts lower-left, ends higher-right */}
        <line x1="0" y1="26" x2="1200" y2="4" stroke="url(#slash-fade)" strokeWidth="1" />
      </svg>
    )
  }

  if (variant === 'double') {
    return (
      <svg
        viewBox="0 0 1200 10"
        className={cn('w-full overflow-visible', className)}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        role="presentation"
      >
        <defs>
          <linearGradient id="double-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={color} stopOpacity={0} />
            <stop offset="12%"  stopColor={color} stopOpacity={opacity * 0.9} />
            <stop offset="88%"  stopColor={color} stopOpacity={opacity * 0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="double-fade-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={color} stopOpacity={0} />
            <stop offset="15%"  stopColor={color} stopOpacity={opacity * 0.6} />
            <stop offset="85%"  stopColor={color} stopOpacity={opacity * 0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Primary rule */}
        <line x1="0" y1="2" x2="1200" y2="2" stroke="url(#double-fade)" strokeWidth="1" />
        {/* Secondary rule — slightly inset, lighter */}
        <line x1="0" y1="7" x2="1200" y2="7" stroke="url(#double-fade-2)" strokeWidth="0.8" />
      </svg>
    )
  }

  /* horizon — default */
  return (
    <svg
      viewBox="0 0 1200 4"
      className={cn('w-full overflow-visible', className)}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="horizon-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity={0} />
          <stop offset="18%"  stopColor={color} stopOpacity={opacity} />
          <stop offset="50%"  stopColor={color} stopOpacity={opacity * 1.2} />
          <stop offset="82%"  stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <line x1="0" y1="2" x2="1200" y2="2" stroke="url(#horizon-fade)" strokeWidth="1" />
    </svg>
  )
}
