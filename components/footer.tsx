"use client"

import Link from "next/link"
import { useState } from "react"

const footerLinks = {
  explore: [
    { href: "/blog", label: "Stories" },
    { href: "/collections", label: "Solo SHEntries" },
    { href: "/destinations", label: "Destinations" },
  ],
  resources: [
    { href: "/blog?category=safety", label: "Safety Guides" },
    { href: "/blog?category=packing", label: "Packing Lists" },
    { href: "/blog?category=tips", label: "Travel Tips" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer>
      {/* Top Section - #f7e8e5 */}
      <div className="bg-[#f7e8e5] py-12 md:py-16">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b3a3a] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[#8b3a3a]">SHE</span>
            </div>
            <div className="mt-3 inline-block rounded bg-[#c53030] px-3 py-1 text-xs font-bold uppercase text-white">
              Solo SHE Things
            </div>
            <p className="mt-4 text-sm text-[#4b5563]">
              Empowering women to explore the world on their own terms.
            </p>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-[#111827]">
              Newsletter
            </h4>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-[#e5e7eb] bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#df4915]"
              />
              <button
                type="submit"
                className="rounded bg-[#df4915] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c4400f]"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-[#111827]">
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4b5563] hover:text-[#df4915]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase text-[#111827]">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#4b5563] hover:text-[#df4915]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Bar - #e2402a */}
      <div className="bg-[#e2402a] py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-white">
          Conspicuous Legal Links Below
        </p>
      </div>

      {/* Bottom Section - #4b2c2a */}
      <div className="bg-[#4b2c2a] py-4">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-5 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-xs text-white/80">
            &copy; {new Date().getFullYear()} Solo SHE Things. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-white/80 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/80 hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
