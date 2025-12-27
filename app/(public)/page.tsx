/**
 * Landing Page
 * 
 * Enhanced v0-inspired landing page with:
 * 1) WorldTravelAnimation (splash screen)
 * 2) WesAndersonHero (split hero with carousel)
 * 3) CulturalShowcaseSection (value props)
 * 4) AboutSection (mission)
 * 5) Featured Safe Spots (existing)
 * 6) StoriesSection (existing, enhanced)
 * 7) ConnectSection (community stats & events)
 * 8) Collections CTA (existing)
 * 9) Curated Drops CTA (existing)
 * 
 * Public previews to sell the product, full content auth-gated.
 */

import { LandingPageContent } from '@/components/landing/landing-page-content';
import { getFeaturedDestinations, getCommunityStats, getUpcomingEvents } from '@/lib/marketing-data';

export default async function HomePage() {
  // Fetch data in parallel (server component)
  const [destinations, stats, events] = await Promise.all([
    getFeaturedDestinations(),
    getCommunityStats(),
    getUpcomingEvents(),
  ]);

  return (
    <LandingPageContent
      destinations={destinations}
      stats={stats}
      events={events}
    />
  );
}
