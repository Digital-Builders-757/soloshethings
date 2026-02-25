import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ArrowRight, ShoppingBag, Star, Truck, Shield, Heart } from "lucide-react"

const products = [
  {
    id: "travel-journal",
    name: "Solo SHE Travel Journal",
    description:
      "A beautifully designed journal with travel prompts, safety checklists, and space for your solo adventures.",
    price: "$28.00",
    image: "/images/shop-journal.jpg",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 142,
  },
  {
    id: "adventure-tote",
    name: "SHEsisterhood Tote Bag",
    description:
      "A durable canvas tote perfect for day trips, beach days, and exploring new cities.",
    price: "$24.00",
    image: "/images/shop-tote.jpg",
    badge: null,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "sun-hat",
    name: "Wanderlust Sun Hat",
    description:
      "Stylish UV-protective wide-brim hat that packs flat in your suitcase.",
    price: "$35.00",
    image: "/images/shop-hat.jpg",
    badge: "New",
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "passport-holder",
    name: "Solo Passport Holder",
    description:
      "Premium vegan leather passport holder with boarding pass pocket and RFID protection.",
    price: "$22.00",
    image: "/images/shop-passport.jpg",
    badge: null,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "sticker-pack",
    name: "Destination Sticker Pack",
    description:
      "A collection of 25 waterproof travel stickers featuring destinations and empowering quotes.",
    price: "$12.00",
    image: "/images/shop-stickers.jpg",
    badge: null,
    rating: 4.8,
    reviews: 312,
  },
  {
    id: "travel-bottle",
    name: "Explorer Water Bottle",
    description:
      "Insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12.",
    price: "$32.00",
    image: "/images/shop-bottle.jpg",
    badge: null,
    rating: 4.7,
    reviews: 167,
  },
]

const perks = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "Your information is safe",
  },
  {
    icon: Heart,
    title: "Community Impact",
    description: "10% supports women travelers",
  },
]

export default function ShopPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-14 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid items-center gap-10 md:gap-16 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-5 text-center md:gap-6 lg:text-left">
                <h1 className="font-serif text-4xl font-bold leading-[0.95] text-brand-blue sm:text-5xl md:text-6xl lg:text-7xl">
                  The{" "}
                  <span className="italic font-normal text-brand-orange">SHE</span> Shop
                </h1>
                <p className="mx-auto max-w-[450px] text-base leading-relaxed text-[#555] md:text-lg lg:mx-0">
                  Curated travel essentials designed for the solo female traveler. Every purchase
                  supports our mission to empower women to explore the world.
                </p>
                <div className="inline-block" style={{ transform: "rotate(-3deg)" }}>
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange md:px-8 md:py-4"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="relative px-2 md:p-4">
                <div className="absolute right-0 top-2 z-10 rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white shadow-lg md:right-0 md:top-8 md:px-6 md:py-2 md:text-sm" style={{ transform: "rotate(12deg)" }}>
                  New Arrivals!
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-peach-offset shadow-peach-offset-hover transition-all md:rounded-3xl">
                  <Image
                    src="/images/shop-hero.jpg"
                    alt="Curated travel accessories for solo female travelers"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perks Bar */}
        <section className="bg-[#FFF8F3] py-6 md:py-8">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              {perks.map((perk) => (
                <div key={perk.title} className="flex items-center justify-center gap-3 md:gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach md:h-10 md:w-10">
                    <perk.icon className="h-4 w-4 text-brand-orange md:h-5 md:w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{perk.title}</p>
                    <p className="text-xs text-[#555]">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-14 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="mb-10 text-center md:mb-16">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Travel Essentials
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-brand-blue sm:text-3xl md:text-4xl">
                Shop the Collection
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold md:rounded-3xl"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-md md:left-4 md:top-4 md:px-4 md:py-1.5" style={{ transform: "rotate(-2deg)" }}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 md:p-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                      <span className="text-sm font-bold text-foreground">
                        {product.rating}
                      </span>
                      <span className="text-sm text-[#555]">
                        ({product.reviews})
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-bold text-brand-blue md:text-xl">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[#555] md:mt-2">
                      {product.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between md:mt-4">
                      <span className="font-serif text-xl font-bold text-brand-orange md:text-2xl">
                        {product.price}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-4 py-2 text-xs font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange md:gap-2 md:px-5 md:py-2.5"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="bg-brand-blue py-14 text-white md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="font-serif text-2xl font-bold italic sm:text-3xl md:text-4xl">
                We Are Always Curating
              </h2>
              <p className="mt-4 text-base leading-[1.8] text-white/70 md:mt-6 md:text-lg">
                We are working on new products including safety kits, packing cubes, and exclusive
                apparel designed specifically for the solo female traveler. Sign up for our newsletter
                to be the first to know.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange md:mt-8 md:px-8 md:py-4"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-16 text-center text-white md:py-28">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8">
            <h2 className="font-serif text-3xl font-bold italic sm:text-4xl md:text-5xl lg:text-6xl">
              Every Purchase Supports the Mission
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/90 md:mt-6 md:text-lg">
              10% of every sale goes directly to supporting women{"'"}s travel scholarships and
              safety initiatives around the world.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10 md:gap-6">
              <Link
                href="/about"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all hover:shadow-lg sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Learn About Our Mission
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
