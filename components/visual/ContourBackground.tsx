/**
 * ContourBackground
 *
 * Topographic contour-line background — concentric ellipses, slightly tilted
 * and off-center, evoking an artistic topographic map. Ultra subtle.
 *
 * Designed to sit as an absolute-positioned overlay inside a position:relative
 * container. Content renders above it via z-index 1+.
 *
 * Usage:
 *   <div className="relative">
 *     <ContourBackground variant="warm" />
 *     <div className="relative z-10">…content…</div>
 *   </div>
 */

import { cn } from '@/lib/utils'

type ContourVariant = 'warm' | 'cream' | 'gold' | 'ember'
type ContourDensity = 3 | 4 | 5 | 6

interface RingConfig {
  rx: number
  ry: number
  opacity: number
}

interface VariantConfig {
  stroke: string
  rings: RingConfig[]
  /** SVG 0–100 coordinate space; offset from center for organic asymmetry */
  cx: number
  cy: number
  /** Global rotation applied to the ring group, degrees */
  rotation: number
}

const VARIANT_CONFIGS: Record<ContourVariant, VariantConfig> = {
  /**
   * Warm — brown strokes on light/cream backgrounds.
   * Inner rings subtly more opaque, as if the contour climbs toward a hill.
   */
  warm: {
    stroke: '#7a331b',
    rings: [
      { rx: 54, ry: 41, opacity: 0.030 },
      { rx: 46, ry: 34, opacity: 0.038 },
      { rx: 37, ry: 26, opacity: 0.046 },
      { rx: 29, ry: 19, opacity: 0.052 },
      { rx: 21, ry: 12, opacity: 0.060 },
      { rx: 13, ry:  7, opacity: 0.066 },
    ],
    cx: 44, cy: 47, rotation: -8,
  },

  /**
   * Cream — pale strokes on dark/orange panels.
   * Higher opacity to show against dark backgrounds.
   */
  cream: {
    stroke: '#f7e8be',
    rings: [
      { rx: 54, ry: 41, opacity: 0.06 },
      { rx: 46, ry: 34, opacity: 0.08 },
      { rx: 37, ry: 26, opacity: 0.09 },
      { rx: 29, ry: 19, opacity: 0.10 },
      { rx: 21, ry: 12, opacity: 0.11 },
      { rx: 13, ry:  7, opacity: 0.12 },
    ],
    cx: 44, cy: 47, rotation: -8,
  },

  /**
   * Gold — amber strokes for warm accent sections.
   */
  gold: {
    stroke: '#fab642',
    rings: [
      { rx: 54, ry: 41, opacity: 0.045 },
      { rx: 46, ry: 34, opacity: 0.055 },
      { rx: 37, ry: 26, opacity: 0.065 },
      { rx: 29, ry: 19, opacity: 0.072 },
      { rx: 21, ry: 12, opacity: 0.080 },
      { rx: 13, ry:  7, opacity: 0.088 },
    ],
    cx: 44, cy: 47, rotation: -8,
  },

  /**
   * Ember — orange strokes; for use on lighter sections needing warm drama.
   */
  ember: {
    stroke: '#e34b16',
    rings: [
      { rx: 54, ry: 41, opacity: 0.038 },
      { rx: 46, ry: 34, opacity: 0.048 },
      { rx: 37, ry: 26, opacity: 0.056 },
      { rx: 29, ry: 19, opacity: 0.064 },
      { rx: 21, ry: 12, opacity: 0.072 },
      { rx: 13, ry:  7, opacity: 0.078 },
    ],
    cx: 44, cy: 47, rotation: -8,
  },
}

interface ContourBackgroundProps {
  variant?: ContourVariant
  /**
   * Number of concentric rings to render.
   * Uses the outermost N rings from the variant's ring config.
   */
  density?: ContourDensity
  /**
   * Stroke weight in SVG units (viewBox is 0–100).
   * 0.14 ≈ a hair-line at most viewport sizes.
   */
  strokeWidth?: number
  className?: string
}

export function ContourBackground({
  variant = 'warm',
  density = 5,
  strokeWidth = 0.15,
  className,
}: ContourBackgroundProps) {
  const config = VARIANT_CONFIGS[variant]
  const rings = config.rings.slice(0, density)
  const groupId = `contour-group-${variant}`

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
      aria-hidden
    >
      <g
        id={groupId}
        transform={`rotate(${config.rotation}, ${config.cx}, ${config.cy})`}
      >
        {rings.map((ring, i) => (
          <ellipse
            key={i}
            cx={config.cx}
            cy={config.cy}
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke={config.stroke}
            strokeWidth={strokeWidth}
            opacity={ring.opacity}
          />
        ))}
      </g>
    </svg>
  )
}
