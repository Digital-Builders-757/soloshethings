"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

type NavLink = {
  href: string
  label: string
}

function isRouteActive(pathname: string, href: string) {
  if (pathname === href) return true
  if (href === "/") return false
  return pathname.startsWith(`${href}/`)
}

type NavClientProps = {
  publicLinks: NavLink[]
  authLinks?: NavLink[]
  isAuthenticated: boolean
  /** Shown subtly when signed in (e.g. email) — from server `getUser()`, no stale client session. */
  accountHint?: string
  showStickyNav?: boolean
}

export function NavClient({
  publicLinks,
  authLinks = [],
  isAuthenticated,
  accountHint,
  showStickyNav = true,
}: NavClientProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!showStickyNav) return

    const handleScroll = () => setIsScrolled(window.scrollY > 56)
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showStickyNav])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.removeProperty("overflow")
      return
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.removeProperty("overflow")
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  function renderAccountNavDesktop() {
    if (!isAuthenticated) return null
    return (
      <nav
        aria-label="Your account"
        className="flex flex-shrink-0 flex-wrap items-center justify-end gap-x-1 gap-y-1.5 border-l border-[#e8d8bc]/50 pl-4 lg:pl-5"
      >
        {authLinks.map((link) => {
          const isActive = isRouteActive(pathname, link.href)
          const isDashboard = link.href === '/dashboard'
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap px-2 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors',
                isActive
                  ? 'text-[#e34b16]'
                  : 'text-[#7a331b]/70 hover:text-[#e34b16]',
                isDashboard && !isActive && 'rounded-full border border-[#ead8c2]/80 bg-[#fffaf0] px-2.5'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </Link>
          )
        })}
        <LogoutButton className="flex-shrink-0" />
      </nav>
    )
  }

  function renderAccountNavMobile() {
    if (!isAuthenticated) return null
    return (
      <div className="mt-6 border-t border-brand-pinkDark/12 bg-brand-cream/20 px-3 py-5 pb-1">
        <p className="eyebrow px-1 text-[0.65rem] tracking-[0.22em]">Your account</p>
        {accountHint ? (
          <p className="mt-3 truncate px-1 text-xs font-medium leading-snug text-brand-blue/85" title={accountHint}>
            {accountHint}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-1">
          {authLinks.map((link) => {
            const isActive = isRouteActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex min-h-12 items-center rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-white text-brand-orange shadow-sm ring-1 ring-brand-orange/20"
                    : "text-brand-blue hover:bg-white/70 hover:text-brand-orange"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-3">
            <LogoutButton className="flex min-h-12 w-full items-center justify-center px-6 text-sm" />
          </div>
        </div>
      </div>
    )
  }

  const guestActionsDesktop = !isAuthenticated && (
    <div className="flex items-center gap-3">
      <Link href="/login" className="cta-ghost min-h-11 px-0 text-[#3a3a3a] hover:text-[#e34b16]">
        Sign In
      </Link>
      <Button asChild className="cta-primary h-11 px-6 py-0 text-sm hover:bg-[#c74010]">
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )

  return (
    <>
      <header className="relative z-40 border-b border-[#e8d8bc]/60 bg-[#fffdf8]/96 backdrop-blur-md">
        <div className="container mx-auto hidden grid-cols-[auto_1fr_auto] items-center gap-3 py-3 shell-inline lg:grid lg:gap-5 xl:gap-6">
          <Link href="/" className="min-w-0 shrink-0 leading-none text-[#e34b16]">
            <span className="wordmark text-[clamp(1.35rem,2.2vw,1.9rem)]">
              SOLO <span className="wordmark-accent">SHE</span> THINGS
            </span>
          </Link>

          <nav
            className="flex min-w-0 w-full items-center justify-center gap-3 overflow-x-auto [scrollbar-width:none] sm:gap-4 md:gap-5 xl:gap-7 [&::-webkit-scrollbar]:hidden"
            aria-label="Main navigation"
          >
            {publicLinks.map((link) => {
              const isActive = isRouteActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-chip shrink-0 sm:text-sm sm:tracking-[0.14em]",
                    isActive && "nav-chip-active"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex min-w-0 justify-end">
            {isAuthenticated ? renderAccountNavDesktop() : guestActionsDesktop}
          </div>
        </div>

        <div className="container mx-auto flex min-h-[3.25rem] items-center justify-between gap-3 py-3 shell-inline lg:hidden">
          <Link href="/" className="min-w-0 shrink leading-none text-brand-orange">
            <span className="wordmark block text-xl [text-shadow:0_1px_0_#7a331b]">
              SOLO <span className="wordmark-accent">SHE</span> THINGS
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-pinkDark/15 bg-white text-brand-pinkDark shadow-sm transition-colors hover:border-brand-orange/40 hover:text-brand-orange active:bg-brand-cream/40"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="max-h-[min(85dvh,40rem)] overflow-y-auto overscroll-y-contain border-t border-brand-pinkDark/12 bg-gradient-to-b from-white to-brand-cream/25 lg:hidden">
            <nav
              className="container mx-auto flex flex-col gap-0 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] shell-inline"
              aria-label="Mobile navigation"
            >
              <p className="mb-2 px-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-pinkDark/55">
                Site
              </p>
              <div className="flex flex-col gap-1">
              {publicLinks.map((link) => {
                const isActive = isRouteActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors",
                      isActive
                        ? "bg-brand-orange/10 text-brand-orange ring-1 ring-brand-orange/25"
                        : "text-brand-pinkDark hover:bg-brand-cream/50 hover:text-brand-orange"
                    )}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
              </div>

              {isAuthenticated ? (
                renderAccountNavMobile()
              ) : (
                <div className="mt-6 flex flex-col gap-3 border-t border-brand-pinkDark/12 pt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="cta-secondary h-12 min-h-12 border-brand-orange bg-white/95 py-0 text-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
                  >
                    <Link href="/login" onClick={closeMobileMenu} className="flex items-center justify-center">
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="cta-primary h-12 min-h-12 py-0 text-white hover:bg-[#c74010]">
                    <Link href="/signup" onClick={closeMobileMenu} className="flex items-center justify-center">
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {showStickyNav && (
        <nav
          className={cn(
            "fixed inset-x-0 top-0 z-50 hidden border-b border-[#e8d8bc]/60 bg-[#fffdf8]/96 pt-[env(safe-area-inset-top,0px)] shadow-[0_20px_60px_rgba(122,51,27,0.10)] backdrop-blur-md transition-all duration-300 lg:block",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          aria-label="Sticky navigation"
        >
          <div className="container mx-auto flex items-center justify-between gap-3 py-2.5 shell-inline lg:gap-5">
            <Link href="/" className="wordmark-sticky min-w-0 shrink-0 text-base lg:text-lg">
              SOLO <span className="wordmark-accent">SHE</span> THINGS
            </Link>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden">
              {publicLinks.map((link) => {
                const isActive = isRouteActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "nav-chip shrink-0 text-[0.65rem] xl:text-xs xl:tracking-[0.14em]",
                      isActive && "nav-chip-active"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex flex-shrink-0 justify-end">
              {isAuthenticated ? renderAccountNavDesktop() : guestActionsDesktop}
            </div>
          </div>
        </nav>
      )}
    </>
  )
}
