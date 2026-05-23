/**
 * Visual Identity System — Solo SHE Things
 *
 * A reusable library of editorial atmosphere components.
 * Inspired by topographic maps, retro editorial layouts, warm print aesthetics,
 * and modern cultural storytelling brands.
 *
 * Components:
 *   ContourBackground  — Topographic concentric ring SVG (server)
 *   GrainOverlay       — SVG turbulence paper grain (server)
 *   BlobMask           — Organic border-radius shape wrapper (server)
 *   SectionDivider     — Editorial SVG section dividers (server)
 *   GeometryAccent     — Asymmetric decorative SVG geometry (server)
 *   AmbientField       — Ambient Framer Motion gradient field (client)
 *
 * CSS utilities (import app/styles/contour-system.css in layout.tsx):
 *   .radial-warm-gold      — Gold bloom, top-left
 *   .radial-ember-corner   — Orange pool, bottom-right
 *   .radial-dusk           — Multi-point evening warmth
 *   .radial-deep-hearth    — Dark hearth with gold ember
 *   .radial-cream-mist     — Pale mist for depth on white
 *   .blob-pebble / .blob-soft / .blob-arc-cut / .blob-teardrop / .blob-lens / .blob-slab
 *   .grain-subtle::before / .grain-medium::before / .grain-press::before
 *   .ambient-drift / .ambient-breathe / .ambient-shimmer / .ambient-orbit
 *   .divider-horizon / .divider-feather / .divider-double
 *   .geo-corner-anchor / .geo-corner-anchor-tr
 *   .drop-cap / .run-in-head / .pull-quote
 */

export { ContourBackground } from './ContourBackground'
export type { } from './ContourBackground'

export { GrainOverlay } from './GrainOverlay'

export { BlobMask } from './BlobMask'
export type { BlobShape } from './BlobMask'

export { SectionDivider } from './SectionDivider'

export { GeometryAccent } from './GeometryAccent'

export { AmbientField } from './AmbientField'
