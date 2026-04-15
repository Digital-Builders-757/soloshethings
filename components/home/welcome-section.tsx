import Image from "next/image"
import Link from "next/link"

const storyImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=500&fit=crop",
    alt: "Solo traveler exploring mountains",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=500&fit=crop",
    alt: "Woman traveling through historic city",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=500&fit=crop",
    alt: "Adventure travel moment",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop",
    alt: "Solo exploration journey",
  },
]

export function WelcomeSection() {
  return (
    <section className="bg-[#f7e8be] py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#e34b16] md:text-4xl">
            Real Stories From Solo SHEs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#3a3a3a]/80">
            Discover inspiring journeys from women who traveled solo
          </p>
        </div>

        {/* Story Cards Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {storyImages.map((image) => (
            <Link
              key={image.id}
              href="/collections"
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[#d9d9d9] transition-transform hover:scale-[1.02]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
