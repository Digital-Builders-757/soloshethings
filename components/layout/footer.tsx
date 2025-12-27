/**
 * Footer Component
 * 
 * Site footer with links and trust messaging
 * Extracted from inline footer in layout.tsx
 */

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-neutral-900">SoloSheThings</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              A safe space for solo female travelers to discover, share, and connect.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-neutral-900 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/collections" className="hover:text-brand-blue1 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-blue1 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-brand-blue1 transition-colors">
                  Map
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-neutral-900 uppercase tracking-wider">Join</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/signup" className="hover:text-brand-blue1 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-blue1 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-500">
            Built with care for solo female travelers. Your safety and privacy matter.
          </p>
        </div>
      </div>
    </footer>
  );
}

