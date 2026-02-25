"use client"

import { useState } from "react"
import { Mail, MessageSquare, Instagram, Send, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState("submitting")
    // Simulate submission
    setTimeout(() => {
      setFormState("success")
      setForm({ name: "", email: "", subject: "", message: "" })
    }, 1500)
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-blue py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-peach/30 bg-brand-peach/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-peach">
            <MessageSquare className="h-3.5 w-3.5" />
            Get In Touch
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl text-balance">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-brand-peach/80">
            Have a question, collaboration idea, or just want to say hi?
            We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Left -- Info */}
            <div className="flex flex-col gap-8 lg:w-2/5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-orange">
                  Let&apos;s Connect
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Whether you want to collaborate, share your solo travel story, or just chat about
                  your next adventure -- reach out. The SHEsisterhood is always growing.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                    <Mail className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <a href="mailto:hello@soloshethings.com" className="text-sm text-brand-blue hover:underline">
                      hello@soloshethings.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                    <Instagram className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Instagram</p>
                    <a href="https://instagram.com/soloshethings" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">
                      @soloshethings
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                    <MapPin className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Based In</p>
                    <p className="text-sm text-muted-foreground">Virginia Beach, VA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10">
                    <Clock className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Response Time</p>
                    <p className="text-sm text-muted-foreground">Usually within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right -- Form */}
            <div className="lg:w-3/5">
              <div className="rounded-2xl border border-border bg-muted/30 p-8 md:p-10">
                {formState === "success" ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
                      <Send className="h-7 w-7 text-brand-orange" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-bold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Thanks for reaching out. We will get back to you soon.
                    </p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="mt-6 rounded-full bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <h3 className="font-serif text-xl font-bold text-foreground">Send a Message</h3>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                      >
                        <option value="">Select a subject...</option>
                        <option value="general">General Inquiry</option>
                        <option value="collab">Collaboration / Partnership</option>
                        <option value="story">Share My Solo Story</option>
                        <option value="press">Press / Media</option>
                        <option value="support">Support / Feedback</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind..."
                        className="resize-none rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {formState === "submitting" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold text-brand-orange">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { q: "How can I contribute a story?", a: "We love featuring community stories! Use the contact form above and select 'Share My Solo Story' as the subject, or email us directly with your story idea." },
                { q: "Do you offer sponsored content or partnerships?", a: "Yes! We partner with travel brands that align with our values. Select 'Collaboration / Partnership' in the form above and tell us about your brand." },
                { q: "Is Solo SHE Things only for solo travelers?", a: "While our focus is solo female travel, our community welcomes all women who love travel -- whether solo, with friends, or exploring new ways to adventure." },
                { q: "When will the shop be fully open?", a: "We are finalizing our first collection and will announce the launch through our newsletter. Sign up to be the first to know!" },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-border bg-white px-6 py-4 transition-all hover:shadow-sm"
                >
                  <summary className="cursor-pointer list-none font-semibold text-foreground">
                    <span className="flex items-center justify-between">
                      {faq.q}
                      <span className="ml-4 text-brand-orange transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
