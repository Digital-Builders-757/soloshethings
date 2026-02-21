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
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
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
          className="text-sm font-medium text-white/80 transition-colors hover:text-white"
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
        className="text-sm font-medium text-white/80 transition-colors hover:text-white"
      >
        Sign In
      </Link>
      <Link href="/signup">
        <Button
          size="sm"
          className="rounded-full bg-brand-orange px-6 text-white transition-all hover:bg-brand-orange/90"
        >
          Get Started
        </Button>
      </Link>
    </>
  );

  return (
    <>
      {/* Main Nav - Black/Navy editorial */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-white">
              Solo <span className="text-brand-orange">SHE</span> Things
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
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
          <div className="border-t border-white/10 bg-black md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4" aria-label="Mobile navigation">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
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
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                    <div className="w-full"><LogoutButton /></div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">
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
            "fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black shadow-lg transition-all duration-500",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          aria-label="Sticky navigation"
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-serif text-xl font-bold tracking-wide text-white">
                Solo <span className="text-brand-orange">SHE</span> Things
              </Link>

              <div className="hidden items-center gap-6 md:flex">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
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
                <Menu className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
