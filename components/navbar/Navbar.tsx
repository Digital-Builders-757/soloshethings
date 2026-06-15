'use client';

/**
 * Navbar
 *
 * Figma reference: center glass nav pill, logo left, login + CTA right.
 * GSAP: entry animation (opacity 0→1, y -30→0, 0.8s power3.out).
 * Nav items: vertical text-slide hover effect.
 * CTA button: subtle magnetic attraction on cursor proximity (max 4px).
 * Scroll: always transparent — no scroll-triggered background changes.
 * Auto-hide: direction-aware hide/show past 100px (GSAP y/opacity, 0.5s power3.inOut).
 * Mobile: hamburger → fullscreen overlay with GSAP stagger.
 * Respects prefers-reduced-motion.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

import { GlassSurface } from '@/components/effects/glass-surface';
import { useLenis } from '@/components/providers/lenis-provider';
import { getScrollY } from '@/lib/lenis/scroll-position';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blogs', href: '/blog' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const NAV_ALWAYS_VISIBLE_PX = 100;
const NAV_HIDE_DURATION     = 0.5;
const NAV_HIDE_EASE         = 'power3.inOut';
const NAV_SCROLL_DELTA_MIN  = 5;

/** Center glass nav — Figma artboard dimensions. */
const NAV_GLASS_WIDTH  = 659;
const NAV_GLASS_HEIGHT = 80;
const NAV_GLASS_RADIUS = 20;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Logo with mixed Anton / Covered By Your Grace typography */
function NavLogo() {
  return (
    <Link
      href="/"
      aria-label="Solo SHE Things — home"
      className="flex items-baseline gap-0 select-none shrink-0 min-w-0 lg:min-w-[234px]"
    >
      <span
        className="font-navbar-anton text-[1.25rem] leading-none tracking-tight uppercase text-[#080808] sm:text-[1.45rem] lg:text-[1.7rem]"
        aria-hidden="true"
      >
        SOLO&nbsp;
      </span>
      <span
        className="font-navbar-grace text-[1.45rem] leading-none text-black sm:text-[1.65rem] lg:text-[2rem]"
        aria-hidden="true"
      >
        SHE
      </span>
      <span
        className="font-navbar-anton text-[1.25rem] leading-none tracking-tight uppercase text-black sm:text-[1.45rem] lg:text-[1.7rem]"
        aria-hidden="true"
      >
        &nbsp;THINGS
      </span>
      {/* Screen-reader-only full name */}
      <span className="sr-only">Solo SHE Things</span>
    </Link>
  );
}

/** Single nav item with vertical text-slide hover effect */
function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const reduced = prefersReducedMotion();

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'group inline-block',
        'font-navbar-jakarta text-sm font-normal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm',
        reduced ? 'hover:opacity-70 transition-opacity' : '',
      ].join(' ')}
    >
      {reduced ? (
        <span>{item.label}</span>
      ) : (
        /*
         * Clipping wrapper: height is set naturally by Track 1 (one line of text).
         * overflow-hidden clips anything outside that height.
         * Track 2 starts at top:100% (= wrapper bottom = outside clip boundary).
         * Both tracks translate up by -100% of their own height on hover.
         * Because both tracks are identical text+font, their heights are equal,
         * so the translations are always in sync — no hardcoded px values needed.
         */
        <span className="relative inline-block leading-[1.4] overflow-hidden">
          {/* Track 1 — visible at rest, exits through the top on hover */}
          <span
            className="block group-hover:-translate-y-full transition-transform duration-300 ease-out will-change-transform"
          >
            {item.label}
          </span>
          {/* Track 2 — hidden below clip at rest, enters from bottom on hover */}
          <span
            aria-hidden="true"
            className="absolute top-full left-0 w-full group-hover:-translate-y-full transition-transform duration-300 ease-out will-change-transform"
          >
            {item.label}
          </span>
        </span>
      )}
    </Link>
  );
}

/** Magnetic CTA button — cursor proximity pulls it ≤ 4px */
function MagneticCTA({ href, label }: { href: string; label: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const reduced = prefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduced || !btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Map distance to ≤ 4px movement
      const maxShift = 4;
      const maxDist = Math.max(rect.width, rect.height);
      const x = (dx / maxDist) * maxShift;
      const y = (dy / maxDist) * maxShift;

      gsap.to(btnRef.current, {
        x,
        y,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [reduced],
  );

  const handleMouseLeave = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  }, []);

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={[
        'inline-flex items-center justify-center shrink-0',
        'min-w-[205px] h-[70px] rounded-[20px]',
        'bg-black text-background font-navbar-jakarta text-sm font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50',
        'will-change-transform',
        !reduced
          ? 'transition-shadow duration-200 hover:shadow-lg'
          : 'hover:opacity-80 transition-opacity',
      ].join(' ')}
    >
      {label}
    </a>
  );
}

/** Hamburger / close icon that morphs between states */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative w-5 h-4 flex flex-col justify-between">
      <span
        className={[
          'block h-[1.5px] w-full bg-current rounded-full',
          'transition-all duration-300 origin-center',
          open ? 'rotate-45 translate-y-[7px]' : '',
        ].join(' ')}
      />
      <span
        className={[
          'block h-[1.5px] w-full bg-current rounded-full',
          'transition-all duration-300',
          open ? 'opacity-0 scale-x-0' : '',
        ].join(' ')}
      />
      <span
        className={[
          'block h-[1.5px] w-full bg-current rounded-full',
          'transition-all duration-300 origin-center',
          open ? '-rotate-45 -translate-y-[9px]' : '',
        ].join(' ')}
      />
    </span>
  );
}

/** Fullscreen mobile overlay */
function MobileMenu({
  open,
  onClose,
  isAuthenticated,
}: {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const reduced = prefersReducedMotion();
  const { lenis, isEnabled } = useLenis();

  // GSAP entrance / exit
  useEffect(() => {
    if (!overlayRef.current || !itemsRef.current) return;

    const ctx = gsap.context(() => {
      if (open) {
        gsap.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: reduced ? 0 : 0.35, ease: 'power2.out' },
        );
        if (!reduced) {
          gsap.fromTo(
            Array.from(itemsRef.current!.children),
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.07,
              ease: 'power3.out',
              delay: 0.1,
            },
          );
        }
      } else {
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: reduced ? 0 : 0.25,
          ease: 'power2.in',
        });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [open, reduced]);

  // Trap focus & close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Prevent body scroll while open; pause Lenis smooth scroll when active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (isEnabled && lenis) {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (isEnabled && lenis) {
        lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (isEnabled && lenis) {
        lenis.start();
      }
    };
  }, [open, lenis, isEnabled]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      // Start hidden; GSAP controls visibility
      style={{ visibility: open ? 'visible' : 'hidden', opacity: open ? undefined : 0 }}
      className={[
        'fixed inset-0 z-40',
        'bg-background/98 backdrop-blur-md',
        'flex flex-col',
      ].join(' ')}
    >
      {/* Spacer = safe-area + navbar height (mobile compact, desktop original) */}
      <div
        className="shrink-0 h-[calc(env(safe-area-inset-top,0px)+3.5rem)] lg:h-[126px]"
        aria-hidden="true"
      />

      {/* Nav items */}
      <nav aria-label="Mobile navigation" className="flex-1 flex items-center justify-center px-8">
        <ul ref={itemsRef} className="flex flex-col gap-8 items-center list-none p-0 m-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="font-navbar-jakarta text-4xl font-medium tracking-tight text-foreground hover:opacity-50 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom CTA */}
      <div className="shrink-0 flex flex-col items-center gap-5 px-8 pb-12">
        <a
          href={isAuthenticated ? '/dashboard' : '/login'}
          onClick={onClose}
          className="font-navbar-jakarta text-base font-normal text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm"
        >
          {isAuthenticated ? 'Dashboard' : 'Log in'}
        </a>
        <a
          href={isAuthenticated ? '/profile' : '/signup'}
          onClick={onClose}
          className="font-navbar-jakarta w-full max-w-xs text-center px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold"
        >
          {isAuthenticated ? 'My account' : 'Start Free Trial'}
        </a>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface NavbarProps {
  /** Resolved server-side via getUser() — never stale client session. */
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = prefersReducedMotion();
  const isNavVisibleRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const { lenis, isEnabled } = useLenis();

  // ── Entry animation ────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!navRef.current) return;

    if (reduced) {
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
      );
    }, navRef);

    return () => ctx.revert();
  }, [reduced]);

  // ── Premium auto-hide on scroll direction ───────────────────────────────────
  useEffect(() => {
    if (reduced || !navRef.current) return;

    lastScrollYRef.current = getScrollY(lenis, isEnabled);

    const setNavVisible = (visible: boolean) => {
      if (visible === isNavVisibleRef.current || !navRef.current) return;
      isNavVisibleRef.current = visible;

      scrollTweenRef.current?.kill();
      scrollTweenRef.current = gsap.to(navRef.current, {
        y: visible ? 0 : '-120%',
        opacity: visible ? 1 : 0,
        duration: NAV_HIDE_DURATION,
        ease: NAV_HIDE_EASE,
        overwrite: 'auto',
        onStart: () => {
          if (navRef.current && !visible) {
            navRef.current.style.pointerEvents = 'none';
          }
        },
        onComplete: () => {
          if (navRef.current) {
            navRef.current.style.pointerEvents = visible ? 'auto' : 'none';
          }
        },
      });

    };

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        if (mobileOpen) return;

        const scrollY = getScrollY(lenis, isEnabled);
        const delta = scrollY - lastScrollYRef.current;

        if (Math.abs(delta) < NAV_SCROLL_DELTA_MIN) return;

        const scrollingDown = delta > 0;

        if (scrollY <= NAV_ALWAYS_VISIBLE_PX) {
          setNavVisible(true);
        } else if (scrollingDown) {
          setNavVisible(false);
        } else {
          setNavVisible(true);
        }

        lastScrollYRef.current = scrollY;
      });
    };

    if (isEnabled && lenis) {
      lenis.on('scroll', handleScroll);
      return () => {
        lenis.off('scroll', handleScroll);
        scrollTweenRef.current?.kill();
      };
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollTweenRef.current?.kill();
    };
  }, [reduced, mobileOpen, lenis, isEnabled]);

  // ── Close mobile menu on route change ─────────────────────────────────────
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Schedule outside current render cycle to avoid cascading-setState lint
      const id = setTimeout(() => setMobileOpen(false), 0);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        ref={navRef}
        // Invisible until GSAP sets opacity
        style={{ opacity: 0 }}
        className="fixed inset-x-0 top-0 z-50 bg-transparent pt-[env(safe-area-inset-top,0px)] will-change-transform lg:top-[44px] lg:pt-0"
      >
        {/* Max-width matches Figma artboard: 1798px */}
        <div className="mx-auto max-w-[1798px] w-full px-4 lg:px-8 xl:px-16">
          {/* Mobile: [logo | menu] — Desktop: [logo | nav pill | cta] */}
          <div className="grid grid-cols-[1fr_auto] items-center h-14 md:grid-cols-[1fr_auto_1fr] lg:h-[82px]">

            {/* ── Zone 1: Logo (left-aligned) ───────────────────────────── */}
            <div className="flex min-w-0 items-center justify-self-start">
              <NavLogo />
            </div>

            {/* ── Zone 2: Desktop nav — glass surface pill (md+) ─────────── */}
            <nav
              aria-label="Primary navigation"
              className="hidden justify-self-center md:block"
            >
              <GlassSurface
                width={NAV_GLASS_WIDTH}
                height={NAV_GLASS_HEIGHT}
                borderRadius={NAV_GLASS_RADIUS}
                borderWidth={0.07}
                backgroundOpacity={0.1}
                brightness={50}
                opacity={0.93}
                blur={11}
                displace={0.5}
                saturation={1}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                mixBlendMode="screen"
                surfaceMode="light"
                className="shrink-0"
              >
                <ul className="m-0 flex h-full w-full list-none items-center justify-center gap-8 p-0">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className="flex items-center px-[20px]">
                      <NavLink item={item} />
                    </li>
                  ))}
                </ul>
              </GlassSurface>
            </nav>

            {/* ── Zone 3: Login + CTA + Mobile hamburger (right-aligned) ── */}
            <div className="col-start-2 flex items-center justify-end gap-6 justify-self-end md:col-start-auto">
              {/* Desktop CTA group */}
              <div className="hidden md:flex items-center gap-6">
                <a
                  href={isAuthenticated ? '/dashboard' : '/login'}
                  className="font-navbar-jakarta text-sm font-normal text-foreground/80 hover:text-foreground transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm whitespace-nowrap"
                >
                  {isAuthenticated ? 'Dashboard' : 'Log in'}
                </a>
                <MagneticCTA
                  href={isAuthenticated ? '/profile' : '/signup'}
                  label={isAuthenticated ? 'My account' : 'Start Free Trial'}
                />
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                <HamburgerIcon open={mobileOpen} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div id="mobile-menu">
        <MobileMenu open={mobileOpen} onClose={closeMobile} isAuthenticated={isAuthenticated} />
      </div>
    </>
  );
}
