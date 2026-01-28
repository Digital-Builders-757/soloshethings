"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const stickyNavLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/blog", label: "Blog" },
  { href: "/map", label: "Map" },
]

const marqueeText =
  "EXPLORE THE WORLD  ·  TRAVEL FEARLESSLY  ·  DISCOVER NEW HORIZONS  ·  EMBRACE ADVENTURE  ·  "

interface HeaderProps {
  showBanner?: boolean
}

export function Header({ showBanner = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (showBanner ? 400 : 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showBanner])

  return (
    <>
      {/* Animated Gradient Banner - Only shown on home page */}
      {showBanner && (
        <section className="relative h-[200px] w-full overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=200&fit=crop"
            alt="Travel banner"
            width={1920}
            height={200}
            className="h-full w-full object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#db7093]/60 via-[#40e0d0]/40 to-[#9370db]/60 animate-gradient-shift bg-[length:200%_200%]" />

          {/* Animated Marquee Text */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-[#1a1a2e]/90 py-2">
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-4 inline-block font-mono text-sm font-medium tracking-widest text-white">
                {marqueeText}
                {marqueeText}
                {marqueeText}
                {marqueeText}
              </span>
            </div>
          </div>

          {/* Floating Sparkle Elements */}
          <div className="absolute left-[10%] top-[20%] animate-float">
            <Sparkles className="h-6 w-6 text-white/80" />
          </div>
          <div className="absolute right-[15%] top-[30%] animate-float" style={{ animationDelay: "1s" }}>
            <Sparkles className="h-4 w-4 text-white/60" />
          </div>
          <div className="absolute left-[30%] top-[40%] animate-float" style={{ animationDelay: "2s" }}>
            <Sparkles className="h-5 w-5 text-white/70" />
          </div>
        </section>
      )}

      {/* Top Menu with Glassmorphism */}
      <header className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wide text-primary animate-text-glow">
                SoloSheThings
              </span>
              <Sparkles className="h-5 w-5 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {stickyNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#db7093] after:to-[#40e0d0] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#db7093] after:to-[#40e0d0] after:transition-all hover:after:w-full"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-[#db7093] to-[#9370db] px-6 text-white transition-all hover:shadow-lg hover:shadow-[#db7093]/40 animate-glow-pulse"
                >
                  Get Started
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4">
              {stickyNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-primary/50 bg-transparent text-foreground hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#db7093] to-[#9370db] text-white">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Sticky Menu - Appears after scrolling */}
      <nav
        className={cn(
          "fixed left-0 right-0 top-0 z-50 glass border-b border-border/30 shadow-lg shadow-[#db7093]/10 transition-all duration-500",
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold tracking-wide text-primary">
              SoloSheThings
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {stickyNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#db7093] after:to-[#40e0d0] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#db7093] after:to-[#40e0d0] after:transition-all hover:after:w-full"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-[#db7093] to-[#9370db] px-6 text-white transition-all hover:shadow-lg hover:shadow-[#db7093]/40"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}