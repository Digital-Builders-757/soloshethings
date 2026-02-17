/**
 * MarkerPreview — Floating tooltip card displayed when hovering a globe marker.
 *
 * Shows a thumbnail image, trip title, location, and date.
 * Positioned absolutely relative to the globe container and follows cursor.
 *
 * Client Component — requires mouse position state.
 */

"use client"

import Image from "next/image"
import { MapPin, Calendar } from "lucide-react"
import type { TravelEntry } from "@/lib/travel-data"

interface MarkerPreviewProps {
  /** The travel entry to display (null hides the card) */
  entry: TravelEntry | null
  /** Cursor X position relative to globe container */
  x: number
  /** Cursor Y position relative to globe container */
  y: number
}

export function MarkerPreview({ entry, x, y }: MarkerPreviewProps) {
  if (!entry) return null

  return (
    <div
      className="pointer-events-none absolute z-50 w-72 overflow-hidden rounded-xl border-2 border-[#0439D9]/20 bg-white shadow-xl transition-opacity duration-200"
      style={{
        left: x + 16,
        top: y - 20,
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-36 w-full">
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          sizes="288px"
          className="object-cover"
          unoptimized
        />
        {/* Location badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-[#0439D9]" />
          {entry.location}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-serif text-sm font-bold text-neutral-900">
          {entry.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
          {entry.excerpt}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
          <Calendar className="h-3 w-3" />
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </div>
      </div>
    </div>
  )
}
