/**
 * BlobMask
 *
 * Wraps children in an organically shaped container using multi-value
 * border-radius. The shapes are percentage-based and scale correctly
 * at any size — safe for images, tinted panels, and decorative divs.
 *
 * All shapes use the two-value border-radius shorthand:
 *   TL TR BR BL / TL-y TR-y BR-y BL-y
 *
 * Usage:
 *   <BlobMask shape="pebble" className="w-48 h-48 bg-brand-gold/20">
 *     <img src="…" alt="…" className="h-full w-full object-cover" />
 *   </BlobMask>
 *
 *   // Animated morph between shapes (opt-in via animate prop):
 *   <BlobMask shape="pebble" animate className="…">
 *     …
 *   </BlobMask>
 */

import { cn } from '@/lib/utils'

export type BlobShape =
  | 'pebble'    // Balanced organic oval
  | 'soft'      // Nearly rectangular — barely organic
  | 'arc-cut'   // Strong bite from top-right; directional
  | 'teardrop'  // Widens at base, tapers top-right
  | 'lens'      // Horizontal eye / cinematic crop
  | 'slab'      // Rectangular top, organic bottom

const BLOB_RADIUS: Record<BlobShape, string> = {
  pebble:   '58% 42% 55% 45% / 48% 52% 42% 56%',
  soft:     '52% 48% 54% 46% / 46% 54% 48% 52%',
  'arc-cut':'82% 18% 66% 34% / 38% 62% 26% 74%',
  teardrop: '70% 30% 62% 38% / 28% 72% 38% 62%',
  lens:     '50% 50% 50% 50% / 35% 35% 65% 65%',
  slab:     '0.5rem 0.5rem 68% 32% / 0.5rem 0.5rem 42% 58%',
}

/**
 * When animate=true a very slow CSS transition between two slightly
 * different border-radius states creates an organic living quality.
 * Uses a CSS animation defined in the component's inline style.
 */
const BLOB_ANIMATE_STYLE = (shape: BlobShape): React.CSSProperties => {
  const morphTargets: Partial<Record<BlobShape, string>> = {
    pebble:   '55% 45% 58% 42% / 52% 48% 56% 44%',
    soft:     '48% 52% 52% 48% / 50% 50% 46% 54%',
    teardrop: '68% 32% 60% 40% / 32% 68% 42% 58%',
  }
  const target = morphTargets[shape]
  if (!target) return {}

  return {
    animation: `blob-morph-${shape} 18s ease-in-out infinite alternate`,
  }
}

interface BlobMaskProps {
  shape?: BlobShape
  /** Slowly morphs between two closely-related border-radius states */
  animate?: boolean
  className?: string
  children?: React.ReactNode
  as?: React.ElementType
}

export function BlobMask({
  shape = 'pebble',
  animate = false,
  className,
  children,
  as: Tag = 'div',
}: BlobMaskProps) {
  const radius = BLOB_RADIUS[shape]
  const animStyle = animate ? BLOB_ANIMATE_STYLE(shape) : {}

  return (
    <>
      {animate && (
        <style>{`
          @keyframes blob-morph-pebble {
            from { border-radius: 58% 42% 55% 45% / 48% 52% 42% 56%; }
            to   { border-radius: 55% 45% 58% 42% / 52% 48% 56% 44%; }
          }
          @keyframes blob-morph-soft {
            from { border-radius: 52% 48% 54% 46% / 46% 54% 48% 52%; }
            to   { border-radius: 48% 52% 52% 48% / 50% 50% 46% 54%; }
          }
          @keyframes blob-morph-teardrop {
            from { border-radius: 70% 30% 62% 38% / 28% 72% 38% 62%; }
            to   { border-radius: 68% 32% 60% 40% / 32% 68% 42% 58%; }
          }
        `}</style>
      )}
      <Tag
        className={cn('overflow-hidden', className)}
        style={{ borderRadius: radius, ...animStyle }}
      >
        {children}
      </Tag>
    </>
  )
}
