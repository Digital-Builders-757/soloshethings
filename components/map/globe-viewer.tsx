/**
 * GlobeViewer — Interactive 3D globe with travel markers.
 *
 * Uses react-globe.gl (Three.js under the hood) to render a rotating Earth
 * with point markers for each of Sharon's travel destinations.
 *
 * Features:
 * - Auto-rotating globe with natural earth texture
 * - Custom colored markers at each visited location
 * - Hover shows a MarkerPreview tooltip card
 * - Click navigates to the blog post for that location
 * - Programmatic fly-to when a trip is selected from the sidebar
 * - Responsive sizing via ResizeObserver
 *
 * Client Component — WebGL rendering requires browser APIs.
 */

"use client"

import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { TravelEntry } from "@/lib/travel-data"
import type { GlobeMethods } from "react-globe.gl"
import { MarkerPreview } from "./marker-preview"

/* Lazy import the default export of react-globe.gl at module level.
   next/dynamic handles the SSR guard at the page level, so by the time
   this component mounts we are guaranteed to be in the browser. */
import Globe from "react-globe.gl"

/** Brand blue for markers */
const MARKER_COLOR = "#0439D9"
const MARKER_COLOR_ACTIVE = "#F2E205"

interface GlobeViewerProps {
  entries: TravelEntry[]
  /** Currently selected entry (from sidebar) — globe flies to it */
  activeEntryId: string | null
  /** Callback when user hovers/clicks a marker on the globe */
  onHoverEntry: (entry: TravelEntry | null) => void
  onSelectEntry: (entry: TravelEntry) => void
}

export default function GlobeViewer({
  entries,
  activeEntryId,
  onHoverEntry,
  onSelectEntry,
}: GlobeViewerProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  /* Track container dimensions for responsive globe sizing */
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 })

  /* Hover tooltip state */
  const [hoveredEntry, setHoveredEntry] = useState<TravelEntry | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  /* Globe texture URL (natural colors per project requirements) */
  const globeImageUrl = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  const bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png"

  /* Points data — pass entries directly as the data array */
  const pointsData = useMemo(() => entries, [entries])

  /** Resize the globe to fill its container */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((observerEntries) => {
      const { width, height } = observerEntries[0].contentRect
      setDimensions({ width, height: Math.max(height, 400) })
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  /** Set initial camera angle and auto-rotation on mount */
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    /* Start with a nice angle showing Africa/Europe */
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 0)

    /* Enable gentle auto-rotation */
    const controls = globe.controls()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.4
      controls.enableZoom = true
      controls.minDistance = 200
      controls.maxDistance = 500
    }
  }, [])

  /** Fly the camera to the active entry when it changes */
  useEffect(() => {
    if (!activeEntryId || !globeRef.current) return

    const entry = entries.find((e) => e.id === activeEntryId)
    if (!entry) return

    /* Pause auto-rotation during fly-to */
    const controls = globeRef.current.controls()
    if (controls) controls.autoRotate = false

    globeRef.current.pointOfView(
      { lat: entry.latitude, lng: entry.longitude, altitude: 1.5 },
      1200 /* smooth 1.2s transition */
    )

    /* Resume auto-rotation after the camera settles */
    const timer = setTimeout(() => {
      if (controls) controls.autoRotate = true
    }, 3000)

    return () => clearTimeout(timer)
  }, [activeEntryId, entries])

  /** Handle marker hover — show preview + notify parent */
  const handlePointHover = useCallback(
    (point: object | null) => {
      const entry = point as TravelEntry | null
      setHoveredEntry(entry)
      onHoverEntry(entry)
    },
    [onHoverEntry]
  )

  /** Track mouse for tooltip positioning */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  /** Handle marker click — navigate to blog post */
  const handlePointClick = useCallback(
    (point: object) => {
      const entry = point as TravelEntry
      onSelectEntry(entry)
      router.push(`/blog/${entry.slug}`)
    },
    [onSelectEntry, router]
  )

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] w-full overflow-hidden rounded-2xl border-2 border-[#0439D9]/15 bg-[#020c24] lg:h-[560px]"
      onMouseMove={handleMouseMove}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={globeImageUrl}
        bumpImageUrl={bumpImageUrl}
        backgroundColor="rgba(2, 12, 36, 0)"
        showAtmosphere={true}
        atmosphereColor="#0439D9"
        atmosphereAltitude={0.2}
        /* Points layer — each TravelEntry is a marker */
        pointsData={pointsData}
        pointLat="latitude"
        pointLng="longitude"
        pointColor={(d: object) =>
          (d as TravelEntry).id === activeEntryId
            ? MARKER_COLOR_ACTIVE
            : MARKER_COLOR
        }
        pointAltitude={(d: object) =>
          (d as TravelEntry).id === activeEntryId ? 0.12 : 0.06
        }
        pointRadius={(d: object) =>
          (d as TravelEntry).id === activeEntryId ? 0.7 : 0.45
        }
        pointResolution={12}
        pointsMerge={false}
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        /* Rings layer — animated ring on the active marker */
        ringsData={
          activeEntryId
            ? entries.filter((e) => e.id === activeEntryId)
            : []
        }
        ringLat="latitude"
        ringLng="longitude"
        ringColor={() => MARKER_COLOR_ACTIVE}
        ringMaxRadius={3}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1200}
        /* Labels layer — show city name next to each marker */
        labelsData={pointsData}
        labelLat="latitude"
        labelLng="longitude"
        labelText={(d: object) => (d as TravelEntry).location.split(",")[0]}
        labelSize={0.6}
        labelDotRadius={0}
        labelColor={(d: object) =>
          (d as TravelEntry).id === activeEntryId
            ? MARKER_COLOR_ACTIVE
            : "rgba(255, 255, 255, 0.75)"
        }
        labelResolution={2}
        labelAltitude={0.01}
        /* Interaction settings */
        enablePointerInteraction={true}
      />

      {/* Hover preview tooltip */}
      <MarkerPreview
        entry={hoveredEntry}
        x={tooltipPos.x}
        y={tooltipPos.y}
      />

      {/* Instruction hint */}
      <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
        Drag to rotate · Scroll to zoom · Click a marker to read
      </div>
    </div>
  )
}
