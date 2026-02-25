"use client"

import React from "react"
import { useState } from "react"

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
    <section className="bg-brand-gold py-14 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 text-center md:px-8">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl md:text-[3rem]">
          The Connection Collective
        </h2>
        <p className="mt-3 text-base text-white md:mt-4 md:text-xl">
          Weekly tips, safety alerts, and inspiration sent to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-[500px] flex-col gap-3 sm:flex-row sm:gap-4 md:mt-8"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border-none px-5 py-3.5 font-sans text-base text-[#1A1A1A] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-brand-blue md:px-6 md:py-4"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-brand-blue px-6 py-3.5 font-bold uppercase text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-70 md:px-8 md:py-4"
          >
            {status === "loading"
              ? "..."
              : status === "success"
              ? "Subscribed!"
              : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm font-medium text-white/90">
            Welcome to the collective! Check your inbox.
          </p>
        )}
      </div>
    </section>
  )
}
