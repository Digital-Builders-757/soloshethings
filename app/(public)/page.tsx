import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WelcomeSection } from "@/components/home/welcome-section"
import { CommunityCTA } from "@/components/home/community-cta"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { AboutPreview } from "@/components/home/about-preview"

export default async function HomePage() {
  return (
    <>
      <main className="overflow-hidden">
        <HeroSection />
        
        {/* Decorative African-inspired divider */}
        <div className="divider-african" />
        
        {/* 2. Real Stories From Solo SHEs */}
        <FeaturedPosts 
          posts={realStoriesPosts} 
          title="Real Stories From Solo SHEs"
          subtitle="Discover inspiring journeys from women who traveled solo"
        />
        
        {/* 3. A Community Built for Solo SHEs */}
        <WelcomeSection />
        <CommunityCTA />
        <NewsletterSection />
        <AboutPreview />
      </main>
      
      {/* 9. Footer */}
      <Footer />
    </>
  )
}
