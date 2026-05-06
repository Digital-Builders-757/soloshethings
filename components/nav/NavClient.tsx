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

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  function renderAccountNavDesktop() {
    if (!isAuthenticated) return null
    return (
      <nav
        aria-label="Your account"
        className="flex flex-shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-2 border-l border-[#ead8c2] pl-4 lg:gap-x-3 lg:pl-5"
      >
        {accountHint ? (
          <span
            className="hidden max-w-[11rem] truncate text-xs font-medium text-[#6d5849] lg:block"
            title={accountHint}
          >
            {accountHint}
          </span>
        ) : null}
        {authLinks.map((link) => {
          const isActive = isRouteActive(pathname, link.href)
          const isDashboard = link.href === '/dashboard'
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'whitespace-nowrap rounded-full px-1.5 py-1 text-sm font-semibold transition-colors',
                isActive
                  ? 'text-[#e34b16] underline decoration-[#e34b16]/40 decoration-2 underline-offset-4'
                  : 'text-[#3a3a3a] hover:text-[#e34b16]',
                !isActive && isDashboard && 'bg-[#fffaf0] px-2.5 ring-1 ring-[#ead8c2]/90 ring-offset-1 ring-offset-white'
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
      <div className="border-t border-[#ead8c2] pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a14b24]">Your account</p>
        {accountHint ? (
          <p className="mt-2 truncate text-xs font-medium text-[#6d5849]" title={accountHint}>
            {accountHint}
          </p>
        ) : null}
        <div className="mt-3 flex flex-col gap-2">
          {authLinks.map((link) => {
            const isActive = isRouteActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "min-h-11 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive ? "bg-[#fffaf0] text-[#e34b16]" : "text-[#3a3a3a] hover:bg-[#fffaf0]/80"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-1">
            <LogoutButton className="w-full min-[400px]:w-auto" />
          </div>
        </div>
      </div>
    )
  }

  const guestActionsDesktop = !isAuthenticated && (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm font-semibold text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
      >
        Sign In
      </Link>
      <Button asChild className="h-11 rounded-full bg-[#e34b16] px-6 text-sm font-semibold text-white hover:bg-[#c74010]">
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  )

  return (
    <>
      <header className="relative z-40 border-b border-[#ead8c2] bg-white/95 backdrop-blur">
        <div className="container mx-auto hidden grid-cols-[auto_1fr_auto] items-center gap-3 py-3 shell-inline lg:grid lg:gap-5 xl:gap-6">
          <Link href="/" className="min-w-0 shrink-0 leading-none text-[#e34b16]">
            <span className="block font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold uppercase tracking-[0.08em] text-[#f0dec2] [text-shadow:0_2px_0_#7a331b]">
              SOLO <span className="italic text-[#fab642]">SHE</span> THINGS
            </span>
          </Link>

          <nav
            className="flex min-w-0 w-full items-center justify-center gap-3 overflow-x-auto [scrollbar-width:none] sm:gap-4 md:gap-5 xl:gap-7 [&::-webkit-scrollbar]:hidden"
            aria-label="Main navigation"
          >
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a331b] transition-colors hover:text-[#e34b16] sm:text-sm sm:tracking-[0.14em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 justify-end">
            {isAuthenticated ? renderAccountNavDesktop() : guestActionsDesktop}
          </div>
        </div>

        <div className="container mx-auto flex min-h-12 items-center justify-between py-2.5 shell-inline lg:hidden">
          <Link href="/" className="leading-none text-[#e34b16]">
            <span className="block font-serif text-xl font-bold uppercase tracking-[0.08em] text-[#f0dec2] [text-shadow:0_1px_0_#7a331b]">
              SOLO <span className="italic text-[#fab642]">SHE</span> THINGS
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            className="rounded-full border border-[#ead8c2] p-2 text-[#7a331b] transition-colors hover:border-[#e34b16] hover:text-[#e34b16]"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="max-h-[min(85dvh,40rem)] overflow-y-auto overscroll-y-contain border-t border-[#ead8c2] bg-white lg:hidden">
            <nav className="container mx-auto flex flex-col gap-4 py-5 shell-inline" aria-label="Mobile navigation">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition-colors hover:text-[#e34b16]"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                renderAccountNavMobile()
              ) : (
                <div className="flex flex-col gap-3 border-t border-[#ead8c2] pt-5">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-[#e34b16] text-[#e34b16] hover:bg-[#e34b16]/5 hover:text-[#e34b16]"
                  >
                    <Link href="/login" onClick={closeMobileMenu}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="h-11 rounded-full bg-[#e34b16] text-white hover:bg-[#c74010]">
                    <Link href="/signup" onClick={closeMobileMenu}>
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
            "fixed inset-x-0 top-0 z-50 hidden border-b border-[#ead8c2] bg-white/95 pt-[env(safe-area-inset-top,0px)] shadow-[0_16px_50px_rgba(122,51,27,0.12)] backdrop-blur transition-all duration-300 lg:block",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          aria-label="Sticky navigation"
        >
          <div className="container mx-auto flex items-center justify-between gap-3 py-2.5 shell-inline lg:gap-5">
            <Link href="/" className="min-w-0 shrink-0 font-serif text-base font-bold uppercase tracking-[0.08em] text-[#7a331b] lg:text-lg">
              SOLO <span className="italic text-[#e34b16]">SHE</span> THINGS
            </Link>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#7a331b] transition-colors hover:text-[#e34b16] xl:text-xs xl:tracking-[0.14em]"
                >
                  {link.label}
                </Link>
              ))}
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
