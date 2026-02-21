import Link from "next/link"
import { Instagram, Twitter, Youtube, Mail } from "lucide-react"

const footerLinks = {
  destinations: [
    { href: "/destinations?continent=europe", label: "Europe" },
    { href: "/destinations?continent=asia", label: "Asia" },
    { href: "/destinations?continent=americas", label: "Americas" },
    { href: "/destinations?continent=africa", label: "Africa" },
  ],
  resources: [
    { href: "/blog?category=safety-tips", label: "Safety Tips" },
    { href: "/blog?category=budget", label: "Budget Travel" },
    { href: "/blog?category=solo-tips", label: "Solo Tips" },
    { href: "/packing-list", label: "Packing List" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/community", label: "Community" },
    { href: "/press", label: "Press" },
  ],
}

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  { href: "mailto:hello@soloshethings.com", icon: Mail, label: "Email" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold text-brand-navy">
              Solo <span className="text-brand-coral">SHE</span> Things
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A safe space for solo female travelers to discover, share, and connect. Empowering women
              to explore the world with confidence.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-coral hover:text-brand-coral"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">Destinations</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-coral"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-coral"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-coral"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Solo SHE Things. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-brand-coral">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-brand-coral">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
