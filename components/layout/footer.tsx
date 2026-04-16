/**
 * Footer Component
 * 
 * Site footer with links and trust messaging
 * Updated to match Figma redesign
 */

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#e34b16] border-t border-white/10 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-white">
              SOLO<span className="font-normal">SHE</span>THINGS
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              A safe space for solo female travelers to discover, share, and connect.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Map
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white uppercase tracking-wider">Join</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/20">
          <p className="text-center text-sm text-white/70">
            &copy; 2026 Solo SHE Things. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
