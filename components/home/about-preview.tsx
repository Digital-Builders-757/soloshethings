import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { founder } from "@/lib/data"
import { ArrowRight, Globe, Users, Heart } from "lucide-react"

const stats = [
  { icon: Globe, label: "Countries Visited", value: "45+" },
  { icon: Users, label: "Community Members", value: "10K+" },
  { icon: Heart, label: "Stories Shared", value: "500+" },
]

export function AboutPreview() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl lg:h-[500px]">
            <Image src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=1000&fit=crop" alt="Founder traveling solo" fill className="object-cover" />
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Meet the Founder</span>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">Hey, I&apos;m {founder.name.split(" ")[0]}!</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{founder.bio}</p>

            <div className="mt-4 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="mt-4">
              <Button className="gap-2">Read My Story<ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}