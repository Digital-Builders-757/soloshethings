"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const stickyNavLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/blog", label: "Blog" },
  { href: "/map", label: "Map" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Picture Banner */}
      <section className="h-[175px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=175&fit=crop"
          alt="Travel banner"
          width={1920}
          height={175}
          className="h-full w-full object-cover"
          priority
        />
      </section>

      {/* Top Menu */}
      <header className="bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-primary">
              SoloSheThings
            </Link>
            
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/login" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6">Get Started</Button>
              </Link>
            </nav>

            <button type="button" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4">
              {stickyNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Sticky Menu */}
      <nav className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-sm transition-transform duration-300",
        isScrolled ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold tracking-wide text-primary">SoloSheThings</Link>
            
            <div className="hidden items-center gap-6 md:flex">
              {stickyNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Sign In</Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-full px-6">Get Started</Button>
              </Link>
            </div>

            <button type="button" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}