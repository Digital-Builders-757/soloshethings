import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ArrowRight, ShoppingBag, Star, Truck, Shield, Heart } from "lucide-react"

const products = [
  {
    id: "travel-journal",
    name: "Solo SHE Travel Journal",
    description:
      "A beautifully designed journal with travel prompts, safety checklists, and space for your solo adventures. Your stories deserve to be written down.",
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
      "A durable canvas tote perfect for day trips, beach days, and exploring new cities. Carry the SHEsisterhood spirit wherever you go.",
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
      "Stylish UV-protective wide-brim hat that packs flat in your suitcase. Look good and stay safe under the sun.",
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
      "Premium vegan leather passport holder with boarding pass pocket and RFID protection. Travel in style and security.",
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
      "A collection of 25 waterproof travel stickers featuring destinations, empowering quotes, and Solo SHE Things designs.",
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
      "Insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. A travel essential.",
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
        <section className="relative bg-brand-blue py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-peach">
                  The SHE Shop
                </p>
                <h1 className="font-serif text-4xl font-bold leading-tight text-brand-peach md:text-5xl lg:text-6xl text-balance">
                  Gear Up for Your Next{" "}
                  <span className="text-brand-orange">Solo Adventure</span>
                </h1>
                <div className="h-1 w-16 rounded-full bg-brand-orange" />
                <p className="max-w-lg text-lg leading-relaxed text-brand-peach/80">
                  Curated travel essentials designed for the solo female traveler. Every purchase
                  supports our mission to empower women to explore the world.
                </p>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl lg:h-[500px]">
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
        </section>

        {/* Perks Bar */}
        <section className="bg-brand-cream py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {perks.map((perk) => (
                <div key={perk.title} className="flex items-center gap-4 justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10">
                    <perk.icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{perk.title}</p>
                    <p className="text-xs text-muted-foreground">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Travel Essentials
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
                Shop the Collection
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-blue" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-brand-cream/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-brand-gold text-brand-gold" />
                        <span className="text-sm font-medium text-foreground">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-brand-blue">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-serif text-2xl font-bold text-brand-orange">
                        {product.price}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-md"
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
        <section className="bg-brand-cream py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                More Coming Soon
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl text-balance">
                We Are Always Curating
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-blue" />
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                We are working on new products including safety kits, packing cubes, and exclusive
                apparel designed specifically for the solo female traveler. Sign up for our newsletter
                to be the first to know.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-orange py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-pink md:text-4xl text-balance">
                Every Purchase Supports the Mission
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-brand-pink/90">
                10% of every sale goes directly to supporting women{"'"}s travel scholarships and
                safety initiatives around the world.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-orange transition-all hover:bg-brand-peach hover:shadow-lg"
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
