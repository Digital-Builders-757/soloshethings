"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

type NavLink = {
  href: string
  label: string
}

type NavClientProps = {
  publicLinks: NavLink[]
  authLinks?: NavLink[]
  isAuthenticated: boolean
  showStickyNav?: boolean
}

export function NavClient({
  publicLinks,
  authLinks = [],
  isAuthenticated,
  showStickyNav = true,
}: NavClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!showStickyNav) return

    const handleScroll = () => setIsScrolled(window.scrollY > 72)
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showStickyNav])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const actionArea = isAuthenticated ? (
    <div className="flex items-center gap-3">
      {authLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-semibold text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
        >
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </div>
  ) : (
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
        <div className="container mx-auto hidden grid-cols-[auto_1fr_auto] items-center gap-8 px-6 py-5 lg:grid">
          <Link href="/" className="leading-none text-[#e34b16]">
            <span className="block font-serif text-[1.9rem] font-bold uppercase tracking-[0.08em] text-[#f0dec2] [text-shadow:0_2px_0_#7a331b]">
              SOLO <span className="italic text-[#fab642]">SHE</span> THINGS
            </span>
          </Link>

          <nav className="flex items-center justify-center gap-7" aria-label="Main navigation">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition-colors hover:text-[#e34b16]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-end">{actionArea}</div>
        </div>

        <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:hidden">
          <Link href="/" className="leading-none text-[#e34b16]">
            <span className="block font-serif text-xl font-bold uppercase tracking-[0.08em] text-[#f0dec2] [text-shadow:0_1px_0_#7a331b]">
              SOLO <span className="italic text-[#fab642]">SHE</span> THINGS
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            className="rounded-full border border-[#ead8c2] p-2 text-[#7a331b] transition-colors hover:border-[#e34b16] hover:text-[#e34b16]"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[#ead8c2] bg-white lg:hidden">
            <nav className="container mx-auto flex flex-col gap-5 px-6 py-6" aria-label="Mobile navigation">
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

              <div className="border-t border-[#ead8c2] pt-5">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    {authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="text-sm font-semibold text-[#3a3a3a]"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <LogoutButton />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="h-11 rounded-full border-[#e34b16] text-[#e34b16] hover:bg-[#e34b16]/5 hover:text-[#e34b16]">
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
              </div>
            </nav>
          </div>
        )}
      </header>

      {showStickyNav && (
        <nav
          className={cn(
            "fixed inset-x-0 top-0 z-50 hidden border-b border-[#ead8c2] bg-white/95 shadow-[0_16px_50px_rgba(122,51,27,0.12)] backdrop-blur transition-all duration-300 lg:block",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          aria-label="Sticky navigation"
        >
          <div className="container mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
            <Link href="/" className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-[#7a331b]">
              SOLO <span className="italic text-[#e34b16]">SHE</span> THINGS
            </Link>

            <div className="flex items-center gap-6">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition-colors hover:text-[#e34b16]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>{actionArea}</div>
          </div>
        </nav>
      )}
    </>
  )
}
