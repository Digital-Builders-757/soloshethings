import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WelcomeSection } from "@/components/home/welcome-section"
import { CommunityCTA } from "@/components/home/community-cta"
import { CommunityStories } from "@/components/home/community-stories"
import { AboutPreview } from "@/components/home/about-preview"
import { NewsletterSection } from "@/components/home/newsletter-section"

export default async function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WelcomeSection />
        <CommunityCTA />
        <CommunityStories />
        <AboutPreview />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
