import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WelcomeSection } from "@/components/home/welcome-section"
import { FeaturedPosts } from "@/components/home/featured-posts"
import { CommunityCTA } from "@/components/home/community-cta"
import { CommunityStories } from "@/components/home/community-stories"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { getWpPosts } from "@/lib/wp-rest"

export default async function HomePage() {
  const wpPosts = await getWpPosts({ perPage: 3 })

  return (
    <>
      <main>
        <HeroSection />
        <WelcomeSection />
        <FeaturedPosts posts={wpPosts} />
        <CommunityCTA />
        <CommunityStories />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
