import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Star } from "lucide-react"

export const metadata = {
  title: "Shop | Solo SHE Things",
  description: "Shop Solo SHE Things merch -- totes, hats, journals, stickers and more for the solo female traveler.",
}

const products = [
  {
    id: 1,
    name: "Solo SHE Tote Bag",
    description: "The perfect carry-on companion. Durable canvas tote with the Solo SHE Things logo embroidered in orange.",
    price: "$28.00",
    image: "/images/shop-tote.jpg",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "SHE Cap",
    description: "Rep the movement wherever you go. Adjustable baseball cap with \"SHE\" embroidered on the front.",
    price: "$24.00",
    image: "/images/shop-hat.jpg",
    badge: null,
  },
  {
    id: 3,
    name: "Solo Travel Journal",
    description: "Document every adventure. Premium leather-bound journal with gold embossing and lined pages.",
    price: "$32.00",
    image: "/images/shop-journal.jpg",
    badge: "New",
  },
  {
    id: 4,
    name: "Travel Sticker Pack",
    description: "Deck out your luggage, laptop, or water bottle. Pack of 12 travel-themed die-cut stickers.",
    price: "$12.00",
    image: "/images/shop-stickers.jpg",
    badge: null,
  },
]

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-brand-peach py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange">
            <ShoppingBag className="h-3.5 w-3.5" />
            Official Merch
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-brand-orange md:text-5xl lg:text-6xl text-balance">
            The SHE Shop
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
            Carry the spirit of solo adventure with you everywhere. Every purchase supports the
            Solo SHE Things community.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-foreground">{product.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">(4.9)</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-serif text-xl font-bold text-brand-orange">{product.price}</p>
                    <button className="rounded-full bg-brand-blue px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-blue/90">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Note */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl rounded-2xl border border-brand-orange/20 bg-white p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-10 w-10 text-brand-orange" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">
              Full Shop Opening Soon
            </h2>
            <p className="mt-3 text-muted-foreground">
              We are putting the finishing touches on the SHE Shop. Sign up for the newsletter
              to be the first to know when we launch, plus get an exclusive early-bird discount.
            </p>
            <Link
              href="/#newsletter"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg"
            >
              Get Notified
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
