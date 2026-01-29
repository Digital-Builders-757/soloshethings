"use client"

export function WelcomeSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(64,224,208,0.08),transparent_40%)]" />

      <div className="container relative mx-auto px-6">
        {/* Mission Statement */}
        <div className="mx-auto max-w-4xl">
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="rounded-xl bg-card p-8 md:p-12">
              <h2 className="mb-6 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-center">
                Our Mission
              </h2>
              <h3 className="mb-8 font-serif text-2xl font-semibold text-primary md:text-3xl text-center">
                Empowering Solo Female Travelers
              </h3>
              <div className="space-y-6 text-lg leading-relaxed text-foreground md:text-xl">
                <p className="text-center md:text-left">
                  SoloSheThings is more than a platform—it&apos;s a community where solo female travelers find safety,
                  inspiration, and connection. We believe every woman deserves to explore the world with confidence and
                  peace of mind.
                </p>
                <p className="text-center md:text-left">
                  Our curated safe spots, authentic travel stories, and supportive community help you plan your next
                  adventure, share your experiences, and connect with travelers who understand the unique joys and
                  challenges of solo travel.
                </p>
                <p className="text-center md:text-left font-semibold text-primary md:text-xl">
                  Because your journey matters, and you shouldn&apos;t have to travel it alone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}