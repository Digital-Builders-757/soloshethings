"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Check,
  MessageCircle,
  Handshake,
  PenLine,
} from "lucide-react"

const contactReasons = [
  {
    icon: MessageCircle,
    title: "General Inquiry",
    description: "Questions about Solo SHE Things, the community, or anything else on your mind.",
  },
  {
    icon: Handshake,
    title: "Collaborations",
    description:
      "Interested in working together? We love partnering with brands that empower women travelers.",
  },
  {
    icon: PenLine,
    title: "Share Your Story",
    description:
      "Have an inspiring solo travel story? We would love to feature it on our blog and social channels.",
  },
]

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram", handle: "@soloshethings" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter", handle: "@soloshethings" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube", handle: "Solo SHE Things" },
]

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus("success")
    setFormState({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setStatus("idle"), 4000)
  }

  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-14 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid items-center gap-10 md:gap-16 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-5 text-center md:gap-6 lg:text-left">
                <h1 className="font-serif text-4xl font-bold leading-[0.95] text-brand-blue sm:text-5xl md:text-6xl lg:text-7xl">
                  Let{"'"}s{" "}
                  <span className="italic font-normal text-brand-orange">Connect</span>
                </h1>
                <p className="mx-auto max-w-[450px] text-base leading-relaxed text-[#555] md:text-lg lg:mx-0">
                  Whether you have a question, want to collaborate, or simply want to share your solo
                  travel story -- we would love to hear from you. The SHEsisterhood is always
                  listening.
                </p>

                {/* Quick contact info */}
                <div className="mt-1 flex flex-col items-center gap-3 md:mt-2 md:gap-4 lg:items-start">
                  <div className="flex items-center gap-3 text-[#555]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach md:h-10 md:w-10">
                      <Mail className="h-4 w-4 text-brand-orange md:h-5 md:w-5" />
                    </div>
                    <span className="text-sm font-medium md:text-base">hello@soloshethings.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#555]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach md:h-10 md:w-10">
                      <MapPin className="h-4 w-4 text-brand-orange md:h-5 md:w-5" />
                    </div>
                    <span className="text-sm font-medium md:text-base">Based worldwide -- currently Norfolk, VA</span>
                  </div>
                </div>
              </div>
              <div className="relative px-2 md:p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-peach-offset shadow-peach-offset-hover transition-all md:rounded-3xl">
                  <Image
                    src="/images/contact-hero.jpg"
                    alt="Woman writing postcards at a seaside destination"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Reasons */}
        <section className="bg-[#FFF8F3] py-12 md:py-16">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
              {contactReasons.map((reason) => (
                <div
                  key={reason.title}
                  className="flex flex-col items-center rounded-2xl border-2 border-[#eee] bg-white p-6 text-center transition-all hover:-translate-y-2 hover:border-brand-gold md:rounded-3xl md:p-8"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-peach md:h-14 md:w-14">
                    <reason.icon className="h-6 w-6 text-brand-orange md:h-7 md:w-7" />
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-bold text-brand-blue md:mt-4 md:text-xl">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555] md:mt-3">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form + Social */}
        <section className="py-14 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-10 md:gap-12 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  Write to Us
                </span>
                <h2 className="mt-4 font-serif text-2xl font-bold italic text-brand-orange sm:text-3xl md:text-4xl">
                  Send Us a Message
                </h2>
                <p className="mt-3 text-sm text-[#555] md:mt-4 md:text-base">
                  Fill out the form below and we will get back to you within 48 hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 md:mt-8 md:gap-6">
                  <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, name: e.target.value }))
                        }
                        required
                        className="h-11 rounded-xl border-2 border-[#eee] px-4 focus:border-brand-orange md:h-12 md:px-6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, email: e.target.value }))
                        }
                        required
                        className="h-11 rounded-xl border-2 border-[#eee] px-4 focus:border-brand-orange md:h-12 md:px-6"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, subject: e.target.value }))
                      }
                      required
                      className="h-11 rounded-xl border-2 border-[#eee] px-4 focus:border-brand-orange md:h-12 md:px-6"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us what is on your mind..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, message: e.target.value }))
                      }
                      required
                      className="rounded-xl border-2 border-[#eee] px-4 py-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-0 md:px-6 md:py-4"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-11 gap-2 rounded-full bg-brand-orange px-6 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange md:h-12 md:px-8"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : status === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {status === "success" && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-4 py-2 text-sm font-medium text-brand-blue">
                      <Check className="h-4 w-4 text-brand-gold" />
                      Thank you! We will be in touch soon.
                    </div>
                  )}
                </form>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-6 md:gap-8 lg:col-span-2">
                {/* Social */}
                <div className="rounded-2xl border-2 border-[#eee] bg-[#FFF8F3] p-6 md:rounded-3xl md:p-8">
                  <h3 className="font-serif text-lg font-bold text-brand-blue md:text-xl">Follow Along</h3>
                  <p className="mt-2 text-sm text-[#555]">
                    Stay connected and see what we are up to on social media.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 md:mt-6 md:gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border-2 border-[#eee] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-md md:gap-4 md:p-4"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach md:h-10 md:w-10">
                          <social.icon className="h-4 w-4 text-brand-orange md:h-5 md:w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{social.label}</p>
                          <p className="text-xs text-[#555]">{social.handle}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* FAQ teaser */}
                <div className="rounded-2xl bg-brand-blue p-6 text-white md:rounded-3xl md:p-8">
                  <h3 className="font-serif text-lg font-bold italic text-brand-peach md:text-xl">
                    Frequently Asked
                  </h3>
                  <div className="mt-4 flex flex-col gap-4 md:mt-6">
                    <div>
                      <p className="text-sm font-bold text-brand-peach">
                        Is Solo SHE Things free to join?
                      </p>
                      <p className="mt-1 text-sm text-white/70">
                        Yes! Our community is completely free. Sign up and start connecting with
                        fellow solo travelers today.
                      </p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div>
                      <p className="text-sm font-bold text-brand-peach">
                        How can I share my story?
                      </p>
                      <p className="mt-1 text-sm text-white/70">
                        Use this contact form or email us directly. We feature community stories on
                        our blog and social channels.
                      </p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div>
                      <p className="text-sm font-bold text-brand-peach">
                        Do you offer group trips?
                      </p>
                      <p className="mt-1 text-sm text-white/70">
                        We host occasional community meetups around the world. Follow us on social
                        media for announcements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-16 text-center text-white md:py-28">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8">
            <h2 className="font-serif text-3xl font-bold italic sm:text-4xl md:text-5xl lg:text-6xl">
              Not Ready to Reach Out?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/90 md:mt-6 md:text-lg">
              Join the community and connect with thousands of solo female travelers from around
              the world.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10 md:gap-6">
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all hover:shadow-lg sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Join the SHEsisterhood
              </Link>
              <Link
                href="/blog"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10 sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
