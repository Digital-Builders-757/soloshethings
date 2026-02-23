/**
 * Nav Client Component
 * 
 * Client-side navigation with mobile menu interactivity
 * Receives nav links and auth state as props from Server Component
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

type NavLink = {
  href: string;
  label: string;
};

type NavClientProps = {
  publicLinks: NavLink[];
  authLinks?: NavLink[];
  isAuthenticated: boolean;
};

export function NavClient({
  publicLinks,
  authLinks = [],
  isAuthenticated,
}: NavClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  const authActions = isAuthenticated ? (
    <>
      {authLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="relative text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:text-[#FFD0A9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD0A9] after:transition-all hover:after:w-full"
        >
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="relative text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:text-[#FFD0A9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD0A9] after:transition-all hover:after:w-full"
      >
        Sign In
      </Link>
      <Link href="/signup">
        <Button
          size="sm"
          className="rounded-full bg-[#FB5315] px-6 text-white transition-all hover:bg-[#DD9917] hover:shadow-lg"
        >
          Get Started
        </Button>
      </Link>
    </>
  );

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#FB5315] py-2 text-center border-b border-white/30">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Discover your Solo SHE Adventure!
        </p>
      </div>

      {/* Header - scrolls with page */}
      <header className="bg-white">
        {/* Brand Name */}
        <div className="py-5 text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-sm font-semibold uppercase tracking-[0.25em] text-[#FB5315] md:text-base">
              Solo SHE Things Est. 2025
            </span>
          </Link>
        </div>
      </header>

      {/* Navigation - fixed, stays on scroll */}
      <div className="sticky top-0 z-40 border-b border-[#2044E0]/50 bg-[#2044E0] shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center md:justify-center">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:text-[#FFD0A9] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD0A9] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              {authActions}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#2044E0]/50 bg-[#2044E0]/98 backdrop-blur-lg md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white transition-colors hover:text-[#FFD0A9]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {isAuthenticated ? (
                  <>
                    {authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-white/50 bg-transparent text-white hover:bg-white/10"
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                    <div className="w-full">
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-white/50 bg-transparent text-white hover:bg-white/10"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#FB5315] text-white hover:bg-[#DD9917]">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

    </>
  );
}
