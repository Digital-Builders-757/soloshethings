/**
 * TravelList — Sidebar list of all travel entries synced with the globe.
 *
 * - Clicking an item fires `onSelectEntry` which triggers a globe fly-to
 * - The currently active entry is visually highlighted
 * - Each item also has a direct "Read Story" link to /blog/[slug]
 *
 * Client Component — requires click/hover interactivity.
 */

"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, ArrowRight } from "lucide-react"
import type { TravelEntry } from "@/lib/travel-data"

interface TravelListProps {
  entries: TravelEntry[]
  /** Currently highlighted entry (from globe hover or list click) */
  activeEntryId: string | null
  /** Callback when user selects an entry — globe should fly to it */
  onSelectEntry: (entry: TravelEntry) => void
}

export function TravelList({ entries, activeEntryId, onSelectEntry }: TravelListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-neutral-900">
          Sharon&apos;s Trips
        </h2>
        <span className="rounded-full bg-[#0439D9]/10 px-3 py-1 text-xs font-semibold text-[#0439D9]">
          {entries.length} destinations
        </span>
      </div>

      <div className="flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1 lg:max-h-[520px]">
        {entries.map((entry) => {
          const isActive = entry.id === activeEntryId

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelectEntry(entry)}
              className={`group flex w-full gap-4 rounded-xl border-2 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive
                  ? "border-[#0439D9] bg-[#0439D9]/5 shadow-md"
                  : "border-[#0439D9]/10 bg-white hover:border-[#0439D9]/30"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Trip info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 text-sm font-bold text-neutral-900">
                    {entry.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3 text-[#0439D9]" />
                    <span className="line-clamp-1">{entry.location}</span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </div>
                  <Link
                    href={`/blog/${entry.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-0.5 text-xs font-medium text-[#0439D9] opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Read Story
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
