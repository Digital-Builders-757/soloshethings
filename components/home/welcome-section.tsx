"use client"

export function WelcomeSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 md:p-12">
            <h2 className="mb-10 text-center font-serif text-3xl font-bold text-[#FB5315] md:text-4xl lg:text-5xl">
              Mission
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-neutral-700 md:text-xl">
              <p className="text-center md:text-left">
                SoloSHEThings is a global community designed to empower, inspire and encourage
                women to step into their own solo adventures. This is a space where stories are
                shared, confidence is built and courage is contagious.
              </p>
              <p className="text-center md:text-left">
                Whether it&apos;s making a reservation for one, signing up for a class on your own,
                or traveling halfway across the world solo, every solo step counts.
              </p>
              <p className="text-center md:text-left">
                Step outside your comfort zone, try something new, and discover just how capable
                you are. So tell us &mdash; what is your solo SHE thing?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
