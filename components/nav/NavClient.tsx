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
      className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-center px-5 py-3">
        {/* Desktop Nav Links - Centered with 2em gap */}
        <ul className="hidden items-center gap-8 xl:flex">
          {allLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] font-medium text-[#374151] transition-colors duration-200 hover:text-[#111827]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: Menu Button */}
        <div className="flex w-full items-center justify-between xl:hidden">
          <Link href="/" className="text-lg font-bold text-[#111827]">
            Solo SHE Things
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#374151]" />
            ) : (
              <Menu className="h-6 w-6 text-[#374151]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#e5e7eb] bg-white xl:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-4">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] hover:text-[#111827]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#e5e7eb] pt-4">
              {isAuthenticated ? (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]"
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
                    className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-1 rounded-full bg-[#df4915] px-6 py-3 text-center text-[14px] font-semibold text-white"
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
