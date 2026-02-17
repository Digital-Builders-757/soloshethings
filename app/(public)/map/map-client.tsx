/**
 * MapPageClient — Client boundary that wires the globe and trip list together.
 *
 * Manages shared state:
 * - activeEntryId: which entry is selected (from globe hover or list click)
 * - Globe flies to the active entry; list highlights it
 *
 * Lazy-loads the GlobeViewer (ssr: false) because Three.js needs browser APIs.
 * Shows a skeleton loader while the globe JS downloads.
 */

"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { travelEntries } from "@/lib/travel-data"
import type { TravelEntry } from "@/lib/travel-data"
import { TravelList } from "@/components/map/travel-list"
import { Globe as GlobeIcon, Loader2 } from "lucide-react"

/** Lazy-load the 3D globe — ssr: false prevents Three.js from running on the server */
const GlobeViewer = dynamic(() => import("@/components/map/globe-viewer"), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
})

/** Skeleton shown while the globe JS bundle loads */
function GlobeSkeleton() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border-2 border-[#0439D9]/15 bg-[#020c24] lg:h-[560px]">
      <div className="flex flex-col items-center gap-3 text-white/60">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-medium">Loading 3D Globe...</p>
      </div>
    </div>
  )
}

export function MapPageClient() {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)

  /** Called when user clicks a trip in the sidebar list */
  const handleListSelect = useCallback((entry: TravelEntry) => {
    setActiveEntryId(entry.id)
  }, [])

  /** Called when user hovers a globe marker */
  const handleGlobeHover = useCallback((entry: TravelEntry | null) => {
    /* Only update active on hover if nothing was explicitly selected,
       or clear when mouse leaves */
    if (entry) {
      setActiveEntryId(entry.id)
    }
  }, [])

  /** Called when user clicks a globe marker */
  const handleGlobeSelect = useCallback((entry: TravelEntry) => {
    setActiveEntryId(entry.id)
  }, [])

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* 3D Globe */}
      <div className="order-1">
        <GlobeViewer
          entries={travelEntries}
          activeEntryId={activeEntryId}
          onHoverEntry={handleGlobeHover}
          onSelectEntry={handleGlobeSelect}
        />
      </div>

      {/* Trip List Sidebar */}
      <aside className="order-2">
        <div className="rounded-2xl border-2 border-[#0439D9]/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#0439D9]">
            <GlobeIcon className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Destinations
            </span>
          </div>
          <TravelList
            entries={travelEntries}
            activeEntryId={activeEntryId}
            onSelectEntry={handleListSelect}
          />
        </div>
      </aside>
    </div>
  )
}
