"use client"

export function WelcomeSection() {
  return (
    <section className="section-sunrise relative overflow-hidden bg-white py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue1/6 via-transparent to-brand-yellow1/12" />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-brand-blue1/10 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-brand-yellow1/15 blur-3xl" />

      <div className="container relative mx-auto px-6">
        {/* Mission Statement */}
        <div className="mx-auto max-w-4xl">
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="rounded-xl bg-card/95 p-8 md:p-12">
              <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-brand-blue1 via-brand-yellow1 to-brand-orange" />
              <h2 className="mb-6 text-center font-serif text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
                <span className="bg-gradient-to-r from-brand-blue2 to-brand-blue1 bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <h3 className="mb-8 text-center font-serif text-2xl font-semibold text-brand-blue1 md:text-3xl drop-shadow-[0_6px_18px_rgba(4,57,217,0.2)]">
                Empowering Solo Female Travelers
              </h3>
              <div className="space-y-6 text-lg leading-relaxed text-neutral-700 md:text-xl">
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
                <div className="rounded-xl border border-brand-blue1/15 bg-brand-blue1/5 px-6 py-4">
                  <p className="text-center font-semibold text-brand-blue2 md:text-left md:text-xl">
                    Because your journey matters, and you shouldn&apos;t have to travel it alone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}