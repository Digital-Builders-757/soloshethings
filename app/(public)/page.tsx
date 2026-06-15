import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { CommunityCTA } from "@/components/home/community-cta"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { ManifestoSection } from "@/components/home/manifesto-section"

export default async function HomePage() {
  return (
    <>
      <main className="min-w-0 overflow-x-visible">
        <HeroSection />
        <CommunityCTA />
        <NewsletterSection />
        <ManifestoSection />
      </main>
      <Footer />
    </>
  )
}
