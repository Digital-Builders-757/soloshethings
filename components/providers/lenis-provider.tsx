'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

interface LenisContextValue {
  lenis: Lenis | null
  /** False when prefers-reduced-motion is enabled — native scroll only. */
  isEnabled: boolean
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  isEnabled: false,
})

export function useLenis(): LenisContextValue {
  return useContext(LenisContext)
}

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname()
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const teardown = () => {
      setLenis(null)
      setIsEnabled(false)
    }

    const setup = () => {
      if (reducedMotionMq.matches) {
        teardown()
        return undefined
      }

      const instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: true,
        autoRaf: false,
        prevent: (node) =>
          Boolean(
            node.closest('[data-lenis-prevent]') ||
              node.closest('[data-lenis-prevent-wheel]') ||
              node.closest('[data-lenis-prevent-touch]'),
          ),
      })

      setLenis(instance)
      setIsEnabled(true)

      const onScroll = () => {
        ScrollTrigger.update()
      }

      instance.on('scroll', onScroll)

      const onTick = (time: number) => {
        instance.raf(time * 1000)
      }

      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        instance.off('scroll', onScroll)
        gsap.ticker.remove(onTick)
        instance.destroy()
        teardown()
      }
    }

    let cleanup = setup()

    const onMotionPreferenceChange = () => {
      cleanup?.()
      cleanup = setup()
    }

    reducedMotionMq.addEventListener('change', onMotionPreferenceChange)

    return () => {
      reducedMotionMq.removeEventListener('change', onMotionPreferenceChange)
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    if (!lenis) return

    requestAnimationFrame(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    })
  }, [pathname, lenis])

  const value = useMemo(
    () => ({ lenis, isEnabled }),
    [lenis, isEnabled],
  )

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
