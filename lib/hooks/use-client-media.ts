'use client'

import { useSyncExternalStore } from 'react'

function subscribeToMediaQuery(query: string, onChange: () => void) {
  const mediaQuery = window.matchMedia(query)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

export function usePrefersReducedMotion(serverFallback = false): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', serverFallback)
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)', false)
}

export function useCappedDevicePixelRatio(max = 2): number {
  return useSyncExternalStore(
    () => () => {},
    () => Math.min(window.devicePixelRatio || 1, max),
    () => 1,
  )
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

interface WindowDimensions {
  width: number
  height: number
}

const DEFAULT_WINDOW_DIMENSIONS: WindowDimensions = { width: 1024, height: 768 }

let clientWindowDimensionsSnapshot: WindowDimensions = { width: 0, height: 0 }

function getClientWindowDimensions(): WindowDimensions {
  const width = window.innerWidth
  const height = window.innerHeight

  if (
    clientWindowDimensionsSnapshot.width !== width ||
    clientWindowDimensionsSnapshot.height !== height
  ) {
    clientWindowDimensionsSnapshot = { width, height }
  }

  return clientWindowDimensionsSnapshot
}

export function useWindowDimensions(
  options: {
    /** When false, reads viewport once — no resize subscription. */
    live?: boolean
    serverFallback?: WindowDimensions
  } = {},
): WindowDimensions {
  const { live = true, serverFallback = DEFAULT_WINDOW_DIMENSIONS } = options

  return useSyncExternalStore(
    live
      ? (onStoreChange) => {
          window.addEventListener('resize', onStoreChange)
          return () => window.removeEventListener('resize', onStoreChange)
        }
      : () => () => {},
    getClientWindowDimensions,
    () => serverFallback,
  )
}

export function useSvgBackdropFilterSupport(filterId: string): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const isWebkit =
        /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      const isFirefox = /Firefox/.test(navigator.userAgent)
      if (isWebkit || isFirefox) return false

      const div = document.createElement('div')
      div.style.backdropFilter = `url(#${filterId})`
      return div.style.backdropFilter !== ''
    },
    () => false,
  )
}
