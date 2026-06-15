'use client'

import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EXPLORE_LINKS = [
  { href: '/blog', label: 'Travel + SHE Things' },
  { href: '/collections', label: 'Solo SHEntries' },
  { href: '/shop', label: 'Shop' },
] as const

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
] as const

const INSTAGRAM_HREF = 'https://instagram.com'

const FOOTER_LOGO_ANTON = 'text-[clamp(2rem,4.2vw,3.25rem)]'
const FOOTER_LOGO_GRACE = 'text-[clamp(2.35rem,5vw,3.85rem)]'

/** Matches hero / epilogue — mobile is below this width. */
const FOOTER_DESKTOP_BREAKPOINT = 1024

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function fitFooterStoryHeadline(track: HTMLElement, headline: HTMLElement) {
  const availableWidth = track.clientWidth
  if (availableWidth <= 0) return

  headline.style.letterSpacing = '0px'

  const minPx = 44
  const maxPx = Math.ceil(availableWidth * 1.15)
  let low = minPx
  let high = maxPx
  let best = minPx

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    headline.style.fontSize = `${mid}px`

    if (headline.scrollWidth <= availableWidth) {
      best = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  headline.style.fontSize = `${best}px`
  headline.style.lineHeight = '0.78'

  const gapCount = Math.max((headline.textContent ?? '').replace(/\s/g, '').length - 1, 1)
  const remaining = availableWidth - headline.scrollWidth

  if (remaining > 0.5) {
    headline.style.letterSpacing = `${remaining / gapCount}px`
  }
}

function FooterLogo() {
  return (
    <Link
      href="/"
      aria-label="Solo SHE Things — home"
      className="flex items-baseline gap-0 select-none max-lg:self-start"
    >
      <span
        className={`font-navbar-anton ${FOOTER_LOGO_ANTON} leading-none tracking-tight uppercase text-[#fff8ee]`}
        aria-hidden="true"
      >
        SOLO&nbsp;
      </span>
      <span
        className={`font-navbar-grace ${FOOTER_LOGO_GRACE} leading-none text-[#fff8ee]`}
        aria-hidden="true"
      >
        SHE
      </span>
      <span
        className={`font-navbar-anton ${FOOTER_LOGO_ANTON} leading-none tracking-tight uppercase text-[#fff8ee]`}
        aria-hidden="true"
      >
        &nbsp;THINGS
      </span>
      <span className="sr-only">Solo SHE Things</span>
    </Link>
  )
}

interface FooterLinkColumnProps {
  title: string
  links: ReadonlyArray<{ href: string; label: string }>
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h3 className="font-navbar-jakarta text-xs font-medium uppercase tracking-[0.28em] text-[#fff8ee]/55">
        {title}
      </h3>
      <ul className="mt-8 space-y-4 max-lg:mt-5 max-lg:space-y-3 md:mt-10 md:space-y-5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-navbar-jakarta text-base leading-snug text-[#fff8ee]/88 transition-colors duration-300 hover:text-[#fff8ee] md:text-lg"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FooterTextLinkProps {
  href: string
  children: ReactNode
  external?: boolean
}

function FooterTextLink({ href, children, external = false }: FooterTextLinkProps) {
  const className =
    'font-navbar-jakarta text-base text-[#fff8ee]/82 underline decoration-[#fff8ee]/25 underline-offset-[0.28em] transition-colors duration-300 hover:text-[#fff8ee] hover:decoration-[#fff8ee]/55 md:text-lg'

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function FooterContactLinks() {
  return (
    <ul className="mt-10 space-y-4 max-lg:mt-0 max-lg:space-y-3 md:mt-12 md:space-y-5 lg:mt-10">
      <li>
        <FooterTextLink href="mailto:hello@soloshethings.com" external>
          hello@soloshethings.com
        </FooterTextLink>
      </li>
      <li>
        <FooterTextLink href="/contact">Contact us</FooterTextLink>
      </li>
      <li>
        <FooterTextLink href={INSTAGRAM_HREF} external>
          Instagram — @soloshethings
        </FooterTextLink>
      </li>
    </ul>
  )
}

function FooterBottomBar() {
  return (
    <div className="shrink-0 border-t border-[#fff8ee]/12 pt-6 max-lg:px-[15px] max-lg:pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] md:pt-8 lg:mt-0">
      <div className="flex flex-col gap-5 max-lg:gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <p className="font-navbar-jakarta text-sm tracking-[0.04em] text-[#fff8ee]/62 max-lg:shrink-0 md:text-base">
          &copy; 2026 SOLO SHE THINGS
        </p>
        <p className="max-w-md font-navbar-jakarta text-sm leading-relaxed text-[#fff8ee]/55 max-lg:max-w-none md:text-right md:text-base">
          Made for women who travel alone,
          <br className="hidden sm:block" />
          {' '}
          but never feel alone.
        </p>
      </div>
    </div>
  )
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const desktopPanelRef = useRef<HTMLDivElement>(null)
  const headlineTrackRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const footer = footerRef.current
    const desktopPanel = desktopPanelRef.current
    const track = headlineTrackRef.current
    const headline = headlineRef.current
    if (!footer || !desktopPanel || !track || !headline) return

    const syncHeadlineSize = () => {
      if (window.innerWidth < FOOTER_DESKTOP_BREAKPOINT) {
        headline.style.fontSize = ''
        headline.style.letterSpacing = ''
        headline.style.lineHeight = ''
        return
      }

      if (desktopPanel.clientWidth === 0 || track.clientWidth === 0) return

      fitFooterStoryHeadline(track, headline)
    }

    syncHeadlineSize()
    requestAnimationFrame(syncHeadlineSize)

    window.addEventListener('resize', syncHeadlineSize)

    const desktopMq = window.matchMedia(`(min-width: ${FOOTER_DESKTOP_BREAKPOINT}px)`)
    desktopMq.addEventListener('change', syncHeadlineSize)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncHeadlineSize) : undefined
    resizeObserver?.observe(desktopPanel)
    resizeObserver?.observe(track)

    const fontsReady = document.fonts?.ready
    if (fontsReady) {
      void fontsReady.then(syncHeadlineSize)
    }

    let ctx: gsap.Context | undefined

    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.from(headline, {
          scrollTrigger: {
            trigger: footer,
            start: 'top 82%',
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 1.05,
          ease: 'power2.out',
        })
      }, footer)
    }

    return () => {
      window.removeEventListener('resize', syncHeadlineSize)
      desktopMq.removeEventListener('change', syncHeadlineSize)
      resizeObserver?.disconnect()
      ctx?.revert()
    }
  }, [])

  return (
    <div className="box-border bg-[#fffaf0] px-[15px] pt-[15px] max-lg:flex max-lg:h-[calc(100svh-15px)] max-lg:max-h-[calc(100svh-15px)] max-lg:flex-col max-lg:pt-0 max-lg:mb-0 lg:-mb-[max(1rem,env(safe-area-inset-bottom,0px))] lg:h-[100dvh]">
      {/* Mobile top cream gutter — matches the 15px left/right inset */}
      <div className="h-[15px] shrink-0 max-lg:block lg:hidden" aria-hidden="true" />
      <footer
        ref={footerRef}
        className="flex w-full flex-col rounded-t-[3rem] bg-[#0c1015] text-[#fff8ee] max-lg:h-[calc(100svh-30px)] max-lg:max-h-[calc(100svh-30px)] max-lg:shrink-0 max-lg:overflow-hidden max-lg:rounded-t-[2rem] md:rounded-t-[2.75rem] lg:h-full lg:rounded-t-[3rem]"
        aria-labelledby="footer-heading"
      >
        <h2 id="footer-heading" className="sr-only">
          Site footer
        </h2>

        {/* ── Mobile layout (< lg) — unchanged ───────────────────────────── */}
        <div className="flex h-full w-full flex-col lg:hidden">
          <div className="shrink-0 px-[15px] pt-[22px]">
            <FooterLogo />
          </div>

          <div
            data-lenis-prevent
            className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-[15px] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
          >
            <div className="grid min-h-0 shrink gap-8">
              <FooterContactLinks />
              <FooterLinkColumn title="Explore" links={EXPLORE_LINKS} />
              <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
            </div>
          </div>

          <FooterBottomBar />
        </div>

        {/* ── Desktop layout (lg+) — original unified editorial structure ─ */}
        <div
          ref={desktopPanelRef}
          className="hidden h-full w-full flex-col justify-between lg:flex lg:px-16 lg:py-12"
        >
          <div ref={headlineTrackRef} className="w-full shrink-0">
            <p
              ref={headlineRef}
              className="footer-story-headline m-0 block w-full overflow-hidden whitespace-nowrap font-navbar-jakarta text-[#fff8ee] font-bold uppercase leading-[0.78]"
            >
              TRAVEL
            </p>
          </div>

          <div className="grid min-h-0 shrink gap-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,0.75fr)]">
            <div className="max-w-xl">
              <FooterLogo />

              <ul className="mt-10 space-y-4 md:mt-12 md:space-y-5">
                <li>
                  <FooterTextLink href="mailto:hello@soloshethings.com" external>
                    hello@soloshethings.com
                  </FooterTextLink>
                </li>
                <li>
                  <FooterTextLink href="/contact">Contact us</FooterTextLink>
                </li>
                <li>
                  <FooterTextLink href={INSTAGRAM_HREF} external>
                    Instagram — @soloshethings
                  </FooterTextLink>
                </li>
              </ul>
            </div>

            <FooterLinkColumn title="Explore" links={EXPLORE_LINKS} />
            <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
          </div>

          <div className="shrink-0 border-t border-[#fff8ee]/12 pt-6 md:pt-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
              <p className="font-navbar-jakarta text-sm tracking-[0.04em] text-[#fff8ee]/62 md:text-base">
                &copy; 2026 SOLO SHE THINGS
              </p>
              <p className="max-w-md font-navbar-jakarta text-sm leading-relaxed text-[#fff8ee]/55 md:text-right md:text-base">
                Made for women who travel alone,
                <br className="hidden sm:block" />
                {' '}
                but never feel alone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
