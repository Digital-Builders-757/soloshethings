import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function WelcomeSection() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">Welcome to SoloSheThings</h2>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              We&apos;re a community dedicated to empowering solo female travelers around the world. Whether you&apos;re planning your first solo adventure or you&apos;re a seasoned traveler, we&apos;re here to inspire, guide, and connect you with like-minded women who share your passion for exploration.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Discover incredible destinations, read inspiring travel stories, and find the resources you need for safe and memorable solo travel experiences.
            </p>
          </div>

          <div className="relative h-[350px] overflow-hidden rounded-lg bg-muted lg:h-[400px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Founder photo</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80">
            Explore Our Blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}