/**
 * Travel Moments Gallery
 * 
 * Showcases authentic client travel images in a vibrant grid layout.
 * Supports brand storytelling and emotional trust building.
 * 
 * MVP-safe: Static images, no database, no auth required.
 */

import Image from 'next/image';
import { CLIENT_TRAVEL_IMAGES } from '@/lib/client-travel-images';

export function TravelMomentsGallery() {
  // Use all 12 curated images for maximum impact
  const images = CLIENT_TRAVEL_IMAGES;

  return (
    <section id="travel-moments" className="py-20 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="eyebrow-text text-center mb-3">Travel Moments</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Around the World
        </h2>
        <p className="narrative-interlude mb-12">
          Real moments from real travels. Authentic experiences that inspire solo female travelers to explore with confidence.
        </p>
        
        {/* Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="surface-card-gradient aspect-square overflow-hidden group cursor-pointer"
            >
              <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)] h-full relative">
                {/* Use regular img tag for HEIC files (Next.js Image doesn't support HEIC) */}
                {image.isHeic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                )}
                {/* Location overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-semibold">{image.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

