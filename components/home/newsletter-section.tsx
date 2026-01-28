"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

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
    <section className="bg-primary py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl text-balance">Want to be Pen Pals?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">Sign up to stay current on all my latest tips, tricks, photos, and destination guides.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-2">
            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground" />
            <Button type="submit" variant="secondary" disabled={status === "loading"} className="gap-2">
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : <><span>Subscribe</span><Send className="h-4 w-4" /></>}
            </Button>
          </form>

          {status === "success" && <p className="mt-4 text-sm text-primary-foreground">Welcome to the community! Check your inbox for a confirmation email.</p>}
        </div>
      </div>
    </section>
  )
}