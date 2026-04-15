"use client"

import { cn } from "@/lib/utils"

type PatternSectionProps = {
  children: React.ReactNode
  /** Background tone for the section */
  tone?: "cream" | "white" | "orange" | "brown"
  /** Show decorative pattern band at top */
  patternTop?: boolean
  /** Show decorative pattern band at bottom */
  patternBottom?: boolean
  /** Additional className for the section wrapper */
  className?: string
  /** ID for anchor linking */
  id?: string
}

/**
 * PatternSection - A reusable section wrapper with optional decorative wavy pattern bands.
 * 
 * Architecture:
 * - The section is `relative isolate overflow-hidden` to contain decorative elements
 * - Pattern bands are absolutely positioned inside the section only
 * - Content sits in a `relative z-10` container above the pattern
 * - The pattern is clipped to this section and does NOT bleed into other sections
 * 
 * To swap pattern assets later:
 * - Replace the `backgroundImage` URL in the PatternBand component
 * - Or replace the inline SVG/CSS with your actual asset
 */
export function PatternSection({
  children,
  tone = "cream",
  patternTop = false,
  patternBottom = false,
  className,
  id,
}: PatternSectionProps) {
  const toneClasses = {
    cream: "bg-[#f7e8be]",
    white: "bg-white",
    orange: "bg-[#e34b16]",
    brown: "bg-[#8B4513]",
  }

  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        toneClasses[tone],
        className
      )}
    >
      {/* Decorative pattern band at top */}
      {patternTop && <PatternBand position="top" />}

      {/* Content container - sits above the pattern */}
      <div className="relative z-10">{children}</div>

      {/* Decorative pattern band at bottom */}
      {patternBottom && <PatternBand position="bottom" />}
    </section>
  )
}

type PatternBandProps = {
  position: "top" | "bottom"
}

/**
 * PatternBand - The decorative wavy pattern band.
 * 
 * This uses the wavy-pattern.png image as a horizontal decorative strip.
 * The band is absolutely positioned and pointer-events-none so it doesn't
 * interfere with content interaction.
 * 
 * To swap the pattern asset:
 * - Change the backgroundImage URL to your new asset
 * - Adjust height as needed for your design
 */
function PatternBand({ position }: PatternBandProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-0 h-16 pointer-events-none md:h-24",
        position === "top" ? "top-0" : "bottom-0"
      )}
      style={{
        backgroundImage: "url('/images/wavy-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: position === "top" ? "center bottom" : "center top",
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden="true"
    />
  )
}
