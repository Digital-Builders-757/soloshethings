"use client"

import Link from "next/link"
import { useState } from "react"
import { Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const exploreLinks = [
  { href: "/blog", label: "Stories" },
  { href: "/collections", label: "Solo SHEtories" },
  { href: "/destinations", label: "Destinations" },
]

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
]

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <footer className="bg-[#e34b16]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Globe className="h-6 w-6 text-white" />
              <span className="font-serif text-lg font-bold text-white">SHE</span>
            </Link>
            <div className="mt-2">
              <span className="inline-block rounded bg-[#7a331b] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Solo SHE Things
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Empowering women to explore the world on their own terms.
            </p>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-white">Newsletter</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
              />
              <Button
                type="submit"
                className="mt-2 w-full rounded-md bg-[#fab642] text-sm font-semibold text-[#3a3a3a] hover:bg-[#f5a830]"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row">
          <p className="text-sm text-white/80">
            &copy; 2026 Solo SHE Things. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-white/80 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/80 transition-colors hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
