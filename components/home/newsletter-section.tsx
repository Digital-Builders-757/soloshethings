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
    <section className="relative overflow-hidden home-newsletter-bg py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 home-newsletter-radials" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/45" />

      {/* Floating sparkles */}
      <div className="absolute left-[15%] top-[20%] animate-float">
        <Sparkles className="h-6 w-6 text-white/30" />
      </div>
      <div className="absolute right-[20%] top-[30%] animate-float" style={{ animationDelay: "1s" }}>
        <Mail className="h-5 w-5 text-white/20" />
      </div>
      <div className="absolute bottom-[25%] left-[25%] animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="h-4 w-4 text-white/25" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/12 via-white/6 to-white/12 px-6 py-10 backdrop-blur-xl shadow-[0_0_45px_rgba(4,57,217,0.35)] md:px-10">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_0_18px_rgba(4,57,217,0.4)] backdrop-blur-sm">
            <Mail className="h-3 w-3" />
            Stay Connected
            </span>

            <h2 className="font-serif text-3xl font-bold text-white drop-shadow-[0_6px_24px_rgba(4,57,217,0.6)] md:text-4xl lg:text-5xl">
              Want to be Pen Pals?
            </h2>
            <p className="mt-4 text-lg text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]">
              Sign up to stay current on all my latest tips, tricks, photos, and destination guides.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-0">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-full border-2 border-white/40 bg-white/15 pl-12 pr-4 text-white placeholder:text-white/60 shadow-[0_0_18px_rgba(4,57,217,0.25)] backdrop-blur-sm focus:border-white focus:bg-white/25 sm:rounded-r-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-14 gap-2 rounded-full bg-brand-blue1 px-8 text-white transition-all hover:bg-brand-blue2 hover:shadow-lg hover:shadow-brand-blue1/40 sm:rounded-l-none"
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
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white shadow-[0_0_18px_rgba(4,57,217,0.35)] backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Welcome to the community! Check your inbox for a confirmation email.
              </div>
            )}

            <p className="mt-6 text-xs text-white/70">
              Join 10,000+ solo female travelers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}