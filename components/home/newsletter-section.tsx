"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mail, Check } from "lucide-react"

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
    <section className="bg-brand-cream py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-xl text-center">
          {/* Eyebrow */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Stay Connected
          </p>

          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl lg:text-5xl text-balance">
            The Connection Collective
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-brand-orange" />

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Sign up for the inside scoop on all the latest tips, tricks, photos, and destination guides
            from fellow solo SHE travelers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-full border-2 border-border bg-white pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-brand-orange sm:rounded-r-none"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-12 gap-2 rounded-full bg-brand-orange px-6 text-white transition-all hover:bg-brand-orange/90 sm:rounded-l-none"
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
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-4 py-2 text-sm text-brand-blue">
              <Check className="h-4 w-4 text-brand-gold" />
              Welcome to the collective! Check your inbox for a confirmation.
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Join 10,000+ solo female travelers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
