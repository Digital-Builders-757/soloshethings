"use client"

import React from "react"
import { useState } from "react"

/**
 * Stay in the Loop (Newsletter)
 * 
 * Full-width blue section with email signup
 */

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
    <section className="relative bg-[#2044e0] py-16 md:py-24">
      {/* Animated Mudcloth-inspired pattern overlay */}
      <div className="pointer-events-none absolute inset-0 animate-pattern-drift pattern-mudcloth opacity-40" />
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 text-center md:px-8">
        <h2 className="text-2xl font-bold text-white md:text-[2rem]">
          Stay in the <span className="animate-pulse-glow italic text-[#ffd0a9]">Loop</span>
        </h2>
        <p className="mt-3 text-base text-white/90 md:text-lg">
          Sign up for tips, inspiration, and stories from solo SHEs around the world.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-[400px] flex-col gap-3 sm:flex-row sm:gap-0 md:mt-8"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border-2 border-white bg-transparent px-5 py-3 text-base text-white placeholder:text-white/60 focus:outline-none sm:rounded-r-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-white px-6 py-3 font-semibold text-[#df4915] transition-all hover:scale-105 hover:bg-white/90 disabled:opacity-70 sm:rounded-l-none"
          >
            {status === "loading"
              ? "..."
              : status === "success"
              ? "Subscribed!"
              : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="animate-slide-in-up mt-4 text-sm font-medium text-white/90">
            Welcome! Check your inbox for confirmation.
          </p>
        )}
      </div>
    </section>
  )
}
