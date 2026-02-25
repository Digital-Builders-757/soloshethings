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
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.53a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.06z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-[#FFF0F5] py-12 pb-10 md:py-24 md:pb-16">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-8 px-5 md:grid-cols-2 md:gap-16 md:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {/* Brand - full width on smallest mobile */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="font-serif text-xl font-bold text-brand-orange md:text-[2rem]">
            Solo SHE Things
          </h3>
          <p className="mt-3 text-sm text-[#555] md:mt-4 md:text-base">
            Empowering women to see the world.
          </p>
          <div className="mt-4 flex gap-3 md:mt-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white transition-all hover:scale-110 hover:bg-brand-blue md:h-11 md:w-11"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <h4 className="mb-4 font-serif text-lg font-bold text-brand-blue md:mb-8 md:text-xl">
            Destinations
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {footerLinks.destinations.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#555] transition-colors hover:text-brand-orange md:text-[0.95rem]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-4 font-serif text-lg font-bold text-brand-blue md:mb-8 md:text-xl">
            Resources
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {footerLinks.resources.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#555] transition-colors hover:text-brand-orange md:text-[0.95rem]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 font-serif text-lg font-bold text-brand-blue md:mb-8 md:text-xl">
            Company
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-[#555] transition-colors hover:text-brand-orange md:text-[0.95rem]"
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
