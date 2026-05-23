'use client'

/**
 * AmbientField
 *
 * Framer Motion ambient motion component. Renders an atmospheric radial
 * gradient that moves so slowly you notice it after watching for several
 * seconds — like watching light shift in a room.
 *
 * Variants:
 *   drift    — A warm gradient pool slowly wanders within its container.
 *              20-second cycle. Best for hero/art panel backgrounds.
 *
 *   breathe  — The field gently expands and contracts in scale/opacity.
 *              22-second cycle. Best for CTA areas or call-out sections.
 *
 *   shimmer  — Opacity pulses very slowly, evoking heat haze or candlelight.
 *              18-second cycle. Subtlest variant — safe to use broadly.
 *
 * Design rules:
 *   — Motion displacement: max 12% of container
 *   — Opacity range: 0.6–1.0 (never fully transparent, never fully opaque)
 *   — Duration minimum: 18 seconds
 *   — Use pointer-events: none (always)
 *   — The element is inset: -30% to prevent edge cutoff during drift
 *
 * Usage:
 *   <div className="relative overflow-hidden">
 *     <AmbientField variant="drift" palette="gold" />
 *     <div className="relative z-10">…content…</div>
 *   </div>
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type AmbientVariant = 'drift' | 'breathe' | 'shimmer'
type AmbientPalette = 'gold' | 'ember' | 'cream' | 'cocoa'

interface PaletteConfig {
  /** The core radial gradient definition */
  gradient: string
  /** Base opacity for the field */
  baseOpacity: number
}

const PALETTE_CONFIGS: Record<AmbientPalette, PaletteConfig> = {
  gold: {
    gradient: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(250,182,66,0.35) 0%, rgba(250,182,66,0.10) 45%, transparent 70%)',
    baseOpacity: 0.85,
  },
  ember: {
    gradient: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(227,75,22,0.28) 0%, rgba(227,75,22,0.08) 45%, transparent 70%)',
    baseOpacity: 0.80,
  },
  cream: {
    gradient: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(247,232,190,0.50) 0%, rgba(247,232,190,0.15) 50%, transparent 72%)',
    baseOpacity: 0.75,
  },
  cocoa: {
    gradient: 'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(122,51,27,0.22) 0%, rgba(122,51,27,0.06) 45%, transparent 68%)',
    baseOpacity: 0.80,
  },
}

interface AmbientFieldProps {
  variant?: AmbientVariant
  palette?: AmbientPalette
  /** Override base opacity. Keep ≤ 1.0. */
  opacity?: number
  className?: string
}

export function AmbientField({
  variant = 'drift',
  palette = 'gold',
  opacity,
  className,
}: AmbientFieldProps) {
  const config = PALETTE_CONFIGS[palette]
  const baseOpacity = opacity ?? config.baseOpacity

  /*
   * The animated element extends 30% beyond the container on all sides.
   * This prevents any hard edge from becoming visible during drift.
   * The parent must have overflow: hidden for this to work correctly.
   */
  const extendedStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '-30%',
    background: config.gradient,
  }

  if (variant === 'drift') {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        aria-hidden
      >
        <motion.div
          style={extendedStyle}
          initial={{ x: 0, y: 0, opacity: baseOpacity }}
          animate={{
            x: ['0%', '8%', '-6%', '5%', '-4%', '3%', '0%'],
            y: ['0%', '-6%', '9%', '-5%', '7%', '-3%', '0%'],
            opacity: [baseOpacity, baseOpacity * 1.08, baseOpacity * 0.92, baseOpacity * 1.04, baseOpacity * 0.96, baseOpacity],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </div>
    )
  }

  if (variant === 'breathe') {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        aria-hidden
      >
        <motion.div
          style={extendedStyle}
          initial={{ scale: 1, opacity: baseOpacity * 0.88 }}
          animate={{
            scale:   [1, 1.055, 0.975, 1.035, 0.990, 1],
            opacity: [baseOpacity * 0.88, baseOpacity, baseOpacity * 0.82, baseOpacity * 0.96, baseOpacity * 0.85, baseOpacity * 0.88],
          }}
          transition={{
            duration: 22,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </div>
    )
  }

  /* shimmer — opacity pulse only, no positional movement */
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <motion.div
        style={{ ...extendedStyle, inset: 0, position: 'absolute' }}
        initial={{ opacity: baseOpacity * 0.70 }}
        animate={{
          opacity: [
            baseOpacity * 0.70,
            baseOpacity,
            baseOpacity * 0.78,
            baseOpacity * 0.95,
            baseOpacity * 0.72,
            baseOpacity * 0.70,
          ],
        }}
        transition={{
          duration: 18,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  )
}
