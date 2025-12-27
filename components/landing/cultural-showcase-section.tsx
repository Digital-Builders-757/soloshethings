/**
 * Cultural Showcase Section
 * 
 * Value proposition cards highlighting the platform's core benefits
 * Safe to copy verbatim - static content
 */

export function CulturalShowcaseSection() {
  const valueProps = [
    {
      title: 'Bold Journeys',
      description: 'Empowering women to embrace adventure with confidence, discovering safe spots and hidden gems around the world.',
      icon: '🌍',
    },
    {
      title: 'Authentic Stories',
      description: 'Real experiences from solo travelers who found their rhythm, their safe havens, and their community.',
      icon: '✍️',
    },
    {
      title: 'Global Community',
      description: 'Connect with like-minded travelers, share tips, and build lasting friendships across continents.',
      icon: '🤝',
    },
  ];

  return (
    <section id="values" className="py-20 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <p className="eyebrow-text text-center mb-3">Our Values</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          What Makes Us Different
        </h2>
        <p className="narrative-interlude mb-12">
          A community built on trust, safety, and the shared joy of solo travel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="surface-card rounded-2xl p-8 text-center lift-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{prop.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">{prop.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

