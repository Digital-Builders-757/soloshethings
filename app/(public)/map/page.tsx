/**
 * Map Explore Page
 * 
 * Phase 2 Feature - Stub Implementation
 * Geographic exploration of safe spots
 * Map-based browsing
 * 
 * Public route (stub for now, full implementation in Phase 2)
 */

export default function MapPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Explore Safe Spots on Map</h1>
        
        {/* Phase 2 Stub */}
        <div className="bg-brand-orange text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">🗺️ Map Feature Coming in Phase 2</h2>
          <p className="text-lg mb-6">
            Geographic exploration of safe spots will be available in a future release.
          </p>
          <a
            href="/collections"
            className="inline-block bg-white text-brand-orange px-6 py-2 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            Browse Collections Instead
          </a>
        </div>
        
        {/* Placeholder map area */}
        <div className="mt-8 aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
          <p className="text-neutral-500">Map will be implemented here in Phase 2</p>
        </div>
      </div>
    </main>
  );
}

