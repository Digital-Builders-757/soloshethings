/**
 * Collections Page
 * 
 * Browse safe spots by themes/tags:
 * - Safety level
 * - Budget
 * - Wellness
 * - First-time solo
 * - Destination type
 * - Region
 * - "Vibe" tags (conceptual, not literal colors)
 */

export default function CollectionsPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Browse Collections</h1>
        
        {/* Filter UI Stub */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter by Theme</h2>
          <div className="flex flex-wrap gap-3">
            {/* Tag filters - will be implemented with real data */}
            <button className="px-4 py-2 bg-brand-blue1 text-white rounded-lg hover:bg-brand-blue2 transition-colors">
              Safety Level
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Budget
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Wellness
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              First-Time Solo
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Destination Type
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Region
            </button>
          </div>
        </div>

        {/* Collection Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder collection cards */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/safety-level"
                className="text-brand-blue1 hover:text-brand-blue2 font-medium"
              >
                View Collection →
              </a>
            </div>
          </div>
          {/* Repeat placeholder cards */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/budget"
                className="text-brand-blue1 hover:text-brand-blue2 font-medium"
              >
                View Collection →
              </a>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/wellness"
                className="text-brand-blue1 hover:text-brand-blue2 font-medium"
              >
                View Collection →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

