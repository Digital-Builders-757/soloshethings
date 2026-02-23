"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mail, Sparkles, Check } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStatus("success")
    setEmail("")

    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <section className="relative overflow-hidden bg-[#FB5315] py-24">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#DD9917]/10" />

      {/* Floating sparkles */}
      <div className="absolute left-[15%] top-[20%] animate-float">
        <Sparkles className="h-6 w-6 text-[#FFD0A9]/30" />
      </div>
      <div className="absolute right-[20%] top-[30%] animate-float" style={{ animationDelay: "1s" }}>
        <Mail className="h-5 w-5 text-[#FFD0A9]/20" />
      </div>
      <div className="absolute bottom-[25%] left-[25%] animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="h-4 w-4 text-[#FFD0A9]/25" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-10 backdrop-blur-xl md:px-10">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#FFD0A9]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#FFD0A9] backdrop-blur-sm">
            <Mail className="h-3 w-3" />
            Newsletter
            </span>

            <h2 className="font-serif text-3xl font-bold text-[#FFD0A9] md:text-4xl lg:text-5xl">
              The Connection Collective
            </h2>
            <p className="mt-4 text-lg text-[#FFD0A9]/90">
              Sign up to stay current on all of my latest tips, tricks, photos, and destination guides.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-0">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FFD0A9]/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-full border-2 border-[#FFD0A9]/40 bg-white/15 pl-12 pr-4 text-[#FFD0A9] placeholder:text-[#FFD0A9]/60 backdrop-blur-sm focus:border-[#FFD0A9] focus:bg-white/25 sm:rounded-r-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-14 gap-2 rounded-full !bg-[#2044E0] px-8 text-white transition-all hover:shadow-lg sm:rounded-l-none"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Subscribing...
                    </>
                  ) : status === "success" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {status === "success" && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFD0A9]/20 px-4 py-2 text-sm text-[#FFD0A9] backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Welcome to the community! Check your inbox for a confirmation email.
              </div>
            )}

            <p className="mt-6 text-xs text-[#FFD0A9]/70">
              Join 10,000+ solo female travelers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
