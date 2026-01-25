/**
 * About Section
 * 
 * Mission and vision content for SoloSheThings
 * Safe to copy verbatim - static content
 */

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-24 px-4 bg-neutral-50/50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="eyebrow-text mb-3">Our Mission</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Empowering Solo Female Travelers
        </h2>
        <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
          <p>
            SoloSheThings is more than a platform—it&apos;s a community where solo female travelers
            find safety, inspiration, and connection. We believe every woman deserves to explore
            the world with confidence and peace of mind.
          </p>
          <p>
            Our curated safe spots, authentic travel stories, and supportive community help you
            plan your next adventure, share your experiences, and connect with travelers who
            understand the unique joys and challenges of solo travel.
          </p>
          <p className="text-xl font-semibold text-brand-blue1">
            Because your journey matters, and you shouldn&apos;t have to travel it alone.
          </p>
        </div>
      </div>
    </section>
  );
}

