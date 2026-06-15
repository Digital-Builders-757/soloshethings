'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { motion } from 'framer-motion'

import {
  useMediaQuery,
  usePrefersReducedMotion,
} from '@/lib/hooks/use-client-media'
import { cn } from '@/lib/utils'

/** Demo loop — replace with a production asset when ready. */
const DEMO_VIDEO_SRC =
  'https://videos.pexels.com/video-files/3191901/3191901-hd_1920_1080_25fps.mp4'

const REST_HEIGHT_DESKTOP = 227
const REST_HEIGHT_MOBILE = 210
const MOBILE_BREAKPOINT = 1024

const EXPAND_DURATION = 1.05
const EXPAND_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface TravellersLetterVisualProps {
  className?: string
}

export function TravellersLetterVisual({ className }: TravellersLetterVisualProps) {
  return (
    <div
      className={cn('relative h-full w-full overflow-hidden bg-[#10141c]', className)}
      aria-hidden="true"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src={DEMO_VIDEO_SRC}
      />
    </div>
  )
}

interface TravellersLetterVisualFrameProps {
  containerRef: RefObject<HTMLDivElement | null>
  className?: string
}

export function TravellersLetterVisualFrame({
  containerRef,
  className,
}: TravellersLetterVisualFrameProps) {
  const [expandedHeight, setExpandedHeight] = useState(REST_HEIGHT_DESKTOP)
  const [isHovered, setIsHovered] = useState(false)
  const reduceMotion = usePrefersReducedMotion(true)
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  const restHeight = isMobile ? REST_HEIGHT_MOBILE : REST_HEIGHT_DESKTOP

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      if (isMobile) {
        setExpandedHeight(REST_HEIGHT_MOBILE)
        return
      }

      const formBlock = container.querySelector('[data-travellers-letter-form]')
      const formHeight =
        formBlock instanceof HTMLElement ? formBlock.offsetHeight : 0
      const formMarginTop =
        formBlock instanceof HTMLElement
          ? parseFloat(getComputedStyle(formBlock).marginTop) || 0
          : 0
      const available = container.clientHeight - formHeight - formMarginTop

      setExpandedHeight(Math.max(REST_HEIGHT_DESKTOP, available))
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [containerRef, isMobile])

  const canAnimate = supportsHover && !reduceMotion && !isMobile
  const targetHeight = canAnimate && isHovered ? expandedHeight : restHeight

  return (
    <motion.div
      className={cn(
        'w-full shrink-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem]',
        className,
      )}
      animate={{ height: targetHeight }}
      transition={
        canAnimate
          ? { duration: EXPAND_DURATION, ease: EXPAND_EASE }
          : { duration: 0 }
      }
      onMouseEnter={() => canAnimate && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="h-full w-full will-change-transform"
        animate={{ scale: canAnimate && isHovered ? 1.045 : 1 }}
        transition={
          canAnimate
            ? { duration: EXPAND_DURATION, ease: EXPAND_EASE }
            : { duration: 0 }
        }
      >
        <TravellersLetterVisual />
      </motion.div>
    </motion.div>
  )
}
