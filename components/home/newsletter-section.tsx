"use client"

import React, { useState } from "react"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const newsletterBenefits = [
  "New editorial stories and destination notes",
  "Safety-minded travel reflections and rituals",
  "A warm nudge to keep planning your next brave thing",
]

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("success")
    setEmail("")
    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <section className="bg-[#f7e8be] py-16 md:py-24">
      <div className="container mx-auto shell-inline">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#fffaf0] shadow-[0_30px_80px_rgba(122,51,27,0.12)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[#7a331b] px-8 py-10 text-[#fff5df] md:px-10 md:py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">
                Stay in the loop
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Quietly inspiring notes for your next chapter of travel.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#fff5df]/82">
                Get stories, destination inspiration, and confidence-building reflections delivered to your inbox.
              </p>

              <div className="mt-8 space-y-3">
                {newsletterBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-[1.25rem] bg-white/8 px-4 py-3 text-sm leading-6">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#fab642]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffaf0] px-8 py-10 md:px-10 md:py-12">
              <div className="mx-auto max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a14b24]">
                  Join the list
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] md:text-4xl">
                  Beautiful places, real women, useful perspective.
                </h3>
                <p className="mt-4 text-base leading-7 text-[#6d5849]">
                  No spam. Just the best of Solo SHE Things, with enough substance to make the next step feel possible.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="rounded-[2rem] border border-[#efdac1] bg-white p-2 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a14b24]" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-14 rounded-full border-0 bg-transparent pl-12 pr-4 text-[#3a3a3a] placeholder:text-[#b28b6f] focus-visible:ring-0"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={status === "loading"}
                        className="h-14 rounded-full bg-[#e34b16] px-7 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#c74010]"
                      >
                        {status === "loading"
                          ? "Subscribing..."
                          : status === "success"
                            ? "Subscribed"
                            : "Subscribe"}
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-5 min-h-[2rem] text-sm text-[#7a331b]">
                  {status === "success" && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#f7e8be] px-4 py-2 font-medium">
                      <Check className="h-4 w-4 text-[#e34b16]" />
                      Welcome, check your inbox for a confirmation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
