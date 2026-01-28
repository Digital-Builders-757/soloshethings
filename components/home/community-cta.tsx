import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CommunityCTA() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance">Join Our Community</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Connect with thousands of solo female travelers from around the world. Share your stories, get travel tips, and find your next adventure.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup"><Button size="lg" className="px-8">Join the Community</Button></Link>
            <Link href="/community"><Button variant="outline" size="lg" className="px-8 bg-transparent">Learn More</Button></Link>
          </div>
        </div>
      </div>
    </section>
  )
}