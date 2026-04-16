"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  showStickyNav?: boolean;
};

export function NavClient({
  publicLinks,
  authLinks = [],
  isAuthenticated,
  showStickyNav = true,
}: NavClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!showStickyNav) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showStickyNav]);

  const allLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  const authActions = isAuthenticated ? (
    <>
      {authLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
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
        className="text-sm font-medium text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
      >
        Sign In
      </Link>
      <Link href="/signup">
        <Button
          size="sm"
          className="rounded-full bg-[#e34b16] px-6 text-white transition-all hover:bg-[#c43d10]"
        >
          Get Started
        </Button>
      </Link>
    </>
  );

  return (
    <>
      {/* Main Nav - Clean white background */}
      <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-white">
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="container mx-auto hidden px-6 py-4 md:block">
          <nav className="flex items-center justify-center gap-8" aria-label="Main navigation">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Header - Only visible on mobile */}
        <div className="container mx-auto flex items-center justify-between px-6 py-3 md:hidden">
          <Link href="/" className="font-serif text-lg font-bold text-[#e34b16]">
            Solo SHE Things
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#3a3a3a]" />
            ) : (
              <Menu className="h-6 w-6 text-[#3a3a3a]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#e5e5e5] bg-white md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4" aria-label="Mobile navigation">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {isAuthenticated ? (
                  <>
                    {authLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-[#e34b16] text-[#e34b16] hover:bg-[#e34b16]/10">
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                    <div className="w-full"><LogoutButton /></div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-[#e34b16] text-[#e34b16] hover:bg-[#e34b16]/10">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#e34b16] text-white hover:bg-[#c43d10]">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Sticky Nav - Appears after scrolling */}
      {showStickyNav && (
        <nav
          className={cn(
            "fixed left-0 right-0 top-0 z-50 border-b border-[#e5e5e5] bg-white shadow-sm transition-all duration-500",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          aria-label="Sticky navigation"
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-serif text-xl font-bold text-[#e34b16]">
                SOLO<span className="font-normal">SHE</span>THINGS
              </Link>

              <div className="hidden items-center gap-6 md:flex">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-[#3a3a3a] transition-colors hover:text-[#e34b16]"
                  >
                    {link.label}
                  </Link>
                ))}
                {authActions}
              </div>

              <button
                type="button"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-[#3a3a3a]" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
