/**
 * Map Explore Page
 * Phase 2 Feature - Stub Implementation
 */
export default function MapPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Explore
          </p>
          <h1 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl lg:text-5xl mb-2">
            Safe Spots on the Map
          </h1>
          <div className="mb-8 h-px w-16 bg-brand-orange" />

          {/* Phase 2 Stub */}
          <div className="surface-card rounded-xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold mb-4 text-brand-blue">Map Feature Coming in Phase 2</h2>
            <p className="text-lg mb-6 text-muted-foreground">
              Geographic exploration of safe spots will be available in a future release.
            </p>
            <a
              href="/collections"
              className="inline-block rounded-full bg-brand-orange px-6 py-3 text-white font-semibold transition-all hover:bg-brand-orange/90"
            >
              Browse Collections Instead
            </a>
          </div>

          {/* Placeholder map area */}
          <div className="mt-8 aspect-video rounded-xl border border-border bg-brand-cream flex items-center justify-center">
            <p className="text-muted-foreground">Map will be implemented here in Phase 2</p>
          </div>
        </div>
      </div>
    </main>
  );
}
