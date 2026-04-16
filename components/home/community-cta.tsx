import Image from "next/image"
import Link from "next/link"

const communityImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
    alt: "Women travelers connecting",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&h=300&fit=crop",
    alt: "Solo travel adventure",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=300&fit=crop",
    alt: "Travel community moments",
  },
]

export function CommunityCTA() {
  return (
    <section className="bg-[#e34b16] py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-[#fab642] md:text-4xl">
              A Community Built for Solo SHEs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              Connect with women who understand the joys and challenges of solo travel. Share your experiences, find travel buddies, and get inspired by stories from around the world.
            </p>
          </div>

          {/* Community Image Cards */}
          <div className="mb-10 grid grid-cols-3 gap-4">
            {communityImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square overflow-hidden rounded-xl bg-[#d9d9d9]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#e34b16]"
            >
              Discover Solo Stories
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#e34b16]"
            >
              Create Your Free Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
