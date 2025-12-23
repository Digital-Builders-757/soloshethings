/**
 * Home Feed Page
 * 
 * AWA-Inspired Structure:
 * 1) Featured Safe Spots (curated/admin preview)
 * 2) Community Highlights (CTA to join; content preview only)
 * 3) Collections CTA
 * 4) Curated Drops (Bulletin) CTA
 * 
 * Public previews to sell the product, full content auth-gated.
 */

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue1 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Safe Travels for Solo Female Travelers
          </h1>
          <p className="text-xl mb-8">
            Discover safe spots, share your stories, and connect with a community
            that understands solo travel.
          </p>
          <a
            href="/signup"
            className="inline-block bg-brand-yellow1 text-black px-8 py-3 rounded-lg font-semibold hover:bg-brand-yellow2 transition-colors"
          >
            Get Started - Free Trial
          </a>
        </div>
      </section>

      {/* Featured Safe Spots */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Safe Spots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - will be replaced with real data */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Safe Spot Title</h3>
                <p className="text-neutral-600 mb-4">
                  Short description of this safe spot and why it's recommended...
                </p>
                <a
                  href="/places/example-slug"
                  className="text-brand-blue1 hover:text-brand-blue2 font-medium"
                >
                  Read Full Story →
                </a>
              </div>
            </div>
            {/* Repeat placeholder cards */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Safe Spot Title</h3>
                <p className="text-neutral-600 mb-4">
                  Short description of this safe spot and why it's recommended...
                </p>
                <a
                  href="/places/example-slug"
                  className="text-brand-blue1 hover:text-brand-blue2 font-medium"
                >
                  Read Full Story →
                </a>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Safe Spot Title</h3>
                <p className="text-neutral-600 mb-4">
                  Short description of this safe spot and why it's recommended...
                </p>
                <a
                  href="/places/example-slug"
                  className="text-brand-blue1 hover:text-brand-blue2 font-medium"
                >
                  Read Full Story →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            From the Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Preview cards - full content requires auth */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Community Story</h3>
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  Preview of community story. Join to read the full story and connect
                  with other solo travelers...
                </p>
                <div className="bg-brand-yellow1 text-black px-4 py-2 rounded text-sm font-medium inline-block">
                  Join to View Full Story
                </div>
              </div>
            </div>
            {/* Repeat preview cards */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Community Story</h3>
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  Preview of community story. Join to read the full story and connect
                  with other solo travelers...
                </p>
                <div className="bg-brand-yellow1 text-black px-4 py-2 rounded text-sm font-medium inline-block">
                  Join to View Full Story
                </div>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Community Story</h3>
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  Preview of community story. Join to read the full story and connect
                  with other solo travelers...
                </p>
                <div className="bg-brand-yellow1 text-black px-4 py-2 rounded text-sm font-medium inline-block">
                  Join to View Full Story
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <a
              href="/signup"
              className="inline-block bg-brand-blue1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-blue2 transition-colors"
            >
              Join the Community
            </a>
          </div>
        </div>
      </section>

      {/* Collections CTA */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Browse by Theme</h2>
          <p className="text-xl text-neutral-600 mb-8">
            Explore safe spots by safety level, budget, wellness, destination type, and more.
          </p>
          <a
            href="/collections"
            className="inline-block bg-brand-orange text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Collections
          </a>
        </div>
      </section>

      {/* Curated Drops (Bulletin) CTA */}
      <section className="py-16 px-4 bg-brand-blue2 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Curated Drops</h2>
          <p className="text-xl mb-8">
            Bi-weekly curated safe spots and travel stories from our community.
          </p>
          <a
            href="/blog"
            className="inline-block bg-brand-yellow1 text-black px-8 py-3 rounded-lg font-semibold hover:bg-brand-yellow2 transition-colors"
          >
            View Latest Drops
          </a>
        </div>
      </section>
    </main>
  );
}

