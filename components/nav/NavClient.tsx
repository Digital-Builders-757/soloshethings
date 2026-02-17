/**
 * Nav Client Component
 * 
 * Client-side navigation with mobile menu interactivity
 * Receives nav links and auth state as props from Server Component
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

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
          className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-blue1 after:to-brand-blue2 after:transition-all hover:after:w-full"
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
        className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-blue1 after:to-brand-blue2 after:transition-all hover:after:w-full"
      >
        Sign In
      </Link>
      <Link href="/signup">
        <Button
          size="sm"
          className="rounded-full bg-[#0439D9] px-6 text-white transition-all hover:bg-[#034AA6] hover:shadow-lg"
        >
          Get Started
        </Button>
      </Link>
    </>
  );

  return (
    <>
      {/* Top Menu with Glassmorphism */}
      <header className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wide bg-gradient-to-r from-brand-blue1 to-brand-blue2 bg-clip-text text-transparent animate-text-glow">
                SoloSheThings
              </span>
              <Sparkles className="h-5 w-5 text-brand-yellow1 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-blue1 after:to-brand-blue2 after:transition-all hover:after:w-full"
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
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-6 py-4">
              {allLinks.map((link) => (
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
                          className="w-full border-primary/50 bg-transparent text-foreground hover:bg-primary/10"
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
                        className="w-full border-primary/50 bg-transparent text-foreground hover:bg-primary/10"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#0439D9] text-white">
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

      {/* Sticky Menu - Appears after scrolling */}
      {showStickyNav && (
        <nav
          className={cn(
            "fixed left-0 right-0 top-0 z-50 glass border-b border-border/30 shadow-lg shadow-brand-blue1/10 transition-all duration-500",
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-serif text-xl font-bold tracking-wide text-primary">
                SoloSheThings
              </Link>

              <div className="hidden items-center gap-6 md:flex">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                  className="relative text-sm font-medium text-foreground transition-all hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-brand-blue1 after:to-brand-blue2 after:transition-all hover:after:w-full"
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
                <Menu className="h-6 w-6 text-primary" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
