"use client"

import Link from "next/link"
import { Instagram, Globe, Mail } from "lucide-react"

const exploreLinks = [
  { href: "/blog", label: "Travel + SHE Things" },
  { href: "/collections", label: "Solo SHEntries" },
  { href: "/shop", label: "Shop" },
]

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
]

export function Footer() {
  return (
    <footer className="bg-[#7a331b] text-[#fff5df]">
      <div className="container mx-auto shell-inline py-14 md:py-16">
        <div className="grid gap-12 border-b border-white/12 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">
              Solo SHE Things
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold uppercase leading-none text-[#f7e8be] sm:text-5xl">
              SOLO <span className="italic text-[#fab642]">SHE</span> THINGS
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#fff5df]/78">
              A warmer, wiser corner of the internet for women traveling on their own terms, with stories, tools, and community to help every next step feel more possible.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="mailto:hello@soloshethings.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-[#fff5df] transition-colors hover:bg-white/14"
              >
                <Mail className="h-4 w-4" />
                hello@soloshethings.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-[#fff5df] transition-colors hover:bg-white/14"
              >
                <Globe className="h-4 w-4" />
                Contact us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fab642]">Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-[#fff5df]/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fab642]">Company</h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-[#fff5df]/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 text-sm text-[#fff5df]/72 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Solo SHE Things. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-[#fff5df] transition-colors hover:bg-white/14"
            >
              Start your journey
            </Link>
            <span className="inline-flex items-center gap-2 text-[#fff5df]/72">
              <Instagram className="h-4 w-4" />
              @soloshethings
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
