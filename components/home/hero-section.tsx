import Image from "next/image"

const travelPhotos = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-g2IBzw09zCFOGiKt8ShCAbMSNsz4Tg.jpg",
    caption: "Portugal",
    alt: "Solo traveler at Belem Tower in Lisbon, Portugal",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-taLG2cRHyeL18VA45GEW7SQpyhkXWK.jpeg",
    caption: "Berlin",
    alt: "Solo traveler at the Reichstag in Berlin, Germany",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-uzAkqKWkvs1gu891cJtUAfuyzv0gEY.jpeg",
    caption: "Zambezi River",
    alt: "Solo traveler watching elephants from a boat on the Zambezi River",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-H3mXHzlCU8OB0pYt4XvDA7D2vydiTO.jpg",
    caption: "Pamplona, Spain",
    alt: "Solo traveler posing with a bronze sculpture in Pamplona, Spain",
  },
]

export function HeroSection() {
  return (
    <>
      {/* Brand Header - AWA style */}
      <section className="bg-white py-10 md:py-14">
        <div className="flex flex-col items-center justify-center px-4">
          <h1 className="text-center text-2xl font-semibold tracking-widest text-[#FB5315] md:text-3xl lg:text-4xl">
            {'Solo SHE Things Est. 2025'}
          </h1>
        </div>
        {/* Brand color bar */}
        <div className="mx-auto mt-6 h-1 w-full max-w-xs bg-[#FB5315] md:max-w-md" />
      </section>

      {/* Travel Photo Gallery - SHE Entry */}
      <section className="bg-[#FFD0A9] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#FB5315] md:mb-12 md:text-3xl lg:text-4xl">
            {'Solo SHE Things'}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {travelPhotos.map((photo) => (
              <div key={photo.caption} className="flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-center text-base font-semibold tracking-wide text-[#FB5315] md:text-lg">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
