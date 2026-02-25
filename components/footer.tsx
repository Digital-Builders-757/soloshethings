import Link from "next/link"

const footerLinks = {
  destinations: [
    { href: "/destinations?continent=europe", label: "Europe" },
    { href: "/destinations?continent=asia", label: "Asia" },
    { href: "/destinations?continent=americas", label: "South America" },
    { href: "/destinations?continent=africa", label: "Africa" },
  ],
  resources: [
    { href: "/blog?category=safety-tips", label: "Safety Guides" },
    { href: "/packing-list", label: "Packing Lists" },
    { href: "/insurance", label: "Insurance" },
    { href: "/hostels", label: "Hostels" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/contact", label: "Contact" },
  ],
}

const socials = [
  { label: "Ig", href: "https://instagram.com" },
  { label: "Fb", href: "https://facebook.com" },
  { label: "Tt", href: "https://tiktok.com" },
]

export function Footer() {
  return (
    <footer className="bg-[#FFF0F5] py-24 pb-16">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-16 px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <h3 className="font-serif text-[2rem] font-bold text-brand-orange">
            Solo SHE Things
          </h3>
          <p className="mt-4 text-[#555]">
            Empowering women to see the world.
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-peach text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                aria-label={s.label}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <h4 className="mb-8 font-serif text-xl font-bold text-brand-blue">
            Destinations
          </h4>
          <ul className="space-y-3">
            {footerLinks.destinations.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.95rem] font-medium text-[#555] transition-colors hover:text-brand-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-8 font-serif text-xl font-bold text-brand-blue">
            Resources
          </h4>
          <ul className="space-y-3">
            {footerLinks.resources.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.95rem] font-medium text-[#555] transition-colors hover:text-brand-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-8 font-serif text-xl font-bold text-brand-blue">
            Company
          </h4>
          <ul className="space-y-3">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.95rem] font-medium text-[#555] transition-colors hover:text-brand-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
