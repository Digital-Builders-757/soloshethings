'use client'

/**
 * CommunityCTA — pinned editorial story (shinkei-style)
 *
 * Left:  center conveyor — exit center→top as seam hits 50%; enter below→center as card pins.
 * Right: unwrap reveal — outgoing shrinks on top; incoming clipped with rounded seam.
 * Scroll-scrubbed sticky track; final chapter is the community CTA.
 */

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { usePrefersReducedMotion } from '@/lib/hooks/use-client-media'

gsap.registerPlugin(ScrollTrigger)

// ─── Types & data ────────────────────────────────────────────────────────────

interface CommunityChapter {
  id:          string
  title:       string
  body:        string
  imageSrc:    string
  imageAlt:    string
  location:    string
  label:       string
}

const COMMUNITY_CHAPTERS: CommunityChapter[] = [
  {
    id:       '01',
    title:    "You're Not Travelling Alone",
    body:     'Solo travel can feel wide open — until you find women who have walked the same roads. Here, courage is shared, stories build on each other, and solitude is not the same as loneliness.',
    imageSrc: '/client-travel/paris-eiffel-tower.JPG',
    imageAlt: 'Woman standing confidently in front of the Eiffel Tower, Paris',
    location: 'Paris, France',
    label:    'Shared Journeys',
  },
  {
    id:       '02',
    title:    'Ask Before You Go',
    body:     'The hostel worth booking. The neighbourhood to walk at dusk. The questions guidebooks skip — answered by women who have already made the trip.',
    imageSrc: '/client-travel/market-spices-yarn.png',
    imageAlt: 'Vibrant indoor market filled with colourful yarns and spices',
    location: 'Marrakech, Morocco',
    label:    'Local Wisdom',
  },
  {
    id:       '03',
    title:    'Travel Safer Together',
    body:     'Safety notes shaped by real journeys — not fear lists or generic warnings. Practical clarity you can use when a decision on the road actually matters.',
    imageSrc: '/client-travel/mountain-summit-city-view.png',
    imageAlt: 'Solo traveller on a mountain summit overlooking a city and bay',
    location: 'European highlands',
    label:    'Safety Notes',
  },
  {
    id:       '04',
    title:    'Build Friendships Worldwide',
    body:     'From a chance meeting to a friendship across time zones — community that travels with you long after the trip ends. The best solo stories rarely stay solo for long.',
    imageSrc: '/client-travel/garden-tiled-staircase.png',
    imageAlt: 'Woman resting on a tiled garden staircase surrounded by lush foliage',
    location: 'Mediterranean coast',
    label:    'Global Friendships',
  },
  {
    id:       '05',
    title:    'Join The Solo SHE Community',
    body:     'The right travel story can help another woman trust herself enough to book the trip. Create a profile, share your path, and travel with women who understand.',
    imageSrc: '/images/about-mission.png',
    imageAlt: 'Women laughing together on a mountain overlook',
    location: 'Community',
    label:    'Join Us',
  },
]

const CHAPTER_COUNT         = COMMUNITY_CHAPTERS.length
const SCROLL_VH_PER_CHAPTER = 120
const PIN_SCROLL_VH         = CHAPTER_COUNT * SCROLL_VH_PER_CHAPTER
// Sticky track = pinned viewport + scroll budget (matches former `+=PIN_SCROLL_VH%` pin).
const PIN_TRACK_VH          = PIN_SCROLL_VH + 100

// Scroll timeline length (panel segments derive from this).
const COPY_HOLD             = 0.74
const COPY_CROSSFADE        = 0.26
const COPY_UNIT             = COPY_HOLD + COPY_CROSSFADE

const COPY_TIMELINE_END     = (CHAPTER_COUNT - 1) * COPY_UNIT + COPY_HOLD * 0.5

// Left copy — outgoing exit finishes when seam is COPY_EXIT_SEAM_TOP_FRAC from the
// panel top (0.30 = 30% from top / 70% from bottom); incoming runs the remainder.
const COPY_EXIT_SEAM_TOP_FRAC   = 0.30
const COPY_ENTER_FROM_BOTTOM_FRAC = 0.20
const COPY_EXIT_FADE_FRAC         = 0.12

const COPY_CENTER_ANCHOR = {
  top:      '50%',
  bottom:   'auto',
  yPercent: -50,
} as const

// Panel z-index: active on top during hold; outgoing boosted above incoming during unwrap.
const PANEL_Z_BURIED        = 1
const PANEL_Z_UNDER         = 20
const PANEL_Z_ACTIVE        = 50
const PANEL_Z_REVEAL        = 100
const PANEL_CORNER_RADIUS   = '1.75rem'

const PANEL_SEAM_CLIP =
  `inset(var(--panel-seam-inset, 0px) 0 0 0 round ${PANEL_CORNER_RADIUS} ${PANEL_CORNER_RADIUS} 0 0)`

/** Matches hero / manifesto / footer — stacked copy+image below this width. */
const COMMUNITY_DESKTOP_BREAKPOINT = 1024

/** Matches newsletter / epilogue editorial card surface. */
const CHAPTER_INDEX_COLOR = '#0c1015'

// ─── Static fallback (reduced motion) ────────────────────────────────────────

function CommunityEditorialStatic() {
  return (
    <section
      className="relative overflow-hidden bg-[#fffaf0] py-16 md:py-24"
      aria-labelledby="community-editorial-heading"
    >
      <div className="container relative z-10 mx-auto shell-inline space-y-16 md:space-y-20">
        {COMMUNITY_CHAPTERS.map((chapter, index) => (
          <article
            key={chapter.id}
            className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
          >
            <div>
              <p
                className="font-serif text-4xl font-bold leading-none"
                style={{ color: CHAPTER_INDEX_COLOR }}
              >
                {chapter.id}
              </p>
              <h2
                id={index === 0 ? 'community-editorial-heading' : undefined}
                className="mt-4 font-serif text-3xl font-bold leading-tight text-[#7a331b] md:text-4xl lg:text-5xl"
              >
                {chapter.title}
            </h2>
              <p className="mt-5 max-w-xl font-navbar-jakarta text-base font-normal leading-7 tracking-normal text-[#6d5849] md:text-lg md:leading-8">
                {chapter.body}
              </p>
              {index === CHAPTER_COUNT - 1 && (
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/signup"
                    className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#3d1b08] px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#2f1406]"
              >
                Create Your Free Profile
              </Link>
              <Link
                    href="/places"
                    className="inline-flex h-14 shrink-0 items-center justify-center rounded-full border border-[#7a331b]/25 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a331b] transition hover:border-[#e34b16]/45"
              >
                    Browse Community Stories
              </Link>
                </div>
              )}
          </div>

            <figure className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-[#1a0f0a] lg:mx-0 lg:max-w-none">
              <Image
                src={chapter.imageSrc}
                alt={chapter.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0f0a]/90 via-[#1a0f0a]/30 to-transparent px-6 pb-6 pt-16">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#fab642]">
                  {chapter.location}
                </p>
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─── Pinned editorial experience ─────────────────────────────────────────────

export function CommunityCTA() {
  const sectionRef        = useRef<HTMLElement>(null)
  const stickyRef         = useRef<HTMLDivElement>(null)
  const seamLineRef       = useRef<HTMLDivElement>(null)
  const copyLayerRef      = useRef<HTMLDivElement>(null)
  const visualViewportRef = useRef<HTMLDivElement>(null)
  const visualTrackRef    = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    if (
      !sectionRef.current ||
      !stickyRef.current ||
      !seamLineRef.current ||
      !visualViewportRef.current ||
      !visualTrackRef.current ||
      !copyLayerRef.current
    ) {
      return
    }

    const getViewportOffsetTop = () => {
      const sticky = stickyRef.current
      const viewport = visualViewportRef.current
      if (!sticky || !viewport) return 0
      return viewport.getBoundingClientRect().top - sticky.getBoundingClientRect().top
    }

    const syncSeamLine = (seamY: number, visible: boolean) => {
      gsap.set(seamLineRef.current, {
        top:       getViewportOffsetTop() + seamY,
        autoAlpha: visible ? 1 : 0,
      })
    }

    const copyEls = gsap.utils.toArray<HTMLElement>(
      copyLayerRef.current.querySelectorAll('[data-chapter-copy]'),
    )
    const panelEls = gsap.utils.toArray<HTMLElement>(
      visualTrackRef.current.querySelectorAll('[data-chapter-panel]'),
    )

    const panelMediaEls = gsap.utils.toArray<HTMLElement>(
      visualTrackRef.current.querySelectorAll('[data-panel-media]'),
    )

    let isActive = true
    const fullscreenTimeouts: number[] = []

    const getPanelHeight = () => {
      const viewportEl = visualViewportRef.current
      const stickyEl = stickyRef.current
      if (!viewportEl) return stickyEl?.clientHeight ?? 0

      const viewportHeight = viewportEl.offsetHeight
      if (viewportHeight <= 0) return stickyEl?.clientHeight ?? 0

      // Mobile stacks copy above image — panel must match the image viewport, not full sticky height.
      if (window.innerWidth < COMMUNITY_DESKTOP_BREAKPOINT) {
        return viewportHeight
      }

      const stickyHeight = stickyEl?.clientHeight ?? 0
      return Math.max(viewportHeight, stickyHeight)
    }

    const layoutPanels = () => {
      if (!visualTrackRef.current || !visualViewportRef.current) return 0

      const panelHeight = getPanelHeight()
      if (panelHeight <= 0) return 0

      gsap.set(visualTrackRef.current, { height: panelHeight, y: 0 })
      panelMediaEls.forEach((media) => {
        gsap.set(media, { height: panelHeight })
      })
      return panelHeight
    }

    const getCopyLayerHeight = () => copyLayerRef.current?.offsetHeight ?? 0

    // Incoming top edge starts COPY_ENTER_FROM_BOTTOM_FRAC up from the layer bottom.
    const getCopyEnterY = (el: HTMLElement, layerHeight: number) => {
      const startTopFromTop = layerHeight * (1 - COPY_ENTER_FROM_BOTTOM_FRAC)
      return startTopFromTop + el.offsetHeight / 2 - layerHeight / 2
    }

    const getCopyExitY = (el: HTMLElement, layerHeight: number) =>
      -(layerHeight / 2 + el.offsetHeight / 2)

    const copyHoldCentered = (el: HTMLElement) => {
      gsap.set(el, {
        ...COPY_CENTER_ANCHOR,
        autoAlpha: 1,
        y:         0,
      })
    }

    const copyBelowCentered = (el: HTMLElement, enterY: number) => {
      gsap.set(el, {
        ...COPY_CENTER_ANCHOR,
        autoAlpha: 0,
        y:         enterY,
      })
    }

    const applyStackHold = (activeIndex: number, panelHeight: number) => {
      panelEls.forEach((panel, index) => {
        if (index < activeIndex) {
          gsap.set(panel, {
            y:                    0,
            height:               0,
            zIndex:               PANEL_Z_BURIED + index,
            '--panel-seam-inset': '0px',
          })
        } else if (index === activeIndex) {
          gsap.set(panel, {
            y:                    0,
            height:               panelHeight,
            zIndex:               PANEL_Z_ACTIVE + index,
            '--panel-seam-inset': '0px',
          })
        } else if (index === activeIndex + 1) {
          gsap.set(panel, {
            y:                    0,
            height:               panelHeight,
            zIndex:               PANEL_Z_UNDER + index,
            '--panel-seam-inset': `${panelHeight}px`,
          })
        } else {
          gsap.set(panel, {
            y:                    0,
            height:               0,
            zIndex:               PANEL_Z_BURIED + index,
            '--panel-seam-inset': '0px',
          })
        }
      })
    }

    const handleResize = () => {
      if (!isActive || !sectionRef.current) return
      layoutPanels()
      ScrollTrigger.refresh()
    }

    const scheduleLayoutRefresh = () => {
      requestAnimationFrame(() => {
        if (!isActive) return
        handleResize()
        requestAnimationFrame(() => {
          if (!isActive) return
          handleResize()
        })
      })
    }

    const handleFullscreenChange = () => {
      scheduleLayoutRefresh()
      // Fullscreen exit can report the new viewport size a few frames late.
      fullscreenTimeouts.push(window.setTimeout(handleResize, 50))
      fullscreenTimeouts.push(window.setTimeout(handleResize, 150))
    }

    const resizeObserver = new ResizeObserver(scheduleLayoutRefresh)

    const ctx = gsap.context(() => {
      layoutPanels()
      const copyLayerHeight = getCopyLayerHeight()

      gsap.set(seamLineRef.current, { autoAlpha: 0, top: getViewportOffsetTop() })

      panelEls.forEach((panel) => {
        gsap.set(panel, {
          width:                '100%',
          top:                  0,
          left:                 0,
          '--panel-seam-inset': '0px',
        })
      })

      copyHoldCentered(copyEls[0])
      copyEls.slice(1).forEach((el) => {
        copyBelowCentered(el, getCopyEnterY(el, copyLayerHeight))
      })

      gsap.set(visualTrackRef.current, { y: 0 })
      applyStackHold(0, getPanelHeight())

      const tl = gsap.timeline({
        defaults:            { ease: 'none' },
        invalidateOnRefresh: true,
      })

      const segmentDuration = COPY_TIMELINE_END / (CHAPTER_COUNT - 1)
      const copyExitDur = segmentDuration * (1 - COPY_EXIT_SEAM_TOP_FRAC)
      const copyEnterDur = segmentDuration * COPY_EXIT_SEAM_TOP_FRAC
      const copyExitFadeDur = copyExitDur * COPY_EXIT_FADE_FRAC

      for (let k = 1; k < CHAPTER_COUNT; k++) {
        const segStart = (k - 1) * segmentDuration
        const segEnd   = segStart + segmentDuration
        const copyHandoff = segStart + copyExitDur
        const outgoing = panelEls[k - 1]
        const incoming = panelEls[k]
        const outgoingCopy = copyEls[k - 1]
        const incomingCopy = copyEls[k]

        tl.set(
          outgoing,
          {
            y:                    0,
            zIndex:               PANEL_Z_REVEAL + (k - 1),
            '--panel-seam-inset': '0px',
          },
          segStart,
        )
        tl.fromTo(
          outgoing,
          { height: () => getPanelHeight() },
          {
            height:   0,
            duration: segmentDuration,
            onUpdate: () => {
              const seamY = Number(gsap.getProperty(outgoing, 'height')) || 0
              syncSeamLine(seamY, seamY > 0)
            },
          },
          segStart,
        )
        tl.set(
          incoming,
          {
            y:                    0,
            height:               () => getPanelHeight(),
            zIndex:               PANEL_Z_UNDER + k,
            '--panel-seam-inset': () => `${getPanelHeight()}px`,
          },
          segStart,
        )

        tl.set(
          seamLineRef.current,
          {
            autoAlpha: 1,
            top:       () => getViewportOffsetTop() + getPanelHeight(),
          },
          segStart,
        )

        // Left copy — outgoing center → top until seam is 30% from top; then incoming rises.
        tl.set(
          outgoingCopy,
          {
            ...COPY_CENTER_ANCHOR,
            autoAlpha: 1,
            y:         0,
          },
          segStart,
        )

        tl.set(
          incomingCopy,
          {
            ...COPY_CENTER_ANCHOR,
            autoAlpha: 0,
            y:         () => getCopyEnterY(incomingCopy, getCopyLayerHeight()),
          },
          segStart,
        )

        tl.to(
          outgoingCopy,
          {
            y:        () => getCopyExitY(outgoingCopy, getCopyLayerHeight()),
            duration: copyExitDur,
          },
          segStart,
        )

        tl.to(
          outgoingCopy,
          {
            autoAlpha: 0,
            duration:  copyExitFadeDur,
          },
          copyHandoff - copyExitFadeDur,
        )

        tl.set(
          outgoingCopy,
          {
            autoAlpha: 0,
            y:         () => getCopyExitY(outgoingCopy, getCopyLayerHeight()),
          },
          copyHandoff,
        )

        tl.set(
          incomingCopy,
          {
            ...COPY_CENTER_ANCHOR,
            autoAlpha: 1,
            y:         () => getCopyEnterY(incomingCopy, getCopyLayerHeight()),
          },
          copyHandoff,
        )

        tl.to(
          incomingCopy,
          {
            y:        0,
            duration: copyEnterDur,
          },
          copyHandoff,
        )

        tl.set(
          outgoingCopy,
          {
            ...COPY_CENTER_ANCHOR,
            autoAlpha: 0,
            y:         () => getCopyExitY(outgoingCopy, getCopyLayerHeight()),
          },
          segEnd,
        )

        tl.set(
          incomingCopy,
          {
            ...COPY_CENTER_ANCHOR,
            autoAlpha: 1,
            y:         0,
          },
          segEnd,
        )

        tl.to(
          incoming,
          {
            '--panel-seam-inset': '0px',
            duration:             segmentDuration,
          },
          segStart,
        )

        tl.set(seamLineRef.current, { autoAlpha: 0 }, segEnd)

        for (let i = 0; i < CHAPTER_COUNT; i++) {
          const panel = panelEls[i]
          if (i < k) {
            tl.set(
              panel,
              {
                y:                    0,
                height:               0,
                zIndex:               PANEL_Z_BURIED + i,
                '--panel-seam-inset': '0px',
              },
              segEnd,
            )
          } else if (i === k) {
            tl.set(
              panel,
              {
                y:                    0,
                height:               () => getPanelHeight(),
                zIndex:               PANEL_Z_ACTIVE + i,
                '--panel-seam-inset': '0px',
              },
              segEnd,
            )
          } else if (i === k + 1) {
            tl.set(
              panel,
              {
                y:                    0,
                height:               () => getPanelHeight(),
                zIndex:               PANEL_Z_UNDER + i,
                '--panel-seam-inset': () => `${getPanelHeight()}px`,
              },
              segEnd,
            )
          } else {
            tl.set(
              panel,
              {
                y:                    0,
                height:               0,
                zIndex:               PANEL_Z_BURIED + i,
                '--panel-seam-inset': '0px',
              },
              segEnd,
            )
          }
        }
      }

      tl.to({}, { duration: COPY_HOLD * 0.5 }, (CHAPTER_COUNT - 1) * COPY_UNIT)

      ScrollTrigger.create({
        trigger:             sectionRef.current,
        start:               'top top',
        end:                 'bottom bottom',
        scrub:               0.45,
        animation:           tl,
        invalidateOnRefresh: true,
      })

      window.addEventListener('resize', scheduleLayoutRefresh)
      document.addEventListener('fullscreenchange', handleFullscreenChange)

      resizeObserver.observe(stickyRef.current!)
      resizeObserver.observe(visualViewportRef.current!)
    }, sectionRef)

    return () => {
      isActive = false
      fullscreenTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      window.removeEventListener('resize', scheduleLayoutRefresh)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      resizeObserver.disconnect()
      ctx.revert()
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return <CommunityEditorialStatic />
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Community editorial story"
      className="relative"
      style={{ height: `${PIN_TRACK_VH}vh` }}
    >
      <div
        ref={stickyRef}
        className="relative sticky top-0 h-[100dvh] min-h-[100svh] overflow-hidden bg-[#fffaf0]"
      >
        {/* Full-width seam hairline — tracks card boundary during unwrap */}
        <div
          ref={seamLineRef}
          className="pointer-events-none absolute left-0 right-0 z-[200] h-[.1px] -translate-y-1/2 bg-[#7a331b]/20"
          aria-hidden="true"
        />
      <div className="flex h-full min-h-0 flex-col lg:grid lg:min-h-full lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-stretch">
        {/* Left — full-height copy conveyor (matches panel viewport for seam sync) */}
        <div className="relative h-full min-h-0 flex-[1.05] lg:flex-none">
          <div
            ref={copyLayerRef}
            className="absolute inset-0 overflow-hidden"
          >
            {COMMUNITY_CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.id}
                data-chapter-copy
                className="absolute inset-x-0 top-1/2 px-6 md:px-10 lg:px-12 xl:px-16"
                aria-hidden={index !== 0}
              >
                <p
                  className="font-serif text-[clamp(2.75rem,7vw,4.5rem)] font-bold leading-none"
                  style={{ color: CHAPTER_INDEX_COLOR }}
                >
                  {chapter.id}
                </p>
                <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.8vw,2.85rem)] font-bold leading-[1.1] text-[#7a331b]">
                  {chapter.title}
                </h2>
                <p className="mt-5 max-w-md font-navbar-jakarta text-base font-normal leading-7 tracking-normal text-[#6d5849] md:text-lg md:leading-8">
                  {chapter.body}
                </p>

                {index === CHAPTER_COUNT - 1 && (
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/signup"
                      className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#3d1b08] px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#2f1406]"
                    >
                      Create Your Free Profile
                    </Link>
                    <Link
                      href="/places"
                      className="inline-flex h-14 shrink-0 items-center justify-center rounded-full border border-[#7a331b]/25 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a331b] transition hover:border-[#e34b16]/45"
                    >
                      Browse Community Stories
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right — vertical panel stack viewport (unwrap reveal) */}
        <div className="relative min-h-0 flex-1 lg:h-full">
          <div
            ref={visualViewportRef}
            className="absolute inset-0 overflow-hidden max-lg:mx-4"
          >
            <div ref={visualTrackRef} className="relative h-full w-full">
              {COMMUNITY_CHAPTERS.map((chapter, index) => (
                <figure
                  key={chapter.id}
                  data-chapter-panel
                  className="absolute left-0 right-0 top-0 overflow-hidden rounded-[1.75rem] bg-[#1a0f0a]"
                  style={{
                    clipPath:        PANEL_SEAM_CLIP,
                    WebkitClipPath:  PANEL_SEAM_CLIP,
                  }}
                  aria-hidden={index !== 0}
                >
                  <div
                    data-panel-media
                    className="absolute left-0 right-0 top-0 w-full"
                  >
                  <Image
                    src={chapter.imageSrc}
                    alt={chapter.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    priority={index === 0}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/70 via-[#1a0f0a]/15 to-[#1a0f0a]/25"
                    aria-hidden="true"
                  />

                  {/* Editorial caption — reference HUD-style label */}
                  <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-24 md:px-10 md:pb-10">
                    <p className="font-navbar-jakarta text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[#fab642]">
                      {chapter.label}
                    </p>
                    <p className="mt-2 font-navbar-jakarta text-[0.65rem] uppercase tracking-[0.18em] text-white/55">
                      {chapter.location}
                    </p>
                  </figcaption>

                  <p
                    className="absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left font-navbar-jakarta text-[0.62rem] uppercase tracking-[0.32em] text-white/30 lg:block"
                    aria-hidden="true"
                  >
                    {chapter.label}
                  </p>
                  </div>
                </figure>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
