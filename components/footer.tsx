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
    <footer className="relative bg-[#e34b16]">
      {/* Brown decorative wavy line at top */}
      <div className="absolute -top-1 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block h-[30px] w-full md:h-[50px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,25 Q180,45 360,25 T720,25 T1080,25 T1440,25"
            stroke="#7a331b"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M0,35 Q180,15 360,35 T720,35 T1080,35 T1440,35"
            stroke="#7a331b"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
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
