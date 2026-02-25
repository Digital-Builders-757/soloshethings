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
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-24 md:py-32">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-6">
                <h1 className="font-serif text-5xl font-bold leading-[0.95] text-brand-blue md:text-6xl lg:text-7xl">
                  <span className="italic font-normal text-brand-orange">She</span> Went{" "}
                  <span className="italic font-normal text-brand-orange">Solo</span>
                </h1>
                <p className="max-w-[450px] text-lg leading-relaxed text-[#555]">
                  Solo SHE Things was born from a single truth: when a woman decides to explore the
                  world alone, she discovers she was never really alone at all. This is the story of
                  how one solo trip became a global movement.
                </p>
                <div className="inline-block" style={{ transform: "rotate(-3deg)" }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
              <div className="relative p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-peach-offset shadow-peach-offset-hover transition-all">
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
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="mx-auto max-w-[800px] px-8 text-center">
            <h2 className="font-serif text-4xl font-bold italic text-brand-orange md:text-5xl">
              Mission
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-[1.8] text-[#444]">
              <p>
                We believe that solo travel is the ultimate act of self-love. It{"'"}s not just about
                seeing new places; it{"'"}s about discovering who you are when no one is watching.
              </p>
              <p>
                Our community is built on trust, transparency, and the shared joy of discovery. We
                connect women across borders, turning strangers into sisters and destinations into
                homes.
              </p>
              <p>
                Whether you{"'"}re taking your first solo weekend trip or backpacking across a
                continent, Solo SHE Things provides the resources, safety nets, and inspiration to
                help you go further.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#FFF8F3] py-16">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-3xl border-2 border-[#eee] bg-white p-8 text-center transition-all hover:-translate-y-2 hover:border-brand-gold"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-peach">
                    <stat.icon className="h-6 w-6 text-brand-orange" />
                  </div>
                  <p className="mt-4 font-serif text-3xl font-bold text-brand-blue">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-[#555]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mb-16 text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                What We Stand For
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-brand-blue md:text-4xl">
                Our Values
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="flex flex-col items-center rounded-3xl border-2 border-[#eee] bg-white p-8 text-center transition-all hover:-translate-y-2 hover:border-brand-gold"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-peach">
                    <value.icon className="h-7 w-7 text-brand-orange" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-brand-blue">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#555]">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-brand-blue py-24 text-white">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mb-16 text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                The Journey
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold italic md:text-4xl">
                How It All Started
              </h2>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="relative border-l-2 border-brand-orange/40 pl-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative pb-12 ${index === milestones.length - 1 ? "pb-0" : ""}`}
                  >
                    <div className="absolute -left-[calc(1rem+5px)] top-0 h-4 w-4 rounded-full bg-brand-orange" />
                    <p className="text-sm font-bold uppercase tracking-wider text-brand-orange">
                      {milestone.year}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-brand-peach">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/70">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-[#FFF8F3] py-24">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="relative p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-peach-offset shadow-peach-offset-hover transition-all">
                  <Image
                    src="/images/about-mission.jpg"
                    alt="The Solo SHE Things community"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="badge-tilt inline-block w-fit rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  Meet the Founder
                </span>
                <h2 className="font-serif text-3xl font-bold italic text-brand-orange md:text-4xl text-balance">
                  The Woman Behind the Movement
                </h2>
                <div className="space-y-4 text-lg leading-[1.8] text-[#444]">
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
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-28 text-center text-white">
          <div className="relative z-10 mx-auto max-w-[1240px] px-8">
            <h2 className="font-serif text-4xl font-bold italic md:text-5xl lg:text-6xl">
              Go Solo, Together.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-orange transition-all hover:shadow-lg"
              >
                Join the Community
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
