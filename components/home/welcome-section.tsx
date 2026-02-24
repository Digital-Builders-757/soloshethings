export function WelcomeSection() {
  return (
    <section className="bg-brand-cream py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl lg:text-5xl text-balance">
            Mission
          </h2>

          {/* Solid accent bar */}
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-blue" />

          {/* Body copy */}
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              SoloSHEThings is a global community designed to empower, inspire and encourage women to
              step into their own solo adventures. This is a space where stories are shared, confidence
              is built and courage is contagious.
            </p>
            <p>
              Whether it{"'"}s making a reservation for one, signing up for a class on your own, or
              traveling halfway across the world solo, every solo step counts.
            </p>
            <p>
              Step outside your comfort zone, try something new, and discover just how capable you are.
              So tell us -- what is your solo SHE thing?
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
