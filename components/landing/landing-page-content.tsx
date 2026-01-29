/**
 * Landing Page Content
 * 
 * Package design specification:
 * 1. Hero section with carousel
 * 2. Welcome section ("Dear Solo SHE")
 * 3. Featured Posts grid
 * 4. Community Stories
 * 5. Community CTA
 * 6. Newsletter signup
 */

import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost, CommunityStats, CommunityStory } from '@/lib/marketing-data';
import { NewsletterSignup } from './newsletter-signup';
import { WesAndersonHero } from './wes-anderson-hero';
<<<<<<< HEAD
import { CulturalShowcaseSection } from './cultural-showcase-section';
import { AboutSection } from './about-section';
import { ConnectSection } from './connect-section';
import { TravelMomentsGallery } from './travel-moments-gallery';
import type { CommunityStats } from '@/lib/marketing-data';

// Local type definitions
interface Destination {
  id: string;
  name: string;
  location: string;
  image_url?: string;
}

interface Event {
  id: string;
  title: string;
  type: 'Virtual' | 'In-Person';
  date: string;
  location?: string;
  attending_count: number;
  image?: string;
}
=======
>>>>>>> 01834d0 (feat(design): match white background sections to founder section style (#4))

interface LandingPageContentProps {
  posts: BlogPost[];
  stats: CommunityStats;
  stories: CommunityStory[];
}

export function LandingPageContent({ posts, stats, stories }: LandingPageContentProps) {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Carousel */}
      <WesAndersonHero images={[
        {
          src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=1000&fit=crop",
          title: "SOLO TRAVELER",
          location: "EXPLORING THE WORLD",
          credit: "CREDIT: COMMUNITY",
          year: "2024",
        },
        {
          src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=1000&fit=crop",
          title: "TROPICAL DESTINATION",
          location: "BEACH PARADISE",
          credit: "CREDIT: COMMUNITY",
          year: "2024",
        },
        {
          src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=1000&fit=crop",
          title: "SCENIC LANDSCAPE",
          location: "MOUNTAIN VIEWS",
          credit: "CREDIT: COMMUNITY",
          year: "2024",
        },
        {
          src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1000&fit=crop",
          title: "ADVENTURE TRAVEL",
          location: "EXPLORING NEW PLACES",
          credit: "CREDIT: COMMUNITY",
          year: "2024",
        },
      ]} />

      {/* Welcome Section */}
      <section className="py-20 md:py-24 lg:py-28 px-4 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center">
            <p className="eyebrow-text mb-4 text-brand-blue1">Welcome</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 text-balance text-neutral-900">
              Dear Solo SHE
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-neutral-700 leading-relaxed text-pretty">
              <p>
                Welcome to SoloSheThings—a community where solo female travelers find safety, 
                inspiration, and connection. We believe every woman deserves to explore the world 
                with confidence and peace of mind.
              </p>
              <p>
                Our curated safe spots, authentic travel stories, and supportive community help you 
                plan your next adventure, share your experiences, and connect with travelers who 
                understand the unique joys and challenges of solo travel.
              </p>
              <p className="text-2xl font-serif font-semibold text-brand-blue1 mt-8">
                Because your journey matters, and you shouldn&apos;t have to travel it alone.
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
                      <Link
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </Link>
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
                      <Link
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </Link>
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
                      <Link
                        href="/places/example-slug"
                        className="text-brand-blue1 hover:text-brand-blue2 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Read Full Story
                        <span className="text-lg">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {posts.length > 0 && (
        <section className="py-20 md:py-24 lg:py-28 px-4 bg-gradient-to-b from-neutral-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="eyebrow-text mb-4 text-brand-blue1">Featured</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance text-neutral-900">
                Latest Travel Stories
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto text-pretty">
                Discover inspiring stories from solo female travelers around the world.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="surface-card-gradient lift-hover rounded-2xl overflow-hidden bg-white"
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="overflow-hidden rounded-t-2xl">
                      {post.image_url ? (
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video postcard-media flex items-center justify-center bg-gradient-to-br from-brand-blue1/10 to-brand-yellow1/10">
                          <span className="text-neutral-400 text-xs uppercase tracking-wider font-medium">
                            Image Placeholder
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:p-8">
                      {post.category && (
                        <span className="inline-block px-3 py-1.5 mb-3 text-xs font-semibold uppercase tracking-wider bg-brand-blue1/10 text-brand-blue1 rounded-full">
                          {post.category}
                        </span>
                      )}
                      <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 text-balance line-clamp-2 text-neutral-900 group-hover:text-brand-blue1 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-neutral-600 mb-4 line-clamp-3 text-pretty leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="text-brand-blue1 hover:text-brand-blue2 font-semibold inline-flex items-center gap-2 transition-colors group-hover:gap-3">
                        Read More
                        <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link
                href="/blog"
                className="inline-block bg-brand-blue1 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-blue2 transition-all btn-glow active:scale-[0.98] shadow-lg"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Connect Section - TODO: Implement ConnectSection component */}
      {/* <ConnectSection stats={stats} events={events} /> */}

      {/* Collections CTA */}
        <div className="section-divider"></div>
        <section className="py-20 md:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <p className="eyebrow-text mb-3">Explore</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Browse by Theme</h2>
            <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explore safe spots by safety level, budget, wellness, destination type, and more.
            </p>
            <Link
              href="/collections"
              className="inline-block bg-brand-orange text-white px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all btn-glow active:scale-[0.98]"
            >
              Browse Collections
            </Link>
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
            <Link
              href="/blog"
              className="inline-block bg-brand-blue1 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-brand-blue2 transition-all btn-glow active:scale-[0.98] shadow-lg"
            >
              View Latest Drops
            </Link>
          </div>
        </section>

      {/* Community Stories Section */}
      {stories.length > 0 && (
        <section className="py-20 md:py-24 lg:py-28 px-4 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="eyebrow-text mb-4 text-brand-blue1">Community</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance text-neutral-900">
                Stories from Our Community
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto text-pretty">
                Real experiences from solo female travelers who found their safe spots and shared their journeys.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="surface-card-gradient lift-hover rounded-2xl overflow-hidden bg-white"
                >
                  <div className="overflow-hidden rounded-t-2xl">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-serif font-bold mb-3 text-balance line-clamp-2 text-neutral-900">
                      {story.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-3 text-pretty leading-relaxed">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                      {story.author.avatar && (
                        <Image
                          src={story.author.avatar}
                          alt={story.author.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{story.author.name}</p>
                        <p className="text-xs text-neutral-500">{story.author.location}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community CTA Section */}
      <section className="py-20 md:py-24 lg:py-28 px-4 bg-gradient-to-br from-brand-blue1 via-brand-blue2 to-brand-blue1 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/travel-pattern.svg')] bg-repeat opacity-20" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance">
            Join Our Community
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/95 text-pretty max-w-3xl mx-auto">
            Connect with {stats.active_members.toLocaleString()}+ solo female travelers from {stats.countries} countries. 
            Share your stories, discover safe spots, and build lasting friendships.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold mb-3">{stats.active_members.toLocaleString()}+</div>
              <div className="text-white/90 font-medium">Active Members</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold mb-3">{stats.countries}</div>
              <div className="text-white/90 font-medium">Countries</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold mb-3">{stats.stories_shared.toLocaleString()}+</div>
              <div className="text-white/90 font-medium">Stories Shared</div>
            </div>
          </div>
          <Link
            href="/signup"
            className="inline-block bg-brand-yellow1 text-black px-12 py-5 rounded-full font-semibold text-lg md:text-xl hover:bg-brand-yellow2 transition-all btn-glow active:scale-[0.98] shadow-xl"
          >
            Join the Community
          </Link>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-20 md:py-24 lg:py-28 px-4 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance text-neutral-900">
            Stay Connected
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 text-pretty">
            Get the latest travel tips, community stories, and safe spot recommendations 
            delivered to your inbox.
          </p>
          <NewsletterSignup />
          <p className="text-sm text-neutral-500 mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </main>
  );
}