'use client'

/**
 * ManifestoSection — homepage epilogue
 *
 * Two-scene editorial pause before the footer.
 * Dark letter card on cream field, centered typography, grouped scroll transition.
 */

import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ShapeBlur } from '@/components/effects/shape-blur'
import {
  useCappedDevicePixelRatio,
  useMediaQuery,
  usePrefersReducedMotion,
} from '@/lib/hooks/use-client-media'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/** Scene 01 hold — generous. */
const SCROLL_VH_SCENE_01 = 120
/** Grouped crossfade between scenes. */
const SCROLL_VH_TRANSITION = 65
/** Scene 02 hold — longest, for reading. */
const SCROLL_VH_SCENE_02 = 240

const PIN_SCROLL_VH =
  SCROLL_VH_SCENE_01 + SCROLL_VH_TRANSITION + SCROLL_VH_SCENE_02
const PIN_TRACK_VH = PIN_SCROLL_VH + 100

const TIMELINE_HOLD_01 = 1.2
const TIMELINE_CROSSFADE = 0.65
const TIMELINE_HOLD_02 = 2.4

const TRANSITION_EASE = 'power2.inOut'
const SCRUB = 1.05

const TEXT_MUTED = '#9da3ab'
const TEXT_FILL = '#fffaf0'

/** Portion of each hold spent on the left-to-right letter fill. */
const FILL_WINDOW_RATIO = 0.88

const SCENE_CENTER_CLASS =
  'absolute w-[calc(100%-4rem)] max-w-none text-center will-change-[opacity,transform] max-lg:w-[calc(100%-2rem)]'

const LOGO_ANTON_SIZE = 'text-[clamp(2.25rem,5.8vw,7.5rem)]'
const LOGO_GRACE_SIZE = 'text-[clamp(2.65rem,6.85vw,8.8rem)]'

const CARD_SURFACE_CLASS =
  '@container relative overflow-hidden rounded-[2rem] bg-[#0c1015] md:rounded-[2.75rem] lg:rounded-[3rem]'

/** Equal cream margin on every side while the epilogue is pinned. */
const VIEWPORT_GUTTER_CLASS = 'p-[15px]'

const CARD_PINNED_CLASS = `${CARD_SURFACE_CLASS} h-full w-full`
const CARD_STATIC_CLASS = `${CARD_SURFACE_CLASS} mx-auto min-h-[45rem] w-full`

interface EpilogueLineProps {
  children: string
  className?: string
}

interface SceneProps {
  animated?: boolean
}

/** Desktop gallery / epilogue split — matches hero `max-lg` / `lg` boundary. */
const EPILOGUE_DESKTOP_BREAKPOINT = 1024

function LetterCharacterSpans({ text }: { text: string }) {
  return text.split('').map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="manifesto-letter inline-block"
      style={{ color: TEXT_MUTED }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

function LetterWordSpans({ text }: { text: string }) {
  const words = text.split(' ')

  return words.map((word, wordIndex) => (
    <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
      {word.split('').map((char, charIndex) => (
        <span
          key={`${char}-${charIndex}`}
          className="manifesto-letter inline-block"
          style={{ color: TEXT_MUTED }}
        >
          {char}
        </span>
      ))}
      {wordIndex < words.length - 1 ? '\u00A0' : null}
    </span>
  ))
}

function LetterSpans({ text, groupByWord = false }: { text: string; groupByWord?: boolean }) {
  return groupByWord ? (
    <LetterWordSpans text={text} />
  ) : (
    <LetterCharacterSpans text={text} />
  )
}

function FillEpilogueLine({
  children,
  className,
  groupByWord = false,
}: EpilogueLineProps & { groupByWord?: boolean }) {
  return (
    <p className={cn('font-navbar-jakarta', className)}>
      <LetterSpans text={children} groupByWord={groupByWord} />
    </p>
  )
}

function StaticEpilogueLine({ children, className }: EpilogueLineProps) {
  return (
    <p className={cn('font-navbar-jakarta text-[#fffaf0]', className)}>
      {children}
    </p>
  )
}

function EpilogueLogoTitle({
  animated = true,
  groupByWord = false,
}: SceneProps & { groupByWord?: boolean }) {
  if (!animated) {
    return (
      <p className="flex items-baseline justify-center whitespace-nowrap">
        <span
          className={`font-navbar-anton ${LOGO_ANTON_SIZE} leading-none tracking-tight uppercase text-[#fffaf0]`}
        >
          SOLO&nbsp;
        </span>
        <span className={`font-navbar-grace ${LOGO_GRACE_SIZE} leading-none text-[#fffaf0]`}>
          SHE
        </span>
        <span
          className={`font-navbar-anton ${LOGO_ANTON_SIZE} leading-none tracking-tight uppercase text-[#fffaf0]`}
        >
          &nbsp;THINGS
        </span>
      </p>
    )
  }

  return (
    <p
      className="flex items-baseline justify-center whitespace-nowrap"
      aria-label="Solo She Things"
    >
      <span
        className={`font-navbar-anton ${LOGO_ANTON_SIZE} leading-none tracking-tight uppercase`}
      >
        <LetterSpans text="SOLO " groupByWord={groupByWord} />
      </span>
      <span className={`font-navbar-grace ${LOGO_GRACE_SIZE} leading-none`}>
        <LetterSpans text="SHE" groupByWord={groupByWord} />
      </span>
      <span
        className={`font-navbar-anton ${LOGO_ANTON_SIZE} leading-none tracking-tight uppercase`}
      >
        <LetterSpans text=" THINGS" groupByWord={groupByWord} />
      </span>
    </p>
  )
}

function SceneOne({ animated = true, groupByWord = false }: SceneProps & { groupByWord?: boolean }) {
  if (!animated) {
    return (
      <div className="space-y-4 md:space-y-5">
        <EpilogueLogoTitle animated={false} />
        <StaticEpilogueLine className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-normal leading-[1.28] tracking-[-0.015em]">
          was never meant to be
        </StaticEpilogueLine>
        <StaticEpilogueLine className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-normal leading-[1.28] tracking-[-0.015em]">
          another travel blog.
        </StaticEpilogueLine>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <EpilogueLogoTitle groupByWord={groupByWord} />
      <FillEpilogueLine
        className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-normal leading-[1.28] tracking-[-0.015em]"
        groupByWord={groupByWord}
      >
        was never meant to be
      </FillEpilogueLine>
      <FillEpilogueLine
        className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-normal leading-[1.28] tracking-[-0.015em]"
        groupByWord={groupByWord}
      >
        another travel blog.
      </FillEpilogueLine>
    </div>
  )
}

function SceneTwo({ animated = true, groupByWord = false }: SceneProps & { groupByWord?: boolean }) {
  if (!animated) {
    return (
      <div className="space-y-2 md:space-y-3">
        <StaticEpilogueLine className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
          It&apos;s for women
        </StaticEpilogueLine>
        <StaticEpilogueLine className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
          collecting stories
        </StaticEpilogueLine>
        <StaticEpilogueLine className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]">
          across the world.
        </StaticEpilogueLine>
      </div>
    )
  }

  return (
    <div className="space-y-2 md:space-y-3">
      <FillEpilogueLine
        className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]"
        groupByWord={groupByWord}
      >
        It&apos;s for women
      </FillEpilogueLine>
      <FillEpilogueLine
        className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]"
        groupByWord={groupByWord}
      >
        collecting stories
      </FillEpilogueLine>
      <FillEpilogueLine
        className="text-[clamp(2.5rem,5.5vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em]"
        groupByWord={groupByWord}
      >
        across the world.
      </FillEpilogueLine>
    </div>
  )
}

function addLetterFillTween(
  tl: gsap.core.Timeline,
  letters: HTMLElement[],
  windowDuration: number,
  startTime: number,
) {
  if (letters.length === 0) return

  const step = windowDuration / letters.length

  tl.to(
    letters,
    {
      color: TEXT_FILL,
      duration: step,
      stagger: { each: step, from: 'start' },
      ease: 'none',
    },
    startTime,
  )
}

interface EpilogueCardProps {
  cardRef?: RefObject<HTMLDivElement>
  sceneOneRef?: RefObject<HTMLDivElement>
  sceneTwoRef?: RefObject<HTMLDivElement>
  showShapeBlur?: boolean
  pixelRatio?: number
  sceneTwoHidden?: boolean
  staticLayout?: boolean
  fillViewport?: boolean
  groupByWord?: boolean
}

function EpilogueCard({
  cardRef,
  sceneOneRef,
  sceneTwoRef,
  showShapeBlur = false,
  pixelRatio = 1,
  sceneTwoHidden = false,
  staticLayout = false,
  fillViewport = false,
  groupByWord = false,
}: EpilogueCardProps) {
  const cardClass = fillViewport ? CARD_PINNED_CLASS : CARD_STATIC_CLASS

  if (staticLayout) {
    return (
      <div ref={cardRef} className={`${cardClass} !h-auto`}>
        <div className="relative flex min-h-[45rem] flex-col items-center justify-center px-8 py-20 max-lg:px-4 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full max-w-[700px] text-center">
            <SceneOne animated={false} />
            <div className="mt-32 md:mt-40">
              <SceneTwo animated={false} />
            </div>
          </div>
        </div>

        {showShapeBlur ? (
          <div className="pointer-events-none absolute inset-0 z-10">
            <ShapeBlur
              variation={0}
              pixelRatioProp={pixelRatio}
              shapeSize={1}
              borderSize={0.05}
              circleSize={0.25}
              circleEdge={1}
              borderColor="#fffaf0"
              trackingContainerRef={cardRef}
              syncBorderRadius
            />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div ref={cardRef} className={cardClass}>
      <div className="relative h-full w-full px-8 max-lg:px-4 md:px-12 lg:px-16 xl:px-20">
        <div ref={sceneOneRef} className={SCENE_CENTER_CLASS}>
          <SceneOne groupByWord={groupByWord} />
        </div>

        <div
          ref={sceneTwoRef}
          className={SCENE_CENTER_CLASS}
          aria-hidden={sceneTwoHidden}
        >
          <SceneTwo groupByWord={groupByWord} />
        </div>
      </div>

      {showShapeBlur ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <ShapeBlur
            variation={0}
            pixelRatioProp={pixelRatio}
            shapeSize={1}
            borderSize={0.05}
            circleSize={0.25}
            circleEdge={1}
            borderColor="#fffaf0"
            trackingContainerRef={cardRef}
            syncBorderRadius
          />
        </div>
      ) : null}
    </div>
  )
}

function EpilogueStatic() {
  const cardRef = useRef<HTMLDivElement>(null)
  const pixelRatio = useCappedDevicePixelRatio()
  const reduceMotion = usePrefersReducedMotion(true)

  return (
    <section
      aria-label="Closing thought"
      className={`bg-[#fffaf0] ${VIEWPORT_GUTTER_CLASS}`}
    >
      <h2 className="sr-only">Closing thought</h2>
      <div className="mx-auto w-full max-w-none">
        <EpilogueCard
          cardRef={cardRef}
          showShapeBlur={!reduceMotion}
          pixelRatio={pixelRatio}
          staticLayout
        />
      </div>
    </section>
  )
}

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const sceneOneRef = useRef<HTMLDivElement>(null)
  const sceneTwoRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const groupByWord = useMediaQuery(
    `(max-width: ${EPILOGUE_DESKTOP_BREAKPOINT - 1}px)`,
  )
  const pixelRatio = useCappedDevicePixelRatio()

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const section = sectionRef.current
    const sceneOne = sceneOneRef.current
    const sceneTwo = sceneTwoRef.current
    if (!section || !sceneOne || !sceneTwo) return

    const ctx = gsap.context(() => {
      const sceneOneLetters = gsap.utils.toArray<HTMLElement>(
        sceneOne.querySelectorAll('.manifesto-letter'),
      )
      const sceneTwoLetters = gsap.utils.toArray<HTMLElement>(
        sceneTwo.querySelectorAll('.manifesto-letter'),
      )

      gsap.set(sceneOneLetters, { color: TEXT_MUTED })
      gsap.set(sceneTwoLetters, { color: TEXT_MUTED })

      gsap.set(sceneOne, {
        opacity: 1,
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        y: 0,
      })
      gsap.set(sceneTwo, {
        opacity: 0,
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        y: 60,
      })

      const fillWindow01 = TIMELINE_HOLD_01 * FILL_WINDOW_RATIO
      const fillWindow02 = TIMELINE_HOLD_02 * FILL_WINDOW_RATIO
      const sceneTwoFillStart = TIMELINE_HOLD_01 + TIMELINE_CROSSFADE

      const tl = gsap.timeline({ defaults: { ease: TRANSITION_EASE } })

      addLetterFillTween(tl, sceneOneLetters, fillWindow01, 0)

      tl.to(
        sceneOne,
        {
          opacity: 0,
          y: -60,
          duration: TIMELINE_CROSSFADE,
        },
        TIMELINE_HOLD_01,
      )

      tl.to(
        sceneTwo,
        {
          opacity: 1,
          y: 0,
          duration: TIMELINE_CROSSFADE,
        },
        TIMELINE_HOLD_01,
      )

      addLetterFillTween(tl, sceneTwoLetters, fillWindow02, sceneTwoFillStart)

      tl.to(
        {},
        { duration: TIMELINE_HOLD_02 - fillWindow02 },
        sceneTwoFillStart + fillWindow02,
      )

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: SCRUB,
        animation: tl,
        invalidateOnRefresh: true,
      })
    }, section)

    return () => ctx.revert()
  }, [groupByWord, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <EpilogueStatic />
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Closing thought"
      className="relative bg-[#fffaf0]"
      style={{ height: `${PIN_TRACK_VH}vh` }}
    >
      <div
        className={`sticky top-0 box-border h-[100svh] overflow-hidden bg-[#fffaf0] ${VIEWPORT_GUTTER_CLASS}`}
      >
        <h2 className="sr-only">Closing thought</h2>

        <EpilogueCard
          cardRef={cardRef}
          sceneOneRef={sceneOneRef}
          sceneTwoRef={sceneTwoRef}
          showShapeBlur
          pixelRatio={pixelRatio}
          sceneTwoHidden
          fillViewport
          groupByWord={groupByWord}
        />
      </div>
    </section>
  )
}
