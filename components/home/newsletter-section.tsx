"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check } from "lucide-react"

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
    <section className="relative overflow-hidden bg-[#fab642] py-16 md:py-20">
      {/* Wavy top border */}
      <div className="absolute left-0 right-0 top-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="#e34b16"
        >
          <path d="M0,30 C200,0 400,30 600,15 C800,0 1000,30 1200,15 L1200,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-xl text-center">
          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-[#7a331b] md:text-4xl">
            Stay in the Loop
          </h2>

          <p className="mt-4 text-[#3a3a3a]">
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
                className="h-12 gap-2 rounded-full bg-[#e34b16] px-6 text-white transition-all hover:bg-[#c43d10] sm:rounded-l-none"
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

      {/* Wavy bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          className="h-full w-full"
          fill="white"
        >
          <path d="M0,0 C200,30 400,0 600,15 C800,30 1000,0 1200,15 L1200,30 L0,30 Z" />
        </svg>
      </div>
    </section>
  )
}
