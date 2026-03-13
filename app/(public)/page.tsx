import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedPosts } from "@/components/home/featured-posts"
import { WelcomeSection } from "@/components/home/welcome-section"
import { CommunityCTA } from "@/components/home/community-cta"
import { CommunityStories } from "@/components/home/community-stories"
import { ResourcesPosts } from "@/components/home/resources-posts"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { FounderStory } from "@/components/home/founder-story"
import { getWpPosts } from "@/lib/wp-rest"

export default async function HomePage() {
  const wpPosts = await getWpPosts({ perPage: 8 })

  // Split posts for two sections
  const realStoriesPosts = wpPosts.slice(0, 4)
  const resourcesPosts = wpPosts.slice(4, 8)

  return (
    <>
      <main>
        {/* 1. Hero */}
        <HeroSection />
        
        {/* Decorative African-inspired divider */}
        <div className="divider-african" />
        
        {/* 2. Real Stories From Solo SHEs */}
        <FeaturedPosts 
          posts={realStoriesPosts} 
          title="Real Stories From Solo SHEs"
          subtitle="Discover inspiring journeys from women who traveled solo"
        />
        
        {/* 5. A Community Built for Solo SHEs */}
        <WelcomeSection />
        
        {/* 6. A Global Community of Solo SHEs */}
        <CommunityStories />
        
        {/* Decorative African-inspired divider */}
        <div className="divider-african" />
        
        {/* 7. Resources for Your Solo Journey */}
        <ResourcesPosts posts={resourcesPosts} />
        
        {/* 8. Stay in the Loop (Newsletter) */}
        <NewsletterSection />
        
        {/* 9. The Story Behind Solo SHE Things */}
        <FounderStory />
        
        {/* 10. Ready to Find Your Solo SHE Thing? - Single CTA */}
        <CommunityCTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  )
}
