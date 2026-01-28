import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WelcomeSection } from "@/components/home/welcome-section"
import { FeaturedPosts } from "@/components/home/featured-posts"
import { CommunityCTA } from "@/components/home/community-cta"
import { CommunityStories } from "@/components/home/community-stories"
import { AboutPreview } from "@/components/home/about-preview"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { getWpPosts } from "@/lib/wp-rest"

export default async function HomePage() {
  // Fetch WordPress posts for featured section
  const wpPosts = await getWpPosts({ perPage: 3 })

  return (
    <>
      <Header showBanner={true} />
      <main>
        <HeroSection />
        <WelcomeSection />
        <FeaturedPosts posts={wpPosts} />
        <CommunityCTA />
        <CommunityStories />
        <AboutPreview />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}