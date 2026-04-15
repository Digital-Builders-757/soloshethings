import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WelcomeSection } from "@/components/home/welcome-section"
import { CommunityCTA } from "@/components/home/community-cta"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { AboutPreview } from "@/components/home/about-preview"

export default async function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WelcomeSection />
        <CommunityCTA />
        <NewsletterSection />
        <AboutPreview />
      </main>
      <Footer />
    </>
  )
}
