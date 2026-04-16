"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check } from "lucide-react"

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
    <section className="bg-[#c4722a] py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-xl text-center">
          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Stay in the Loop
          </h2>

          <p className="mt-4 text-white/90">
            Sign up for tips, inspiration, and stories from solo SHEs around the world.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-full border-2 border-white bg-white pl-5 pr-4 text-[#3a3a3a] placeholder:text-[#a8a8a8] focus:border-[#7a331b] sm:rounded-r-none"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-12 gap-2 rounded-full bg-[#fab642] px-6 text-[#7a331b] font-bold transition-all hover:bg-[#fab642]/90 sm:rounded-l-none"
              >
                {status === "loading" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#7a331b]/30 border-t-[#7a331b]" />
                    Subscribing...
                  </>
                ) : status === "success" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          </form>

          {status === "success" && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-[#7a331b]">
              <Check className="h-4 w-4 text-[#e34b16]" />
              Welcome! Check your inbox for a confirmation.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
