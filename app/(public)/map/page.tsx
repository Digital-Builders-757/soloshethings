/**
 * Map Explore Page
 *
 * Interactive 3D globe showing Sharon's travel destinations.
 * Each marker connects to a blog post about that location.
 * A synced trip list appears beside the globe on desktop.
 *
 * Public route — globe is viewable by anyone.
 * Blog post links navigate to /blog/[slug] (auth-protected).
 *
 * The GlobeViewer is lazy-loaded via next/dynamic (ssr: false)
 * because Three.js / WebGL require browser APIs.
 */

import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { MapPageClient } from "./map-client"

export const metadata: Metadata = {
  title: "Travel Map | SoloSheThings",
  description:
    "Explore Sharon's solo travel destinations on an interactive 3D globe. Click any marker to read the full travel story.",
}

export default function MapPage() {
  return (
    <>
      <main className="relative min-h-screen bg-white py-16">
        {/* Subtle background decorations */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#F2E205]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#0439D9]/5 blur-3xl" />

        <div className="container relative mx-auto px-6">
          {/* Page header */}
          <div className="mb-10 max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0439D9]/10 border border-[#0439D9]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0439D9]">
              Interactive Globe
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
              Where Sharon Has{" "}
              <span className="text-[#0439D9]">Traveled</span>
            </h1>
            <p className="mt-3 text-lg text-neutral-600">
              Spin the globe, hover over a marker to preview the trip, or click
              to read the full story. Pick a destination from the list to fly
              there.
            </p>
          </div>

          {/* Globe + Trip List — interactive client boundary */}
          <MapPageClient />
        </div>
      </main>
      <Footer />
    </>
  )
}
