import { Footer } from "@/components/footer"
import Image from "next/image"
import { Globe, Users, Heart, Sparkles } from "lucide-react"

const stats = [
  { icon: Globe, label: "Countries Visited", value: "45+", color: "bg-[#0439D9]" },
  { icon: Users, label: "Community Members", value: "10K+", color: "bg-[#F2E205]" },
  { icon: Heart, label: "Stories Shared", value: "500+", color: "bg-[#F28705]" },
]

export default function AboutPage() {
  return (
    <>
      <main className="relative min-h-screen bg-white py-24">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#F2E205]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#0439D9]/10 blur-3xl" />

        <div className="container relative mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-[400px] overflow-hidden rounded-2xl border-2 border-[#0439D9]/20 lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=1000&fit=crop"
                alt="Founder traveling solo"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4">
                <p className="text-sm font-medium text-neutral-900">
                  <Sparkles className="mb-1 inline h-4 w-4 text-[#0439D9]" /> Traveled to 45+ countries solo
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0439D9]/15 border border-[#0439D9]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-900">
                <Sparkles className="h-3 w-3 text-[#0439D9]" />
                Meet the Founder
              </span>

              <h1 className="font-serif text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
                <span className="text-[#0439D9]">
                  About Solo She Things
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-neutral-700">
                We&apos;re more than just a platform – we&apos;re a movement. Solo She Things empowers women to explore the world confidently, share their stories authentically, and build meaningful connections with fellow adventurers who understand the unique joys and challenges of solo female travel.
              </p>

              <p className="text-lg leading-relaxed text-neutral-700">
                Our Mission: To empower solo female travelers with safe, curated travel experiences, destination guides, and a supportive community that celebrates the freedom and courage it takes to explore the world on your own terms.
              </p>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group rounded-xl border-2 border-[#0439D9]/20 p-4 text-center transition-all hover:-translate-y-1"
                  >
                    <div className="rounded-lg bg-card p-3">
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="mt-3 font-serif text-2xl font-bold text-neutral-900">{stat.value}</p>
                      <p className="text-xs text-neutral-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
