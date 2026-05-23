/**
 * GeometryAccent
 *
 * Asymmetric decorative SVG geometry for use as atmospheric accents.
 * All shapes are thin-stroke, low-opacity — meant to add visual depth
 * without drawing attention. They sit in the periphery of compositions.
 *
 * Typically positioned absolutely within a relative container,
 * partially bleeding off an edge.
 *
 * Shapes:
 *   circle-open    — A large partial circle arc, cut at ~75% of circumference.
 *                    Classic editorial "stamp" or crop-mark feeling.
 *
 *   dot-cluster    — A small organic constellation of dots.
 *                    Evokes the corner marks of a vintage layout grid.
 *
 *   cross-mark     — A fine typographic reference cross (+).
 *                    Used in editorial design as a spacing / composition mark.
 *
 *   bracket        — An open corner L-bracket. Two varieties:
 *                    top-left (default) or top-right (via `corner` prop).
 *
 *   arc-sweep      — A single flowing arc (not a closed circle).
 *                    Used to create a sense of motion or connection.
 *
 * Usage:
 *   <div className="relative overflow-hidden">
 *     <GeometryAccent shape="circle-open" size="lg" className="absolute -right-12 -top-12 opacity-20" />
 *   </div>
 */

import { cn } from '@/lib/utils'

type GeometryShape = 'circle-open' | 'dot-cluster' | 'cross-mark' | 'bracket' | 'arc-sweep'
type GeometrySize = 'sm' | 'md' | 'lg' | 'xl'
type BracketCorner = 'tl' | 'tr' | 'bl' | 'br'

const SIZE_MAP: Record<GeometrySize, string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-32 w-32',
  xl: 'h-48 w-48',
}

interface GeometryAccentProps {
  shape?: GeometryShape
  size?: GeometrySize
  /** CSS color value for the stroke */
  color?: string
  /** Stroke opacity (0–1). Keep ≤ 0.30 for non-dominant use. */
  opacity?: number
  /** For "bracket" shape — which corner. Defaults to "tl" */
  corner?: BracketCorner
  className?: string
}

export function GeometryAccent({
  shape = 'circle-open',
  size = 'md',
  color = '#7a331b',
  opacity = 0.18,
  corner = 'tl',
  className,
}: GeometryAccentProps) {
  const sizeClass = SIZE_MAP[size]

  if (shape === 'circle-open') {
    /*
     * A circle with ~85% of the circumference drawn.
     * The gap is positioned at the bottom-right, which creates an opening
     * that feels intentional rather than incomplete.
     *
     * stroke-dasharray: circumference × 0.85  →  draw 85%
     * stroke-dashoffset: small amount         →  rotate gap to bottom-right
     */
    const r = 44
    const circumference = 2 * Math.PI * r
    const drawn = circumference * 0.85

    return (
      <svg
        viewBox="0 0 100 100"
        className={cn('pointer-events-none', sizeClass, className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray={`${drawn} ${circumference - drawn}`}
          strokeDashoffset={`-${circumference * 0.08}`}
          opacity={opacity}
        />
      </svg>
    )
  }

  if (shape === 'dot-cluster') {
    /*
     * 7 dots in an organic cluster — like a small star map fragment.
     * Positions are intentionally irregular (not a grid or circle).
     */
    const dots = [
      { cx: 50, cy: 50, r: 1.6 },   // anchor — center
      { cx: 62, cy: 40, r: 1.2 },
      { cx: 72, cy: 55, r: 0.9 },
      { cx: 58, cy: 66, r: 1.0 },
      { cx: 38, cy: 62, r: 1.4 },
      { cx: 30, cy: 45, r: 0.8 },
      { cx: 44, cy: 34, r: 1.1 },
    ]

    return (
      <svg
        viewBox="0 0 100 100"
        className={cn('pointer-events-none', sizeClass, className)}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={color}
            opacity={opacity * (0.7 + i * 0.05)}
          />
        ))}
      </svg>
    )
  }

  if (shape === 'cross-mark') {
    /* A fine typographic registration cross */
    return (
      <svg
        viewBox="0 0 100 100"
        className={cn('pointer-events-none', sizeClass, className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Vertical bar */}
        <line x1="50" y1="28" x2="50" y2="72" stroke={color} strokeWidth="1.2" opacity={opacity} />
        {/* Horizontal bar */}
        <line x1="28" y1="50" x2="72" y2="50" stroke={color} strokeWidth="1.2" opacity={opacity} />
        {/* Small center circle */}
        <circle cx="50" cy="50" r="4" fill="none" stroke={color} strokeWidth="1" opacity={opacity * 0.7} />
      </svg>
    )
  }

  if (shape === 'bracket') {
    /* L-bracket corner marks — editorial layout registration marks */
    const transforms: Record<BracketCorner, string> = {
      tl: '',
      tr: 'scale(-1, 1) translate(-100, 0)',
      bl: 'scale(1, -1) translate(0, -100)',
      br: 'scale(-1, -1) translate(-100, -100)',
    }

    return (
      <svg
        viewBox="0 0 100 100"
        className={cn('pointer-events-none', sizeClass, className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g transform={transforms[corner]}>
          {/* Vertical arm */}
          <line x1="20" y1="20" x2="20" y2="50" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={opacity} />
          {/* Horizontal arm */}
          <line x1="20" y1="20" x2="50" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={opacity} />
        </g>
      </svg>
    )
  }

  if (shape === 'arc-sweep') {
    /*
     * A single graceful arc — not a circle, just one flowing curve.
     * Creates a sense of movement or a directional gesture.
     * Arc goes from bottom-left to top-right with a wide, gentle curve.
     */
    return (
      <svg
        viewBox="0 0 100 100"
        className={cn('pointer-events-none', sizeClass, className)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={`arc-sweep-fade-${color.replace('#', '')}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0} />
            <stop offset="40%" stopColor={color} stopOpacity={opacity} />
            <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.5} />
          </linearGradient>
        </defs>
        <path
          d="M 10,88 Q 50,10 90,15"
          stroke={`url(#arc-sweep-fade-${color.replace('#', '')})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return null
}
