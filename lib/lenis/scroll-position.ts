import type Lenis from 'lenis'

/** Scroll Y for UI logic — Lenis virtual position when active, else native. */
export function getScrollY(lenis: Lenis | null, isEnabled: boolean): number {
  if (isEnabled && lenis) {
    return lenis.scroll
  }

  if (typeof window === 'undefined') {
    return 0
  }

  return window.scrollY
}
