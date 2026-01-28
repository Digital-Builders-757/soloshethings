import { HeroCarousel } from "./hero-carousel"

export function HeroSection() {
  return (
    <section id="heroSection" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Travel Blog for Adventurous Solo Female Travelers
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
              Discover incredible destinations, safety tips, and stories from fearless solo female travelers around the world
            </p>
          </div>
          <HeroCarousel />
        </div>
      </div>
    </section>
  )
}