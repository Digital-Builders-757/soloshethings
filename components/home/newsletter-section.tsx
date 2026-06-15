'use client'

import { useEffect, useRef } from 'react'

import { ShapeBlur } from '@/components/effects/shape-blur'
import { HomepageInterestForm } from '@/components/home/homepage-interest-form'
import { TravellersLetterVisualFrame } from '@/components/home/travellers-letter-visual'
import {
  useCappedDevicePixelRatio,
  usePrefersReducedMotion,
} from '@/lib/hooks/use-client-media'

const LETTER_TAGS = [
  'Travel Stories',
  'Safety Tips',
  'Hidden Gems',
  'Community Notes',
] as const

const CARD_DISPLAY_LINE =
  'block font-navbar-jakarta text-[clamp(3rem,6.5vw,5.25rem)] font-bold leading-[1.04] tracking-[-0.02em] max-lg:text-[clamp(1.625rem,7.25vw,2.125rem)] max-lg:leading-[1.08]'

const CARD_BODY_COPY =
  'max-w-[50cqw] font-navbar-jakarta text-[30px] font-normal leading-[35px] tracking-[0.01em] text-[#fffaf0] max-lg:max-w-none max-lg:text-[15px] max-lg:leading-[22px] max-lg:text-pretty max-lg:hyphens-none'

/** Matches epilogue card — equal 15px cream gutter on left and right. */
const SECTION_GUTTER_CLASS = 'px-[15px]'

export function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const pixelRatio = useCappedDevicePixelRatio()
  const reduceMotion = usePrefersReducedMotion(true)

  useEffect(() => {
    if (reduceMotion) return

    const section = sectionRef.current
    if (!section) return

    section.style.opacity = '0'
    section.style.transform = 'translateY(24px)'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        section.style.transition = 'opacity 800ms ease, transform 800ms ease'
        section.style.opacity = '1'
        section.style.transform = 'translateY(0)'
        observer.disconnect()
      },
      { threshold: 0.12 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="travellers-letter-heading"
      className={`bg-[#fffaf0] py-20 md:py-28 lg:py-32 max-lg:py-12 ${SECTION_GUTTER_CLASS}`}
    >
      <div className="w-full">
        <h2
          id="travellers-letter-heading"
          className="mb-5 max-w-[14ch] font-serif text-[clamp(2.75rem,9vw,6.25rem)] font-bold leading-[0.9] tracking-[-0.025em] text-[#0c1015] sm:mb-6 md:mb-8 lg:mb-10 max-lg:mb-4 max-lg:text-[clamp(2.125rem,7.5vw,2.75rem)] max-lg:leading-[0.92]"
        >
          The Traveller&apos;s
          <br />
          Letter
        </h2>

        <div
          ref={cardRef}
          className="@container relative flex w-full flex-col overflow-hidden rounded-[2rem] bg-[#0c1015] px-8 pt-14 pb-14 max-lg:h-auto max-lg:px-5 max-lg:pt-8 max-lg:pb-8 md:rounded-[2.75rem] md:px-12 md:pt-16 md:pb-16 lg:h-[45rem] lg:max-h-[45rem] lg:rounded-[3rem] lg:px-16 lg:pt-20 lg:pb-20 xl:px-20 xl:pt-24 xl:pb-24"
        >
          <div className="relative z-0 grid h-full min-h-0 w-full flex-1 items-stretch gap-10 max-lg:grid-cols-1 max-lg:h-auto max-lg:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,35rem)] lg:gap-12 xl:gap-16">
            <div className="flex h-full min-h-0 flex-col justify-start gap-10 max-lg:contents max-lg:gap-5 lg:justify-between lg:gap-0">
              <p className="shrink-0 max-lg:order-1 max-lg:translate-y-0 lg:-translate-y-[35px]">
                <span className={`${CARD_DISPLAY_LINE} text-[#fffaf0]`}>Stories.</span>
                <span className={`${CARD_DISPLAY_LINE} text-[#fffaf0]`}>Safety Notes.</span>
                <span className={`${CARD_DISPLAY_LINE} text-[#9da3ab]`}>Hidden Places.</span>
              </p>

              <div className="flex w-full shrink-0 flex-col items-start text-left max-lg:contents lg:translate-y-5">
                <ul
                  className="flex flex-wrap justify-start gap-2.5 max-lg:order-3 max-lg:gap-2"
                  aria-label="Letter topics"
                >
                  {LETTER_TAGS.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[#fffaf0]/20 bg-[#10141c] px-4 py-2 font-navbar-jakarta text-[14px] font-medium uppercase tracking-[0.10em] text-[#fffaf0] max-lg:px-3 max-lg:py-1.5 max-lg:text-[11px] max-lg:tracking-[0.08em]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <p className={`mt-6 w-full text-left max-lg:order-4 max-lg:mt-0 md:mt-8 ${CARD_BODY_COPY}`}>
                  Practical travel wisdom, honest reflections, safety lessons, and community stories from
                  women exploring the world on their own terms.
                </p>
              </div>
            </div>

            <div
              ref={rightColumnRef}
              className="flex h-full min-h-0 flex-col items-stretch justify-between max-lg:contents max-lg:gap-5"
            >
              <TravellersLetterVisualFrame
                containerRef={rightColumnRef}
                className="max-lg:order-2 lg:self-end"
              />

              <div
                data-travellers-letter-form
                className="mt-6 w-full min-w-0 shrink-0 max-lg:order-5 max-lg:mt-0 lg:mt-8 lg:translate-y-5"
              >
                <HomepageInterestForm
                  source="homepage_newsletter"
                  formLabel="Email for The Traveller's Letter"
                  submitLabel="Join The Letter"
                  variant="editorial"
                  stacked
                />
              </div>
            </div>
          </div>

          {!reduceMotion ? (
            <div className="pointer-events-none absolute inset-0 z-10 max-lg:hidden">
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
      </div>
    </section>
  )
}
