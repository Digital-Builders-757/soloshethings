/**
 * Map Explore Page
 * 
 * Phase 2 Feature - Stub Implementation
 * Geographic exploration of safe spots
 * Map-based browsing
 * 
 * Public route (stub for now, full implementation in Phase 2)
 */

/**
 * Map Explore Page
 * 
 * Phase 2 Feature - Stub Implementation
 * Geographic exploration of safe spots
 * Map-based browsing
 * 
 * Public route (stub for now, full implementation in Phase 2)
 * 
 * NOTE: When map component is implemented, ensure it uses original/natural
 * map tile colors (not blue overlay). Apply brand colors to UI frame only,
 * not the map tiles themselves.
 */
export default function MapPage() {
  return (
    <main className="section-mist relative min-h-screen py-16 overflow-hidden">
      <div className="container relative mx-auto px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl mb-8">
            <span className="bg-gradient-to-r from-brand-blue2 to-brand-blue1 bg-clip-text text-transparent">
              Explore Safe Spots on Map
            </span>
          </h1>
          
          {/* Phase 2 Stub */}
          <div className="gradient-border rounded-xl overflow-hidden bg-card p-8 text-center">
            <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">🗺️ Map Feature Coming in Phase 2</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              Geographic exploration of safe spots will be available in a future release.
            </p>
            <a
              href="/collections"
              className="inline-block rounded-full bg-brand-ocean px-6 py-2 text-white font-semibold transition-all hover:shadow-lg hover:shadow-brand-blue1/40"
            >
              Browse Collections Instead
            </a>
          </div>
          
          {/* Placeholder map area - Map will use natural/original colors when implemented */}
          <div className="mt-8 aspect-video bg-neutral-200 rounded-lg flex items-center justify-center gradient-border">
            <p className="text-muted-foreground">Map will be implemented here in Phase 2</p>
          </div>
        </div>
      </div>
    </main>
  );
}

