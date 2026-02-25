import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe, Users, Heart, MapPin, Camera, BookOpen } from "lucide-react"

export const metadata = {
  title: "About | Solo SHE Things",
  description: "Meet the founder behind Solo SHE Things and learn about our mission to empower solo female travelers worldwide.",
}

const stats = [
  { icon: Globe, label: "Countries Visited", value: "45+" },
  { icon: Users, label: "Community Members", value: "10K+" },
  { icon: Heart, label: "Stories Shared", value: "500+" },
]

const values = [
  {
    icon: MapPin,
    title: "Fearless Exploration",
    description: "We believe every woman deserves to see the world on her own terms. Solo travel isn't just a trip -- it's a transformation.",
  },
  {
    icon: Camera,
    title: "Authentic Stories",
    description: "No sugar-coating, no filters. We share the real highs, lows, and in-betweens of traveling solo as a woman.",
  },
  {
    icon: BookOpen,
    title: "Community First",
    description: "The SHEsisterhood is built on trust, support, and shared experiences. We lift each other up, one destination at a time.",
  },
]

const timeline = [
  { year: "2024", title: "The First Solo Trip", description: "A one-way ticket to Portugal sparked something that couldn't be undone. The freedom, the fear, the magic -- it all started here." },
  { year: "2024", title: "Berlin & Beyond", description: "What started as a solo adventure turned into a collection of stories that needed to be told. Berlin showed me that community can be found anywhere." },
  { year: "2025", title: "Solo SHE Things is Born", description: "From a journal full of travel notes to a platform connecting thousands of women. Solo SHE Things officially launched to empower solo female travelers worldwide." },
  { year: "2025", title: "The Zambezi River", description: "Pushing boundaries on the Zambezi River in Africa. Every trip adds a new chapter to the story we're building together." },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-brand-blue py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-peach/30 bg-brand-peach/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-peach">
              Our Story
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl text-balance">
              About Solo <span className="text-brand-orange">SHE</span> Things
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-peach/80">
              More than a travel blog. A movement empowering women to explore the world
              confidently, share their stories authentically, and build meaningful connections.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
            {/* Image */}
            <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-2xl lg:h-[520px] lg:w-[440px]">
              <Image
                src="/images/about-founder.jpg"
                alt="Founder of Solo SHE Things"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-16">
                <p className="font-serif text-xl font-bold text-white">The Founder</p>
                <p className="text-sm text-brand-peach">Solo SHE Things</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Meet the Founder
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
                From Solo Traveler to Community Builder
              </h2>
              <div className="h-1 w-16 rounded-full bg-brand-orange" />

              <p className="text-lg leading-relaxed text-muted-foreground">
                It started with a one-way ticket and a heart full of curiosity. What I found on
                the road wasn't just beautiful places -- it was a version of myself I didn't know
                existed. The confidence that comes from navigating a foreign city alone, the joy
                of making friends in hostels, the quiet power of sitting with yourself at a cafe
                in a country where no one knows your name.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Solo SHE Things was born from a simple belief: every woman deserves to experience
                that feeling. This platform is my way of paying it forward -- sharing the tips,
                the stories, and the community that make solo travel not just possible, but powerful.
              </p>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10">
                      <stat.icon className="h-5 w-5 text-brand-orange" />
                    </div>
                    <p className="mt-2 font-serif text-2xl font-bold text-brand-blue">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
              What We Stand For
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
              Our Values
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-orange" />
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-white p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10">
                  <value.icon className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-foreground">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-blue">
              The Journey
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
              How We Got Here
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-orange" />
          </div>

          <div className="mx-auto max-w-3xl">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 pb-12 last:pb-0">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="mt-2 h-full w-px bg-brand-orange/20" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{item.year}</span>
                  <h3 className="mt-1 font-serif text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-orange py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl text-balance">
            Ready to Start Your Solo Adventure?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-peach">
            Join the SHEsisterhood and connect with thousands of solo female travelers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-orange transition-all hover:bg-brand-peach hover:shadow-lg"
            >
              Join the Community
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-blue/90 hover:shadow-lg"
            >
              Read SHE Stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
