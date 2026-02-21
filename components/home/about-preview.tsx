import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe, Users, Heart } from "lucide-react"

const stats = [
  { icon: Globe, label: "Countries Visited", value: "45+" },
  { icon: Users, label: "Community Members", value: "10K+" },
  { icon: Heart, label: "Stories Shared", value: "500+" },
]

export function AboutPreview() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-[400px] overflow-hidden rounded-xl lg:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=1000&fit=crop"
              alt="Founder traveling solo"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral">
              Meet the Founder
            </p>

            <h2 className="font-serif text-3xl font-bold text-brand-navy md:text-4xl text-balance">
              About Solo SHE Things
            </h2>
            <div className="h-px w-16 bg-brand-coral" />

            <p className="text-lg leading-relaxed text-muted-foreground">
              We are more than just a platform -- we are a movement. Solo SHE Things empowers women
              to explore the world confidently, share their stories authentically, and build meaningful
              connections with fellow adventurers.
            </p>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-brand-cream p-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-coral/10">
                    <stat.icon className="h-5 w-5 text-brand-coral" />
                  </div>
                  <p className="mt-2 font-serif text-2xl font-bold text-brand-navy">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-coral/90 hover:shadow-lg"
            >
              Read My Story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
