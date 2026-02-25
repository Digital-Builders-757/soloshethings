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
          <div className="mt-3 flex gap-3 md:mt-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach text-xs font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white md:h-10 md:w-10 md:text-sm"
                aria-label={s.label}
              >
                {s.label}
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
