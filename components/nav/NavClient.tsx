"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const allLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  return (
    <>
      {/* Sticky Blue Nav Bar (matches reference) */}
      <nav
        className="sticky top-0 z-50 bg-brand-blue shadow-[0_4px_20px_rgba(32,68,224,0.2)]"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-4">
          {/* Left: Nav Links */}
          <ul className="hidden items-center gap-8 md:flex">
            {allLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.95rem] font-medium text-white transition-colors duration-200 hover:text-brand-peach"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Auth Actions */}
          <div className="hidden items-center gap-8 md:flex">
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
                  className="rounded-full border-2 border-brand-orange bg-brand-orange px-6 py-2.5 text-[0.85rem] font-bold uppercase tracking-[0.5px] text-white transition-all duration-200 hover:bg-white hover:text-brand-orange"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-brand-blue md:hidden">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-8 py-4">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.95rem] font-medium text-white/80 transition-colors hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <>
                    {authLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-[0.95rem] font-medium text-white/80 hover:text-white"
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
                      className="text-[0.95rem] font-medium text-white/80 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-full bg-brand-orange px-6 py-2.5 text-center text-[0.85rem] font-bold uppercase text-white"
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
    </>
  );
}
