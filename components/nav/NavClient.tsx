"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
}: NavClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  return (
    <nav
      className="sticky top-0 z-50 bg-brand-blue shadow-[0_4px_20px_rgba(32,68,224,0.2)]"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-3 md:px-8 md:py-4">
        {/* Left: Nav Links (desktop) */}
        <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
          {allLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[0.9rem] font-medium text-white transition-colors duration-200 hover:text-brand-peach lg:text-[0.95rem]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Auth Actions (desktop) */}
        <div className="hidden items-center gap-6 lg:flex lg:gap-8">
          {isAuthenticated ? (
            <>
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.95rem] font-medium text-white transition-colors duration-200 hover:text-brand-peach"
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
                className="text-[0.95rem] font-medium text-white transition-colors duration-200 hover:text-brand-peach"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full border-2 border-brand-orange bg-brand-orange px-5 py-2 text-[0.8rem] font-bold uppercase tracking-[0.5px] text-white transition-all duration-200 hover:bg-white hover:text-brand-orange lg:px-6 lg:py-2.5 lg:text-[0.85rem]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Brand + Menu Button */}
        <Link href="/" className="font-serif text-lg font-bold text-white lg:hidden">
          Solo SHE Things
        </Link>
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-brand-blue lg:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-4">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-white/90 hover:bg-white/10 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                    className="rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-white/90 hover:bg-white/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-1 rounded-full bg-brand-orange px-6 py-3 text-center text-[0.85rem] font-bold uppercase text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
