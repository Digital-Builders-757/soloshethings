/**
 * GrainOverlay
 *
 * SVG feTurbulence-based paper grain. Renders as an absolutely positioned
 * (or fixed) overlay using inline SVG with a filter applied to a rect.
 *
 * The grain uses fractalNoise (organic, non-repeating pattern) desaturated
 * to neutral grey — reads as warm paper grain on the brand's cream palette.
 *
 * Usage:
 *   <div className="relative">
 *     <GrainOverlay intensity="subtle" />
 *     <div className="relative z-10">…content…</div>
 *   </div>
 *
 *   // Fixed grain covering the whole viewport (page-level texture):
 *   <GrainOverlay intensity="subtle" position="fixed" className="z-50" />
 */

import { cn } from '@/lib/utils'

type GrainIntensity = 'subtle' | 'medium' | 'press'
type GrainPosition = 'absolute' | 'fixed'

interface GrainConfig {
  baseFrequency: number
  numOctaves: number
  opacity: number
  /** Tile size in pixels — smaller = finer grain */
  tileSize: number
}

const GRAIN_CONFIGS: Record<GrainIntensity, GrainConfig> = {
  /**
   * Subtle — barely perceptible warmth.
   * Works on cream and very light sections.
   */
  subtle: { baseFrequency: 0.65, numOctaves: 3, opacity: 0.016, tileSize: 300 },

  /**
   * Medium — readable as paper/print texture.
   * Good on orange/gold fields and mid-tone sections.
   */
  medium: { baseFrequency: 0.72, numOctaves: 4, opacity: 0.030, tileSize: 260 },

  /**
   * Press — visible print grain, like a risograph or letterpress.
   * Use on dark cocoa/brown sections only.
   */
  press: { baseFrequency: 0.80, numOctaves: 4, opacity: 0.048, tileSize: 220 },
}

/**
 * Static filter IDs scoped per intensity variant. Safe since only one
 * of each intensity typically appears per document; SVG filters are
 * scoped within their parent SVG and do not bleed across elements.
 */
const FILTER_IDS: Record<GrainIntensity, string> = {
  subtle: 'sse-grain-subtle',
  medium: 'sse-grain-medium',
  press:  'sse-grain-press',
}

interface GrainOverlayProps {
  intensity?: GrainIntensity
  position?: GrainPosition
  className?: string
}

export function GrainOverlay({
  intensity = 'subtle',
  position = 'absolute',
  className,
}: GrainOverlayProps) {
  const config = GRAIN_CONFIGS[intensity]
  const filterId = FILTER_IDS[intensity]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'pointer-events-none h-full w-full',
        position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0',
        className
      )}
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={config.baseFrequency}
            numOctaves={config.numOctaves}
            stitchTiles="stitch"
          />
          {/* Desaturate to neutral — reads as warm grain on brand palette */}
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        opacity={config.opacity}
      />
    </svg>
  )
}
