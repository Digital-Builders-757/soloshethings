'use client';

import { useState } from 'react';
import { WorldTravelAnimation } from './world-travel-animation';
import { WesAndersonHero } from './wes-anderson-hero';
import { CulturalShowcaseSection } from './cultural-showcase-section';
import { AboutSection } from './about-section';
import { ConnectSection } from './connect-section';
import { TravelMomentsGallery } from './travel-moments-gallery';
import type { Destination, CommunityStats, Event } from '@/lib/marketing-data';

interface LandingPageContentProps {
  destinations: Destination[];
  stats: CommunityStats;
  events: Event[];
}

export function LandingPageContent({ destinations, stats, events }: LandingPageContentProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return (
    <>
      {showAnimation && <WorldTravelAnimation onComplete={handleAnimationComplete} />}
      {!showAnimation && (
        <main className="min-h-screen">
          {/* Hero Section with Carousel */}
          <WesAndersonHero images={destinations.map(d => ({
            src: d.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1000&fit=crop&q=80',
            title: d.name.toUpperCase(),
            location: d.location.toUpperCase(),
            credit: 'CREDIT: COMMUNITY',
            year: '2024',
          }))} />

          {/* Cultural Showcase */}
          <CulturalShowcaseSection />

          {/* About Section */}
          <AboutSection />

          {/* Travel Moments Gallery */}
          <div className="section-divider"></div>
          <TravelMomentsGallery />

          {/* Featured Safe Spots */}
          <section id="spots" className="py-20 md:py-24 px-4 bg-neutral-50/50">
            <div className="max-w-7xl mx-auto">
              <p className="eyebrow-text text-center mb-3">Curated</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                Featured Safe Spots
              </h2>
              <p className="narrative-interlude mb-12">
                Handpicked places where solo travelers feel welcome, safe, and inspired.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Postcard-style placeholder cards */}
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">A Quiet Café in Lisbon</h3>
                      <p className="postcard-caption mb-4">
                        Morning light spills through tall windows. The barista remembers your order. 
                        This is where solo travelers find their rhythm.
                      </p>
                      <a
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">A Courtyard in Kyoto</h3>
                      <p className="postcard-caption mb-4">
                        Soft shadows dance on stone. Plants whisper in the breeze. 
                        A moment of calm discovery, perfectly safe.
                      </p>
                      <a
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">A Bookstore in Reykjavik</h3>
                      <p className="postcard-caption mb-4">
                        Warm light glows from within. Shelves promise stories. 
                        A safe haven for curious travelers.
                      </p>
                      <a
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community Highlights */}
          <div className="section-divider"></div>
          <section id="stories" className="py-20 md:py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <p className="eyebrow-text text-center mb-3">Stories</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                From the Community
              </h2>
              <p className="narrative-interlude mb-12">
                Real experiences from solo travelers who found their safe spots and shared their journeys.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Preview cards - full content requires auth */}
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">Finding My Rhythm in Barcelona</h3>
                      <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                        A week of mornings at the same café, evenings watching the sunset. 
                        Join to read the full story and connect with other solo travelers...
                      </p>
                      <div className="bg-brand-yellow1 text-black px-4 py-2 rounded-full text-sm font-medium inline-block">
                        Join to View Full Story
                      </div>
                    </div>
                  </div>
                </div>
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">A Safe Haven in Tokyo</h3>
                      <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                        The quiet bookstore that became my daily ritual. 
                        Join to read the full story and connect with other solo travelers...
                      </p>
                      <div className="bg-brand-yellow1 text-black px-4 py-2 rounded-full text-sm font-medium inline-block">
                        Join to View Full Story
                      </div>
                    </div>
                  </div>
                </div>
                <div className="surface-card-gradient lift-hover">
                  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
                    <div className="aspect-video postcard-media flex items-center justify-center">
                      <span className="text-neutral-400 text-xs uppercase tracking-wider">Image Placeholder</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-neutral-900">Morning Walks in Reykjavik</h3>
                      <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                        How I found peace in the early hours, exploring safely on my own. 
                        Join to read the full story and connect with other solo travelers...
                      </p>
                      <div className="bg-brand-yellow1 text-black px-4 py-2 rounded-full text-sm font-medium inline-block">
                        Join to View Full Story
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <a
                  href="/signup"
                  className="inline-block bg-brand-blue1 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-blue2 transition-all btn-glow active:scale-[0.98]"
                >
                  Join the Community
                </a>
              </div>
            </div>
          </section>

          {/* Connect Section */}
          <ConnectSection stats={stats} events={events} />

          {/* Collections CTA */}
          <div className="section-divider"></div>
          <section className="py-20 md:py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto text-center">
              <p className="eyebrow-text mb-3">Explore</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Browse by Theme</h2>
              <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Explore safe spots by safety level, budget, wellness, destination type, and more.
              </p>
              <a
                href="/collections"
                className="inline-block bg-brand-orange text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all btn-glow active:scale-[0.98]"
              >
                Browse Collections
              </a>
            </div>
          </section>

          {/* Curated Drops (Bulletin) CTA */}
          <div className="section-divider"></div>
          <section className="py-20 md:py-24 px-4 bg-brand-blue2 text-white hero-wash">
            <div className="max-w-7xl mx-auto text-center">
              <p className="eyebrow-text text-white/80 mb-3">Curated</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Curated Drops</h2>
              <p className="text-xl mb-10 text-white/95 max-w-2xl mx-auto leading-relaxed">
                Bi-weekly curated safe spots and travel stories from our community.
              </p>
              <a
                href="/blog"
                className="inline-block bg-brand-yellow1 text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-yellow2 transition-all btn-glow active:scale-[0.98]"
              >
                View Latest Drops
              </a>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

