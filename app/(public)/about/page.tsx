import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ArrowRight, Globe, Users, Heart, MapPin, Shield, Sparkles } from "lucide-react"

const milestones = [
  {
    year: "2019",
    title: "The First Solo Trip",
    description:
      "What started as a solo weekend getaway to Lisbon turned into a life-changing realization: the world is far more welcoming than we are led to believe.",
  },
  {
    year: "2020",
    title: "The Blog Was Born",
    description:
      "During the global pause, Solo SHE Things was created as a space to share stories, safety tips, and encouragement for women who dream of traveling solo.",
  },
  {
    year: "2022",
    title: "Community of 5,000",
    description:
      "Women from over 40 countries joined the SHEsisterhood, sharing their own solo adventures, tips, and words of encouragement.",
  },
  {
    year: "2024",
    title: "10,000+ Strong",
    description:
      "The community crossed 10,000 members. Solo SHE Things expanded to include curated collections, safety guides, and group meetups around the world.",
  },
]

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Every recommendation and destination guide is built with your safety in mind. We share honest, up-to-date information so you can travel with confidence.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description:
      "We believe every woman deserves to see the world on her own terms. Solo travel is not just a trip -- it is a transformative act of self-discovery.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "You are never truly solo. The SHEsisterhood is a global network of women who uplift, guide, and cheer each other on from every corner of the world.",
  },
  {
    icon: Sparkles,
    title: "Authenticity",
    description:
      "No sugarcoating, no highlight reels. We share the real stories -- the messy, the magical, and everything in between.",
  },
]

const stats = [
  { icon: Globe, label: "Countries Covered", value: "45+" },
  { icon: Users, label: "Community Members", value: "10K+" },
  { icon: Heart, label: "Stories Shared", value: "500+" },
  { icon: MapPin, label: "Destinations Reviewed", value: "120+" },
]

export default function AboutPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative bg-brand-blue py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-peach">
                  Our Story
                </p>
                <h1 className="font-serif text-4xl font-bold leading-tight text-brand-peach md:text-5xl lg:text-6xl text-balance">
                  She Went Solo --{" "}
                  <span className="text-brand-orange">And Changed Everything</span>
                </h1>
                <div className="h-1 w-16 rounded-full bg-brand-orange" />
                <p className="max-w-lg text-lg leading-relaxed text-brand-peach/80">
                  Solo SHE Things was born from a single truth: when a woman decides to explore the
                  world alone, she discovers she was never really alone at all. This is the story of
                  how one solo trip became a global movement.
                </p>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl lg:h-[500px]">
                <Image
                  src="/images/about-hero.jpg"
                  alt="Founder of Solo SHE Things traveling solo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-brand-cream py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Our Mission
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl lg:text-5xl text-balance">
                Empowering Women to Explore Fearlessly
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-blue" />
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  SoloSHEThings is a global community designed to empower, inspire and encourage women
                  to step into their own solo adventures. This is a space where stories are shared,
                  confidence is built, and courage is contagious.
                </p>
                <p>
                  Whether it{"'"}s making a reservation for one, signing up for a class on your own, or
                  traveling halfway across the world solo -- every solo step counts. Step outside your
                  comfort zone, try something new, and discover just how capable you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-xl border border-border bg-brand-cream p-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10">
                    <stat.icon className="h-6 w-6 text-brand-orange" />
                  </div>
                  <p className="mt-3 font-serif text-3xl font-bold text-brand-blue">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
                Our Values
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-blue" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="flex flex-col items-center rounded-xl border border-border p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-peach/50">
                    <value.icon className="h-7 w-7 text-brand-orange" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-brand-blue">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-brand-blue py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-peach">
                How It All Started
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-peach md:text-4xl text-balance">
                The Journey So Far
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-orange" />
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="relative border-l-2 border-brand-orange/40 pl-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative pb-12 ${index === milestones.length - 1 ? "pb-0" : ""}`}
                  >
                    {/* Dot */}
                    <div className="absolute -left-[calc(1rem+5px)] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange" />
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
                      {milestone.year}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-brand-peach">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-brand-peach/70">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative h-[400px] overflow-hidden rounded-xl lg:h-[500px]">
                <Image
                  src="/images/about-mission.jpg"
                  alt="The Solo SHE Things community"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Meet the Founder
                </p>
                <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
                  The Woman Behind the Movement
                </h2>
                <div className="h-1 w-16 bg-brand-orange" />
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    After leaving my corporate job in 2019, I booked a one-way ticket to Lisbon with
                    nothing but a carry-on and a whole lot of anxiety. That trip changed my life.
                  </p>
                  <p>
                    I discovered that the world is much more welcoming than we are led to believe.
                    Strangers became friends. Fear turned into freedom. And I realized that this feeling
                    -- this confidence -- was something every woman deserved to experience.
                  </p>
                  <p>
                    Solo SHE Things is my way of paying it forward. 45+ countries later, my mission
                    remains the same: to empower women to explore the world confidently and safely.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-orange py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-pink md:text-4xl lg:text-5xl text-balance">
                Ready to Start Your Solo Journey?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-pink/90">
                Join 10,000+ women who have taken the leap. Whether it{"'"}s your first solo dinner or
                your fiftieth country, the SHEsisterhood is here for you.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-orange transition-all hover:bg-brand-peach hover:shadow-lg"
                >
                  Join the Community
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-pink/40 px-8 py-3 text-sm font-semibold text-brand-pink transition-all hover:border-brand-pink hover:bg-white/10"
                >
                  Read the Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
