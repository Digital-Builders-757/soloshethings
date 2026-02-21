export function WelcomeSection() {
  return (
    <section className="bg-brand-cream py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral">
            Our Mission
          </p>

          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-brand-navy md:text-4xl lg:text-5xl text-balance">
            Empowering Solo Female Travelers
          </h2>

          {/* Accent bar */}
          <div className="mx-auto mt-4 h-px w-16 bg-brand-coral" />

          {/* Body copy */}
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Solo SHE Things is more than a platform -- it is a community where solo female travelers
              find safety, inspiration, and connection. We believe every woman deserves to explore the
              world with confidence and peace of mind.
            </p>
            <p>
              Our curated safe spots, authentic travel stories, and supportive community help you plan
              your next adventure, share your experiences, and connect with travelers who understand the
              unique joys and challenges of solo travel.
            </p>
          </div>

          {/* Highlight quote */}
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-brand-peach/40 bg-white px-6 py-5">
            <p className="font-serif text-lg font-semibold text-brand-navy">
              Because your journey matters, and you should not have to travel it alone.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
