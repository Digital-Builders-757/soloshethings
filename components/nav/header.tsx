/**
 * Header Component
 * 
 * Site navigation header
 * Production-friendly, accessible, mobile-first
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "surface-glass border-b hairline-border sticky top-0 z-50 backdrop-blur-md",
        className
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-brand-blue1 transition-colors group-hover:text-brand-blue2">
              SoloSheThings
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/collections"
              className="text-neutral-700 hover:text-brand-blue1 transition-colors px-3 py-2 rounded-lg hover:bg-brand-blue1/5"
            >
              Collections
            </Link>
            <Link
              href="/blog"
              className="text-neutral-700 hover:text-brand-blue1 transition-colors px-3 py-2 rounded-lg hover:bg-brand-blue1/5"
            >
              Blog
            </Link>
            <Link
              href="/map"
              className="text-neutral-700 hover:text-brand-blue1 transition-colors px-3 py-2 rounded-lg hover:bg-brand-blue1/5"
            >
              Map
            </Link>
            <Link
              href="/login"
              className="text-neutral-700 hover:text-brand-blue1 transition-colors px-3 py-2 rounded-lg hover:bg-brand-blue1/5"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-brand-blue1 text-white px-5 py-2 rounded-full font-semibold hover:bg-brand-blue2 btn-glow transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-700 hover:text-brand-blue1 rounded-lg hover:bg-brand-blue1/5 transition-colors"
            aria-label="Open menu"
            disabled
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

