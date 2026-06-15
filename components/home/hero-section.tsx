'use client'

import { useRef, useLayoutEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

import {
  usePrefersReducedMotion,
  useWindowDimensions,
} from '@/lib/hooks/use-client-media'

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroSection — card-to-viewport expansion animation
 *
 * Reference animation (Wollo-style):
 *  Frame 1–2  : Static hero. Heading, CTAs, three-layer tilted card stack.
 *  Frame 3    : Heading exits, yellow/pink cards fade, purple card begins rising.
 *  Frame 4–5  : Card top approaches viewport top, rotation unwinds, radius shrinks.
 *  Frame 6    : Card fills 100 % of viewport edge-to-edge, rotation = 0, radius = 0.
 *  Frame 7–12 : Full-screen card. Content inside parallaxes. Next section rises below.
 *
 * ─── Animation mechanism ─────────────────────────────────────────────────────
 *
 * The card gets `position: fixed` at its initial viewport position (measured via
 * getBoundingClientRect at mount), then its `top`, `left`, `width`, `height`
 * are animated to 0 / 0 / 100vw / 100vh.
 *
 * This approach (vs CSS scale) gives clean border-radius animation with no
 * scale-multiplication artifact: 100px → 0px animates exactly as it looks.
 *
 * ─── Ref map ─────────────────────────────────────────────────────────────────
 *
 *  sectionRef    → <section>                           ScrollTrigger pin trigger
 *  contentRef    → heading + CTA wrapper               opacity 0, y -30
 *  yellowRef     → yellow background card              opacity 0 (early exit)
 *  pinkRef       → pink middle card                    opacity 0 (early exit)
 *  cardRef       → div.relative.z-[3]                  scale → viewport fill
 *  clipRef       → div.overflow-hidden.rounded-[100px] rotation → 0, borderRadius → 0
 *  imageRef      → typography card wrapper             (outer shell, untouched)
 *  fromLeftRef   → "FR" half of FROM                  Phase 3: slides left
 *  fromRightRef  → "OM" half of FROM                  Phase 3: slides right
 *  creamEnvironmentRef  → cream sheet growing from card bounds (z-10)
 *  compositionAnchorRef → shared centre point at correctionX
 *  galleryStageRef       → editorial working canvas (min 900px tall)
 *  galleryViewportRef    → 1600×700 composition window
 *  creamContinuationRef  → editorial breathing room (same cream world, in-flow tail)
 *
 * ─── Scroll budget ───────────────────────────────────────────────────────────
 *
 *  pin end: +=1200% — 6.0× timeline units × 200vh/unit (Phases 1–3 = 2.0, creamGallery = 4.0).
 *  scrub: 1        — 1 s smoothing lag for premium deceleration feel.
 *  prefers-reduced-motion: no animation, no pin.
 *  gsap.context() scoped to sectionRef — fully reverts on unmount.
 *
 * All static layout values (spacing, rotations, colors, sizes) are unchanged.
 */

// ── Gallery layout constants ────────────────────────────────────────────────
// All values are in pre-scale element space (inside the GSAP-scaled cardRef).
// After Phase 2 expansion, every pixel here is multiplied by `scale`.
const CARD_W          = 140   // gallery card width  (px, pre-scale)
const CARD_H          = 170   // gallery card height (px, pre-scale)
const CREAM_SEED_W    = 200   // cream gap seed width  (px, pre-scale)
const CREAM_SEED_H    = 150   // cream gap seed height (px, pre-scale)

// Editorial stage — canvas grows; card dimensions stay fixed.
const GALLERY_STAGE_MIN_H  = 900
const GALLERY_VIEWPORT_W   = 1600
const GALLERY_VIEWPORT_H   = 700

// Depth tiers — far / mid / near (six side cards only; centre stays open for headline).
type DepthTier = 'far' | 'mid' | 'near'

const DEPTH_TIERS: Record<
  DepthTier,
  { scale: number; opacity: number; parallaxY: number; z: number }
> = {
  far:  { scale: 0.82, opacity: 0.55, parallaxY: 140, z: 12 },
  mid:  { scale: 0.90, opacity: 0.75, parallaxY: 80,  z: 14 },
  near: { scale: 0.96, opacity: 0.92, parallaxY: 40,  z: 16 },
}


// Six side slots — centre anchor stays empty for headline text.
interface GallerySideSlot {
  id:   number
  tier: DepthTier
  x:    number
  y:    number
}

// Serve-style spread — three columns per side (outer · mid · inner near headline).
// X increases right; Y increases down. Centre (0,0) stays open for headline.
const GALLERY_SIDE_SLOTS: GallerySideSlot[] = [
  { id: 1, tier: 'near', x:  -260, y: -215 }, // TOP LEFT    — mid column
  { id: 5, tier: 'mid',  x:  -635, y:   25 }, // MID LEFT    — outer column (furthest left)
  { id: 6, tier: 'near', x:  -255, y:  285 }, // BOTTOM LEFT — inner column (closest to text)
  { id: 3, tier: 'near', x:   380, y: -225 }, // TOP RIGHT   — inner column
  { id: 4, tier: 'mid',  x:   755, y:   45 }, // MID RIGHT   — outer column (furthest right)
  { id: 7, tier: 'near', x:   455, y:  275 }, // BOTTOM RIGHT — mid column
]

/**
 * Mobile gallery slots — separate from desktop; edit x/y here (pre-scale px).
 * Reference viewport: 390×844 → canvas 390×742 (vh × 0.88, min 620).
 * Positions scale proportionally on other phone sizes from this reference.
 *
 * Card id → label:
 *   1 TOP LEFT · 5 MID LEFT · 6 BOTTOM LEFT
 *   3 TOP RIGHT · 4 MID RIGHT · 7 BOTTOM RIGHT
 */
const MOBILE_GALLERY_REF_VW = 390
const MOBILE_GALLERY_REF_VH = 742 // Math.max(Math.round(844 * 0.88), 620)

const GALLERY_MOBILE_SIDE_SLOTS: GallerySideSlot[] = [
  { id: 1, tier: 'near', x: -55, y: -273 }, // TOP LEFT
  { id: 5, tier: 'mid',  x: -166, y:  -22 }, // MID LEFT
  { id: 6, tier: 'near', x: -55, y:  223 }, // BOTTOM LEFT
  { id: 3, tier: 'near', x:  133, y: -273 }, // TOP RIGHT
  { id: 4, tier: 'mid',  x:  188, y:   -73 }, // MID RIGHT
  { id: 7, tier: 'near', x:  119, y:  208 }, // BOTTOM RIGHT
]

function buildMobileGallerySlots(vw: number, viewportH: number): GallerySideSlot[] {
  const scaleX = vw / MOBILE_GALLERY_REF_VW
  const scaleY = viewportH / MOBILE_GALLERY_REF_VH

  return GALLERY_MOBILE_SIDE_SLOTS.map((slot) => ({
    ...slot,
    x: Math.round(slot.x * scaleX),
    y: Math.round(slot.y * scaleY),
  }))
}

// Cream editorial continuation — in-flow scroll room, visually flush with gallery cream.
const CREAM_CONTINUATION_MIN_H = 1200
const CREAM_COLOR              = '#fffaf0'
/** Slight extra scale so the expanded card covers the right-edge dark-hero sliver. */
const COVER_SCALE_BLEED        = 1.045

// Card cluster lift — upper ~32.5 % of visible cream (computed from hero height at runtime).
const COMPOSITION_BAND_FROM_TOP = 0.325

// Serve-style upward corridor — cards + headline rise from below (Y-only, no fade).
const SCROLL_VH_PER_UNIT       = 200
const PARALLAX_CORRIDOR_VH     = 280
const PARALLAX_CORRIDOR_DUR    = PARALLAX_CORRIDOR_VH / SCROLL_VH_PER_UNIT
const GALLERY_CORRIDOR_DUR     = PARALLAX_CORRIDOR_DUR + 0.65
const GALLERY_CARD_STAGGER     = 0.06
/** Post-spread exit scroll window (creamGallery timeline units). */
const GALLERY_EXIT_DUR         = 0.36
/** Upward drift during post-spread exit (pre-scale px). */
const GALLERY_EXIT_DRIFT_Y     = 360

/** Tier multipliers for below-viewport entry distance. */
const GALLERY_ENTRY_TIER_MULT: Record<DepthTier, number> = {
  near: 1,
  mid:  0.88,
  far:  0.76,
}

/** Upward travel during corridor — near moves fastest. */
const PARALLAX_CORRIDOR: Record<DepthTier, number> = {
  near: 380,
  mid:  270,
  far:  190,
}

/** Cream field drifts upward with the corridor. */
const ENVIRONMENT_DRIFT_Y      = -48
const STAGE_DRIFT              = 90
/** Extra lift so headline sits in the optical centre of the card ring at rest. */
const HEADING_OPTICAL_LIFT     = 55

/** Per-card corridor tuning — duration mult (<1 = faster), optional start offset. */
const GALLERY_CARD_CORRIDOR: Partial<
  Record<number, { durationMult: number; startAt?: number }>
> = {
  3: { durationMult: 1 / 1.1 }, // TOP RIGHT — 10% faster
  6: { durationMult: 1.1 },       // BOTTOM LEFT — 10% slower
}

/** Mobile gallery uses lg (1024) — matches hero max-lg / desktop split. */
const GALLERY_DESKTOP_BREAKPOINT = 1024

interface GalleryLayoutProfile {
  slots: GallerySideSlot[]
  cardW: number
  cardH: number
  viewportW: number
  viewportH: number
  stageMinH: number
  parallaxCorridor: Record<DepthTier, number>
  compositionBandFromTop: number
  creamContinuationH: number
  galleryExitDriftY: number
}

function isGalleryDesktop(vw: number): boolean {
  return vw >= GALLERY_DESKTOP_BREAKPOINT
}

/** Serve-style mobile spread — smaller cards at viewport edges; desktop unchanged. */
function getGalleryLayoutProfile(vw: number, vh: number): GalleryLayoutProfile {
  if (isGalleryDesktop(vw)) {
    return {
      slots: GALLERY_SIDE_SLOTS,
      cardW: CARD_W,
      cardH: CARD_H,
      viewportW: GALLERY_VIEWPORT_W,
      viewportH: GALLERY_VIEWPORT_H,
      stageMinH: GALLERY_STAGE_MIN_H,
      parallaxCorridor: PARALLAX_CORRIDOR,
      compositionBandFromTop: COMPOSITION_BAND_FROM_TOP,
      creamContinuationH: CREAM_CONTINUATION_MIN_H,
      galleryExitDriftY: GALLERY_EXIT_DRIFT_Y,
    }
  }

  const viewportW = vw
  const viewportH = Math.max(Math.round(vh * 0.88), 620)
  const cardW = Math.round(Math.min(115, vw * 0.275))
  const cardH = Math.round(cardW * 1.22)

  return {
    slots: buildMobileGallerySlots(vw, viewportH),
    cardW,
    cardH,
    viewportW,
    viewportH,
    stageMinH: viewportH + 160,
    parallaxCorridor: { near: 220, mid: 155, far: 105 },
    compositionBandFromTop: 0.38,
    creamContinuationH: 720,
    galleryExitDriftY: 260,
  }
}

/** SSR + hydration must share this — viewport sync runs in useLayoutEffect after mount. */
const DESKTOP_LAYOUT_PROFILE = getGalleryLayoutProfile(GALLERY_DESKTOP_BREAKPOINT, 900)

// ── Gallery card data ───────────────────────────────────────────────────────
// Six side cards in the spread collage.
interface GalleryCardData {
  id:          number
  location:    string
  titleLine1:  string
  titleLine2:  string
  description: string
  src:         string
  alt:         string
}

const GALLERY_CARDS: GalleryCardData[] = [
  {
    id: 1,
    location:    'Himalayas, India',
    titleLine1:  'Finding Stillness',
    titleLine2:  'at 4,000m',
    description: 'A week alone in the mountains changed how I see solitude forever.',
    src:         'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=480&fit=crop&auto=format',
    alt:         'Mountain range at golden hour',
  },
  {
    id: 3,
    location:    'Tokyo, Japan',
    titleLine1:  'Lost & Found',
    titleLine2:  'in Tokyo',
    description: 'How getting lost in a foreign city became my favourite kind of adventure.',
    src:         'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=640&h=480&fit=crop&auto=format',
    alt:         'City skyline at dusk',
  },
  {
    id: 4,
    location:    'Bali, Indonesia',
    titleLine1:  'Rice Fields',
    titleLine2:  '& Silence',
    description: 'Three days without Wi-Fi in a Balinese village taught me to breathe again.',
    src:         'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=640&h=480&fit=crop&auto=format',
    alt:         'Bali rice terraces',
  },
  {
    id: 5,
    location:    'Patagonia, Chile',
    titleLine1:  'At the Edge',
    titleLine2:  'of the World',
    description: 'Solo trekking Torres del Paine: what fear, beauty and blisters taught me.',
    src:         'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?w=640&h=480&fit=crop&auto=format',
    alt:         'Patagonia mountain landscape',
  },
  {
    id: 6,
    location:    'Marrakech, Morocco',
    titleLine1:  'Medina Nights',
    titleLine2:  'in Marrakech',
    description: 'Navigating souks, mint tea, and my own courage in one afternoon.',
    src:         'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=640&h=480&fit=crop&auto=format',
    alt:         'Marrakech medina alley',
  },
  {
    id: 7,
    location:    'Kyoto, Japan',
    titleLine1:  'Temples, Tea',
    titleLine2:  '& Solitude',
    description: 'Waking before sunrise to walk bamboo groves alone — a gift I gave myself.',
    src:         'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=640&h=480&fit=crop&auto=format',
    alt:         'Kyoto bamboo forest',
  },
]


const SLOT_LABELS: Record<number, string> = {
  1: 'TOP LEFT',
  5: 'MID LEFT',
  6: 'BOTTOM LEFT',
  3: 'TOP RIGHT',
  4: 'MID RIGHT',
  7: 'BOTTOM RIGHT',
}

/** Dev-only — logs rendered vs expected slot coordinates and continuation blockers. */
function auditGalleryLayout(deps: {
  compositionAnchor: HTMLElement
  cardEl:            HTMLElement
  clipEl:            HTMLElement
  darkHero:          HTMLElement
  section:           HTMLElement
  galleryStage:      HTMLElement
  galleryViewport:   HTMLElement
  galleryComposition: HTMLElement
  creamContinuation: HTMLElement
  compositionYOffset: number
  slots: GallerySideSlot[]
}) {
  if (process.env.NODE_ENV === 'production') return

  const anchorCx =
    deps.compositionAnchor.getBoundingClientRect().left
    + deps.compositionAnchor.getBoundingClientRect().width / 2

  const cardScale = Number(gsap.getProperty(deps.cardEl, 'scale')) || 1

  const cardRows = deps.slots.map(({ id, x, tier }) => {
    const el = deps.galleryComposition.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!
    const gsapX   = Number(gsap.getProperty(el, 'x'))
    const gsapY   = Number(gsap.getProperty(el, 'y'))
    const elScale = Number(gsap.getProperty(el, 'scale'))
    const rect    = el.getBoundingClientRect()
    const renderedX = rect.left + rect.width / 2 - anchorCx

    return {
      label:      SLOT_LABELS[id] ?? `id ${id}`,
      expectedX:  x,
      gsapX,
      gsapY,
      gsapScale:  elScale,
      renderedX:  Math.round(renderedX),
      deltaX:     Math.round(renderedX - x),
      tier,
    }
  })

  const contRect = deps.creamContinuation.getBoundingClientRect()
  const contStyles = getComputedStyle(deps.creamContinuation)

  console.group('[Gallery Layout Audit]')
  console.table(cardRows)
  console.log('Composition anchor', {
    compositionYOffset: deps.compositionYOffset,
  })
  console.log('Transform chain', {
    cardRefScale: cardScale,
    clipOverflow: getComputedStyle(deps.clipEl).overflow,
    darkHeroOverflow: getComputedStyle(deps.darkHero).overflow,
    sectionOverflow: getComputedStyle(deps.section).overflow,
    galleryStageOverflow: getComputedStyle(deps.galleryStage).overflow,
    galleryViewportOverflow: getComputedStyle(deps.galleryViewport).overflow,
  })
  console.group('[Cream Continuation Blockers]')
  console.log({
    gsapAutoAlpha:     gsap.getProperty(deps.creamContinuation, 'autoAlpha'),
    cssVisibility:     contStyles.visibility,
    cssDisplay:        contStyles.display,
    cssOpacity:        contStyles.opacity,
    rectTop:           Math.round(contRect.top),
    rectHeight:        Math.round(contRect.height),
    inViewport:        contRect.top < window.innerHeight && contRect.bottom > 0,
    insidePinnedCard:  true,
    documentFlowNote:  'Inside compositionAnchor — shares cardRef transform; invScale applied',
    likelyBlockers: [
      Number(gsap.getProperty(deps.creamContinuation, 'autoAlpha')) === 0 && 'autoAlpha:0 until t=1.0',
      getComputedStyle(deps.section).overflow === 'hidden' && 'section overflow:hidden — set visible at t=1.0',
      contRect.top > window.innerHeight && 'continuation top below viewport fold',
    ].filter(Boolean),
  })
  console.groupEnd()
  console.groupEnd()
}

interface GallerySideCardProps {
  card: GalleryCardData
  cardW: number
  cardH: number
}

function GallerySideCard({ card, cardW, cardH }: GallerySideCardProps) {
  const slot = GALLERY_SIDE_SLOTS.find((s) => s.id === card.id)
  const tierCfg = slot ? DEPTH_TIERS[slot.tier] : DEPTH_TIERS.mid

  return (
    <div
      data-side-card
      className="group absolute left-1/2 top-1/2 overflow-hidden rounded-xl shadow-2xl max-lg:rounded-[3px]"
      style={{
        width:  `${cardW}px`,
        height: `${cardH}px`,
        zIndex: tierCfg.z,
      }}
      data-card-id={card.id}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.src}
        alt={card.alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 flex translate-y-2 flex-col rounded-b-xl p-5 pt-10 font-navbar-jakarta normal-case leading-normal tracking-normal opacity-0 backdrop-blur-[6px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-lg:rounded-b-[3px]">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70">
          {card.location}
        </p>
        <h3 className="mt-4 text-base font-medium leading-snug text-white">
          {card.titleLine1}<br />{card.titleLine2}
        </h3>
        <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-white/80">
          {card.description}
        </p>
        <span className="mt-4 text-[11px] font-semibold text-white">
          Read Story →
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const heroSurfaceRef = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const yellowRef    = useRef<HTMLDivElement>(null)
  const pinkRef      = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const clipRef      = useRef<HTMLDivElement>(null)
  const imageRef     = useRef<HTMLDivElement>(null)
  const fromLeftRef           = useRef<HTMLSpanElement>(null)
  const fromRightRef          = useRef<HTMLSpanElement>(null)
  const darkHeroRef           = useRef<HTMLDivElement>(null)
  const compositionAnchorRef  = useRef<HTMLDivElement>(null)
  const creamEnvironmentRef   = useRef<HTMLDivElement>(null)
  const galleryHeadingRef     = useRef<HTMLHeadingElement>(null)
  const galleryStageRef       = useRef<HTMLDivElement>(null)
  const galleryViewportRef    = useRef<HTMLDivElement>(null)
  const galleryCompositionRef = useRef<HTMLDivElement>(null)
  const creamContinuationRef  = useRef<HTMLDivElement>(null)
  const realStoriesRef        = useRef<HTMLSpanElement>(null)
  const soloSHEsRef           = useRef<HTMLSpanElement>(null)

  const [layout, setLayout] = useState<GalleryLayoutProfile>(DESKTOP_LAYOUT_PROFILE)
  const prefersReducedMotion = usePrefersReducedMotion()
  const staticDimensions = useWindowDimensions({ live: false })
  const staticLayout = useMemo(
    () =>
      getGalleryLayoutProfile(staticDimensions.width, staticDimensions.height),
    [staticDimensions.width, staticDimensions.height],
  )
  const displayLayout = prefersReducedMotion ? staticLayout : layout

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    let activeDesktop = isGalleryDesktop(window.innerWidth)
    let ctx: gsap.Context | undefined

    const runSetup = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const profile = getGalleryLayoutProfile(vw, vh)

      ctx?.revert()
      ctx = gsap.context(() => {
      const {
        slots: gallerySlots,
        cardH,
        viewportH,
        parallaxCorridor,
        compositionBandFromTop,
        creamContinuationH,
        galleryExitDriftY,
      } = profile

      const card = cardRef.current!
      const clip = clipRef.current!

      /**
       * Measure position at scroll = 0.
       * The hero section is always at the top of the page so this is correct.
       * We do NOT touch position/display — the card stays in normal flow.
       * ScrollTrigger measures the section correctly before any mutation.
       */
      const rect = card.getBoundingClientRect()

      /**
       * Pure-transform expansion — cover-fill, viewport-centered.
       *
       * transformOrigin 'top left' keeps the scaling pivot at the element's
       * own top-left corner. x/y are independent translations.
       *
       * After applying x/y, the element's top-left in viewport coordinates is
       * at (rect.left + x, rect.top + y). The scaled card's visual center is:
       *   center_X = rect.left + x + (rect.width  × scale) / 2
       *   center_Y = rect.top  + y + (rect.height × scale) / 2
       *
       * Setting each equal to the viewport center (vw/2, vh/2) gives:
       *   expansionX = vw/2 − rect.left − (rect.width  × scale) / 2
       *   expansionY = vh/2 − rect.top  − (rect.height × scale) / 2
       *
       * The non-limiting axis (where cover-fill doesn't overflow) naturally
       * collapses to the old −rect.left / −rect.top value. The overflowing
       * axis distributes the excess equally above+below (or left+right).
       *
       * No position:fixed manipulation needed — CSS transforms leave the
       * element in normal flow so ScrollTrigger measures the section correctly.
       */
      const scaleX = vw / rect.width
      const scaleY = vh / rect.height
      // Uniform cover-fill: use the LARGER of the two axes so the card fills
      // the viewport without any aspect-ratio distortion. Overflow in the
      // smaller axis is clipped by the browser viewport edge.
      const scale = Math.max(scaleX, scaleY) * COVER_SCALE_BLEED

      // Center-aligned translations (see formula derivation above)
      const expansionX = vw / 2 - rect.left - (rect.width  * scale) / 2
      const expansionY = vh / 2 - rect.top  - (rect.height * scale) / 2

      /**
       * Register initial rotations with GSAP BEFORE the timeline is built.
       *
       * Yellow and pink have their rotation set as a React inline style
       * (transform: rotate(Xdeg)). GSAP doesn't automatically read those into
       * its own transform cache, so without gsap.set() it treats their starting
       * rotation as 0 — causing a visual snap from 2/−2deg → 0 at the first
       * scroll tick. gsap.set() hands full ownership to GSAP immediately.
       *
       * The matching rotate() is removed from the JSX inline style below.
       */
      gsap.set(yellowRef.current!, { rotation: 2 })
      gsap.set(pinkRef.current!, { rotation: -2 })

      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // ── Phase 1 (0 → 30 %): hero content exits ─────────────────────────
      tl.to(contentRef.current, { opacity: 0, y: -30, duration: 0.3 }, 0)

      // ── Phase 1 (0 → 30 %): yellow + pink straighten and vanish ────────────
      // Both cards rotate TO exactly 0deg and stop — no overshoot past flat.
      // They rise upward (y) while their tilt unwinds, then opacity reaches 0.
      // duration: 0.3 gives the scrub lag enough budget to fully reach the
      // target before the front card has expanded past them.
      tl.to(
        yellowRef.current,
        {
          y: -70,
          rotation: 0,   // settles to flat — exactly where user wants it to stop
          opacity: 0,
          duration: 0.3,
        },
        0,
      )

      tl.to(
        pinkRef.current,
        {
          y: -50,
          rotation: 0,   // mirrors yellow — both reach flat and hold
          opacity: 0,
          duration: 0.3,
        },
        0.03,
      )

      // ── Phase 2 (0 → 100 %): card expands to fill viewport ─────────────
      // Uses uniform cover-fill scale and centers the card in the viewport.
      tl.to(
        card,
        {
          x: expansionX,        // card visual center → vw/2
          y: expansionY,        // card visual center → vh/2
          scale,                // uniform scale → no aspect-ratio squish
          transformOrigin: 'top left',
          duration: 1,
        },
        0,
      )

      // ── Phase 2 (0 → 80 %): card unrotates and loses border-radius ──────
      tl.to(
        clip,
        { rotation: 0, borderRadius: 0, duration: 0.8 },
        0,
      )

      // ── Phase 3 (1.0 → 2.0): FROM splits + story card emerges ──────────────
      //
      // Timeline 1.0 → 1.2  (200vh → 240vh scroll): PAUSE
      //   Nothing moves. The user absorbs the fullscreen typography.
      //   Achieved by simply having no tweens in this range.
      //
      // Timeline 1.2 → 1.8  (240vh → 360vh scroll): FROM SPLITS
      //   "FR" slides left, "OM" slides right. Gap opens at the word centre.
      //   "REAL STORIES" and "SOLO SHEs" are untouched.
      //
      //   splitX is in element-space (pre-scale). Dividing by `scale` means
      //   the visual gap is always 12 % of viewport width regardless of card size.
      //
      // Timeline 1.4 → 3.0: cream scales gap → full viewport in one continuous tween.
      //
      const splitX = (vw * 0.12) / scale

      /**
       * Anchor the composition at the exact visual midpoint of the FR/OM gap.
       *
       * Problem: the card sits at `left-1/2` of its parent wrapper span, which
       * equals (width(FR) + width(OM)) / 2 — the center of the whole word FROM.
       * But once FR moves left and OM moves right the gap's center is at the
       * original FR/OM boundary = right edge of FR = width(FR) from wrapper left.
       * Because Anton uppercase "FR" ≠ "OM" in pixel width, these two points
       * don't coincide and the card appears off-center.
       *
       * Fix: measure where `left-1/2` puts the card center vs where the actual
       * boundary is, then shift by the difference using GSAP's `x` property.
       * No JSX changes required — the correction lives entirely here.
       *
       *   wrapRect.width / 2         = current card center X (via left-1/2)
       *   frRect.right - wrapRect.left = actual gap center X (FR right edge)
       *   correctionX                = pixels to shift right (or left) from default
       */
      const frRect   = fromLeftRef.current!.getBoundingClientRect()
      const wrapRect = fromLeftRef.current!.parentElement!.getBoundingClientRect()
      const correctionX = (frRect.right - wrapRect.left) - wrapRect.width / 2

      gsap.set(compositionAnchorRef.current!, {
        xPercent: -50,
        yPercent: -50,
        x: correctionX,
      })

      const heroEl = darkHeroRef.current!
      const creamCoverScale = Math.max(
        heroEl.offsetWidth / CREAM_SEED_W,
        heroEl.offsetHeight / CREAM_SEED_H,
      )
      const invScale = 1 / scale

      // Gallery cards live inside scaled cardRef — DOM px must be × invScale (mobile only).
      setLayout(
        isGalleryDesktop(vw)
          ? profile
          : {
              ...profile,
              cardW: Math.round(profile.cardW * invScale),
              cardH: Math.round(profile.cardH * invScale),
            },
      )

      const typographyEls = [
        realStoriesRef.current!,
        fromLeftRef.current!,
        fromRightRef.current!,
        soloSHEsRef.current!,
      ]

      // Cream — seed in the FROM gap; one continuous scale through full viewport.
      gsap.set(creamEnvironmentRef.current!, {
        width: CREAM_SEED_W,
        height: CREAM_SEED_H,
        xPercent: -50,
        yPercent: -50,
        left: '50%',
        top: '50%',
        scale: 0.15,
        borderRadius: 20,
        transformOrigin: '50% 50%',
        autoAlpha: 0,
      })

      const CREAM_SCALE_START  = 1.4
      const CREAM_SCALE_DUR    = 1.6
      const CREAM_GALLERY_START = 2.0

      // Phase 3B — FROM splits horizontally
      tl.to(fromLeftRef.current,  { x: -splitX, duration: 0.6 }, 1.2)
      tl.to(fromRightRef.current, { x:  splitX, duration: 0.6 }, 1.2)

      // Phase 3C — cream grows gap → full viewport (single scrubbed tween, no seam).
      tl.to(creamEnvironmentRef.current!, {
        autoAlpha: 1,
        scale: creamCoverScale,
        borderRadius: 0,
        duration: CREAM_SCALE_DUR,
        ease: 'none',
      }, CREAM_SCALE_START)

      tl.to(
        typographyEls,
        { opacity: 0, filter: 'blur(6px)', duration: 0.4, ease: 'none' },
        CREAM_SCALE_START,
      )

      // ── creamGalleryTl — Serve-style upward corridor on cream page ──
      //
      //   Cards + headline enter from below; continuous scroll-scrubbed Y drift.
      //
      // Lift card cluster into upper third of visible cream — without resizing the cream seed.
      const creamVisibleH       = heroEl.offsetHeight
      const compositionYOffset  = -(creamVisibleH * (0.5 - compositionBandFromTop))
      const continuationY       = compositionYOffset + viewportH / 2 - 120

      const heroHalfH           = heroEl.offsetHeight / 2
      const slotMinY            = Math.min(...gallerySlots.map((s) => s.y))
      const cardEntryBelow = Math.max(
        creamVisibleH * 0.78 + cardH * 2,
        heroHalfH - slotMinY + cardH * 2.5,
      )

      const leadSlot0 = gallerySlots[0]
      const leadSlot1 = gallerySlots[1]
      const card0EntryY = leadSlot0.y + cardEntryBelow * GALLERY_ENTRY_TIER_MULT[leadSlot0.tier]
      const card1EntryY = leadSlot1.y + cardEntryBelow * GALLERY_ENTRY_TIER_MULT[leadSlot1.tier]
      const headingStartY = (card0EntryY + card1EntryY) / 2
      const cardFinalCentroidY = gallerySlots.reduce(
        (sum, { tier, y }) => sum + (y - parallaxCorridor[tier]),
        0,
      ) / gallerySlots.length
      const headingEndY   = cardFinalCentroidY - HEADING_OPTICAL_LIFT
      const headingCorridorDur = GALLERY_CARD_STAGGER * 5 + GALLERY_CORRIDOR_DUR

      const creamGalleryTl = gsap.timeline({ defaults: { ease: 'none' } })
      const corridorStart = CREAM_SCALE_START + CREAM_SCALE_DUR - CREAM_GALLERY_START

      gsap.set(creamContinuationRef.current!, {
        autoAlpha: 0,
        xPercent: -50,
        left: '50%',
        top: '50%',
        y: continuationY * invScale,
        width: vw * invScale,
        height: creamContinuationH * invScale,
        transformOrigin: '50% 0%',
      })

      gsap.set(galleryStageRef.current!, {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        left: '50%',
        top: '50%',
        y: compositionYOffset * invScale,
      })

      gsap.set(galleryViewportRef.current!, {
        xPercent: -50,
        yPercent: -50,
        left: '50%',
        top: '50%',
      })

      gsap.set(galleryHeadingRef.current!, {
        autoAlpha: 1,
        visibility: 'hidden',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: headingStartY * invScale,
        zIndex: 18,
      })

      // Cards start below the viewport — fully opaque, Y-only motion (no fade).
      gallerySlots.forEach(({ id, tier, x, y }) => {
        const el = galleryCompositionRef.current!.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!
        const cfg = DEPTH_TIERS[tier]
        const entryRise = cardEntryBelow * GALLERY_ENTRY_TIER_MULT[tier]
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: x * invScale,
          y: (y + entryRise) * invScale,
          zIndex: cfg.z,
          scale: cfg.scale,
          autoAlpha: cfg.opacity,
        })
      })

      // Serve corridor — cards + headline rise from below; continuous Y drift.
      const corridorEnd        = corridorStart + GALLERY_CARD_STAGGER * 5 + GALLERY_CORRIDOR_DUR
      const galleryEnd         = corridorEnd + GALLERY_EXIT_DUR
      const galleryExitDur     = GALLERY_EXIT_DUR
      const exitEnvDrift       = ENVIRONMENT_DRIFT_Y * (galleryExitDur / GALLERY_CORRIDOR_DUR)
      const galleryHandoffStart = corridorEnd + galleryExitDur * 0.5
      const handoffFadeDur     = galleryEnd - galleryHandoffStart
      // Release overflow after cards have risen into view — avoids a pop at the bottom edge.
      const overflowRelease = corridorStart + GALLERY_CORRIDOR_DUR * 0.72

      creamGalleryTl.to(galleryStageRef.current!, { autoAlpha: 1, duration: 0.01 }, corridorStart)
      creamGalleryTl.set(galleryHeadingRef.current!, { visibility: 'visible' }, corridorStart)

      creamGalleryTl.to(galleryHeadingRef.current!, {
        y: headingEndY * invScale,
        duration: headingCorridorDur,
        ease: 'none',
      }, corridorStart)

      creamGalleryTl.to(galleryStageRef.current!, {
        y: (compositionYOffset - STAGE_DRIFT) * invScale,
        duration: GALLERY_CORRIDOR_DUR,
        ease: 'none',
      }, corridorStart)

      gallerySlots.forEach(({ id, tier, y }, index) => {
        const el = galleryCompositionRef.current!.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!
        const driftY = parallaxCorridor[tier]
        const corridorCfg = GALLERY_CARD_CORRIDOR[id]
        const cardStart = corridorStart + (
          corridorCfg?.startAt ?? index * GALLERY_CARD_STAGGER
        )
        const cardRiseDur = GALLERY_CORRIDOR_DUR * (corridorCfg?.durationMult ?? 1)

        creamGalleryTl.to(el, {
          y: (y - driftY) * invScale,
          duration: cardRiseDur,
          ease: 'none',
        }, cardStart)
      })

      creamGalleryTl.to(creamEnvironmentRef.current!, {
        y: ENVIRONMENT_DRIFT_Y * invScale,
        duration: GALLERY_CORRIDOR_DUR,
        ease: 'none',
      }, corridorStart)

      creamGalleryTl.to(creamContinuationRef.current!, {
        y: (continuationY + ENVIRONMENT_DRIFT_Y) * invScale,
        duration: GALLERY_CORRIDOR_DUR,
        ease: 'none',
      }, corridorStart)

      // Post-spread exit — whole cluster drifts up through cream tail (cards ride galleryStage).
      creamGalleryTl.to(galleryStageRef.current!, {
        y: (compositionYOffset - STAGE_DRIFT - galleryExitDriftY) * invScale,
        duration: galleryExitDur,
        ease: 'none',
      }, corridorEnd)

      creamGalleryTl.to(creamEnvironmentRef.current!, {
        y: (ENVIRONMENT_DRIFT_Y + exitEnvDrift) * invScale,
        duration: galleryExitDur,
        ease: 'none',
      }, corridorEnd)

      creamGalleryTl.to(creamContinuationRef.current!, {
        y: (continuationY + ENVIRONMENT_DRIFT_Y + exitEnvDrift) * invScale,
        duration: galleryExitDur,
        ease: 'none',
      }, corridorEnd)

      // Hand off to next section — fade cream shell as cards clear the viewport.
      creamGalleryTl.to(
        [card, heroSurfaceRef.current!],
        { autoAlpha: 0, duration: handoffFadeDur, ease: 'none' },
        galleryHandoffStart,
      )

      creamGalleryTl.set(sectionRef.current, { overflow: 'visible' }, overflowRelease)
      creamGalleryTl.set(clipRef.current, { overflow: 'visible' }, overflowRelease)
      creamGalleryTl.set(darkHeroRef.current, { overflow: 'visible' }, overflowRelease)
      creamGalleryTl.set(imageRef.current, { overflow: 'visible' }, overflowRelease)
      creamGalleryTl.to(creamContinuationRef.current!, { autoAlpha: 1, duration: 0.01 }, overflowRelease)

      tl.add(creamGalleryTl, CREAM_GALLERY_START)

      const PIN_DURATION = Math.max(CREAM_GALLERY_START + galleryEnd, tl.totalDuration())
      const auditThreshold  = (CREAM_GALLERY_START + corridorEnd * 0.55) / PIN_DURATION
      let layoutAudited     = false

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${Math.round(PIN_DURATION * 200)}%`,
        pin: true,
        scrub: 1,
        animation: tl,
        anticipatePin: 1,
        onUpdate(self) {
          if (layoutAudited || self.progress < auditThreshold) return
          layoutAudited = true
          auditGalleryLayout({
            compositionAnchor:  compositionAnchorRef.current!,
            cardEl:             cardRef.current!,
            clipEl:             clipRef.current!,
            darkHero:           darkHeroRef.current!,
            section:            sectionRef.current!,
            galleryStage:       galleryStageRef.current!,
            galleryViewport:    galleryViewportRef.current!,
            galleryComposition: galleryCompositionRef.current!,
            creamContinuation:  creamContinuationRef.current!,
            compositionYOffset,
            slots: gallerySlots,
          })
        },
      })
    }, sectionRef)
      ScrollTrigger.refresh()
    }

    runSetup()

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const desktop = isGalleryDesktop(window.innerWidth)
        if (desktop !== activeDesktop) {
          activeDesktop = desktop
          runSetup()
        } else {
          ScrollTrigger.refresh()
        }
      }, 200)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      ctx?.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">

      {/* Hero intro — cream surface for the opening beat */}
      <div ref={heroSurfaceRef} className="relative bg-[#fffaf0] max-lg:flex max-lg:min-h-dvh max-lg:flex-col">

      <div
        ref={contentRef}
        className="flex flex-col items-center px-4 pt-[180px] text-center text-black"
      >

        <h1 className="max-w-[840px] font-navbar-jakarta text-[clamp(2.75rem,5.5vw,5rem)] font-normal leading-[1.06] tracking-[0.7px] text-[#111111]">
          Every Journey Has A Story. Tell Yours.
        </h1>

        {/* CTA row */}
        <div className="mt-20 flex flex-col items-center gap-4 sm:flex-row">

          {/* Primary — filled purple */}
          <Link
            href="/signup"
            className="inline-flex h-[70px] min-w-[225px] items-center justify-center rounded-[20px] bg-[#3d1b08] px-7 font-navbar-jakarta text-sm font-medium text-white transition hover:bg-[#2f1406]"
          >
            Start Free Trial
          </Link>

          {/* Secondary — outlined */}
          <Link
            href="/register"
            className="inline-flex h-[70px] min-w-[225px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-7 font-navbar-jakarta text-sm font-semibold text-gray-800"
          >
            Create Free Account
          </Link>

        </div>
      </div>

      {/* ── 2. Image stack — anchored to bottom on mobile (desktop-style peek) ─ */}
      {/*
       * Yellow card (yellowRef): fades out in the first 20 % of scroll.
       * Pink card (pinkRef):     fades out in the first 20 % of scroll.
       * Front card (cardRef / clipRef): expands from its measured fixed position
       *   to fill the full viewport. Rotation and border-radius animate to 0.
       *
       * z-index stack: yellow(1) → pink(2) → front card(100 during animation)
       */}
      <div className="mx-auto mt-56 w-full max-w-[1200px] px-4 sm:px-6 max-lg:mt-auto max-lg:pb-2">
        <div className="relative max-lg:mx-auto max-lg:w-full max-lg:max-w-[440px] max-lg:translate-y-[8%] sm:max-lg:max-w-[520px] md:max-lg:max-w-[720px]">

          {/* Yellow card — fades out early */}
          <div
            ref={yellowRef}
            aria-hidden="true"
            className="absolute z-[1] -top-7 -bottom-7 -left-9 -right-9 rounded-[100px] bg-[#FFD700] max-lg:-top-2 max-lg:-bottom-2 max-lg:-left-2.5 max-lg:-right-2.5 max-lg:rounded-[48px] sm:max-lg:rounded-[72px]"
            style={{ transform: 'rotate(2deg)' }}
          />

          {/* Pink card — fades out early */}
          <div
            ref={pinkRef}
            aria-hidden="true"
            className="absolute z-[2] -top-4 -bottom-4 -left-5 -right-5 rounded-[100px] bg-[#E91E8C] max-lg:-top-1 max-lg:-bottom-1 max-lg:-left-1.5 max-lg:-right-1.5 max-lg:rounded-[48px] sm:max-lg:rounded-[72px]"
            style={{ transform: 'rotate(-2deg)' }}
          />

          {/*
           * cardRef — GSAP fixes this element and animates its dimensions
           *   to fill the viewport. z-index 100 ensures it renders above
           *   everything (including the navbar) during the transition.
           *
           * clipRef — overflow-hidden container. GSAP animates:
           *   rotation: 0      (straightens the -7deg tilt)
           *   borderRadius: 0  (removes the rounded-[100px] class value)
           *   height: 100%     (fills the fixed card as it expands)
           */}
          <div ref={cardRef} className="relative z-[3]">
            <div
              ref={clipRef}
              className="overflow-hidden rounded-[100px] max-lg:rounded-[48px] sm:max-lg:rounded-[72px]"
              style={{ transform: 'rotate(-7deg)' }}
            >
              {/*
               * imageRef — typography card replaces the photo.
               * Structure preserved for the future scroll-reveal animation:
               * fullscreen pin → split open → horizontal story gallery.
               * No new GSAP here — animation will be added in a later pass.
               */}
              <div ref={imageRef} className="select-none">
                {/*
                 * Editorial typography card — dark background, cream text.
                 *
                 * Three-line layout (matches reference "CREATING / MOTION / WITH MEANING"):
                 *   Line 1 — REAL STORIES  (long,  sets the width baseline)
                 *   Line 2 — FROM          (short, creates editorial breathing gap)
                 *   Line 3 — SOLO SHEs     (medium, closes the composition)
                 *
                 * Future animation hook: this div will be split/expanded in a later pass.
                 */}
                <div
                  ref={darkHeroRef}
                  className="relative flex aspect-[1200/840] w-full flex-col items-center justify-center gap-0 overflow-hidden"
                  style={{ backgroundColor: '#3d1b08' }}
                >
                  <div
                    className="relative z-[1] flex flex-col items-center font-navbar-anton uppercase leading-none tracking-[-0.01em] text-[clamp(2.75rem,8.75vw,8.5rem)] max-lg:text-[clamp(1.25rem,7.5vw,8.5rem)]"
                    style={{
                      color: '#f1ead8',
                      gap: '0.20em',
                    }}
                  >
                    <span ref={realStoriesRef}>Real Stories</span>

                    <span className="relative inline-flex items-center">
                      <span ref={fromLeftRef}>Fr</span>
                      <span ref={fromRightRef}>om</span>

                      {/*
                       * compositionAnchor — centre point at correctionX.
                       * cream (z-10) · gallery stage (z-15) · centre open for headline
                       */}
                      <div
                        ref={compositionAnchorRef}
                        className="absolute left-1/2 top-1/2"
                      >
                        {/* Cream environment — grows from the FROM gap centre */}
                        <div
                          ref={creamEnvironmentRef}
                          aria-hidden="true"
                          className="pointer-events-none absolute z-10"
                          style={{ backgroundColor: CREAM_COLOR }}
                        />

                        {/*
                         * Cream editorial tail — same transform subtree as gallery.
                         * Sits below heading inside the composition anchor.
                         */}
                        <div
                          ref={creamContinuationRef}
                          aria-hidden="true"
                          className="pointer-events-none absolute z-[12]"
                          style={{
                            backgroundColor: CREAM_COLOR,
                            visibility:      'hidden',
                          }}
                        />

                        {/*
                         * Editorial stage — expanded canvas for 6-card depth composition.
                         */}
                        <div
                          ref={galleryStageRef}
                          className="pointer-events-none absolute z-[15]"
                          style={{
                            width:      `${displayLayout.viewportW}px`,
                            minHeight:  `${displayLayout.stageMinH}px`,
                            visibility: 'hidden',
                          }}
                        >
                          <div
                            ref={galleryViewportRef}
                            className="pointer-events-auto absolute overflow-visible"
                            style={{
                              width:  `${displayLayout.viewportW}px`,
                              height: `${displayLayout.viewportH}px`,
                            }}
                          >
                            <div
                              ref={galleryCompositionRef}
                              className="relative h-full w-full"
                            >
                              {GALLERY_CARDS.map((card) => (
                                <GallerySideCard
                                  key={card.id}
                                  card={card}
                                  cardW={displayLayout.cardW}
                                  cardH={displayLayout.cardH}
                                />
                              ))}

                              <h2
                                ref={galleryHeadingRef}
                                className="pointer-events-none absolute left-1/2 top-1/2 z-[18] whitespace-nowrap text-center font-navbar-jakarta text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal tracking-[0.02em] text-[#3d1b08] max-lg:max-w-[8.5rem] max-lg:whitespace-normal max-lg:px-2 max-lg:text-[clamp(0.6875rem,2.85vw,1.125rem)] max-lg:leading-tight max-lg:tracking-[0.01em]"
                              >
                                Explore Real Stories
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>

                    <span ref={soloSHEsRef}>Solo SHEs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>

    </section>
  )
}
