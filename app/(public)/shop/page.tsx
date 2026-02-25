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
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-24 md:py-32">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-6">
                <h1 className="font-serif text-5xl font-bold leading-[0.95] text-brand-blue md:text-6xl lg:text-7xl">
                  The{" "}
                  <span className="italic font-normal text-brand-orange">SHE</span> Shop
                </h1>
                <p className="max-w-[450px] text-lg leading-relaxed text-[#555]">
                  Curated travel essentials designed for the solo female traveler. Every purchase
                  supports our mission to empower women to explore the world.
                </p>
                <div className="inline-block" style={{ transform: "rotate(-3deg)" }}>
                  <Link
                    href="#products"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
              <div className="relative p-4">
                <div className="sticker-badge absolute right-0 top-8 z-10 rounded-full bg-brand-orange px-6 py-2 text-sm font-bold text-white shadow-lg" style={{ transform: "rotate(12deg)" }}>
                  New Arrivals!
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-peach-offset shadow-peach-offset-hover transition-all">
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
        <section className="bg-[#FFF8F3] py-8">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {perks.map((perk) => (
                <div key={perk.title} className="flex items-center justify-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-peach">
                    <perk.icon className="h-5 w-5 text-brand-orange" />
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
        <section id="products" className="py-24">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mb-16 text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Travel Essentials
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-brand-blue md:text-4xl">
                Shop the Collection
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white shadow-md" style={{ transform: "rotate(-2deg)" }}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                      <span className="text-sm font-bold text-foreground">
                        {product.rating}
                      </span>
                      <span className="text-sm text-[#555]">
                        ({product.reviews})
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-brand-blue">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#555]">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-serif text-2xl font-bold text-brand-orange">
                        {product.price}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="bg-brand-blue py-24 text-white">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="font-serif text-3xl font-bold italic md:text-4xl">
                We Are Always Curating
              </h2>
              <p className="mt-6 text-lg leading-[1.8] text-white/70">
                We are working on new products including safety kits, packing cubes, and exclusive
                apparel designed specifically for the solo female traveler. Sign up for our newsletter
                to be the first to know.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-brand-orange transition-all hover:bg-white hover:text-brand-orange"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-28 text-center text-white">
          <div className="relative z-10 mx-auto max-w-[1240px] px-8">
            <h2 className="font-serif text-4xl font-bold italic md:text-5xl lg:text-6xl">
              Every Purchase Supports the Mission
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-white/90">
              10% of every sale goes directly to supporting women{"'"}s travel scholarships and
              safety initiatives around the world.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-orange transition-all hover:shadow-lg"
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
