'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroImage {
  src: string;
  title: string;
  location: string;
  credit: string;
  year: string;
}

interface WesAndersonHeroProps {
  images?: HeroImage[];
}

const DEFAULT_IMAGES: HeroImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=1000&fit=crop&q=80',
    title: 'LISBON STREETSCAPE',
    location: 'PORTUGAL',
    credit: 'CREDIT: COMMUNITY',
    year: '2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=1000&fit=crop&q=80',
    title: 'KYOTO TEMPLE',
    location: 'JAPAN',
    credit: 'CREDIT: COMMUNITY',
    year: '2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1504829857797-ddff9c9e7f3b?w=800&h=1000&fit=crop&q=80',
    title: 'REYKJAVIK HARBOR',
    location: 'ICELAND',
    credit: 'CREDIT: COMMUNITY',
    year: '2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=1000&fit=crop&q=80',
    title: 'BARCELONA ARCHITECTURE',
    location: 'SPAIN',
    credit: 'CREDIT: COMMUNITY',
    year: '2024',
  },
];

export function WesAndersonHero({ images = DEFAULT_IMAGES }: WesAndersonHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Discover safe spots, share your stories, and connect with a community that understands solo travel.';

  useEffect(() => {
    setIsVisible(true);
    
    // Typewriter effect
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);

    // Carousel rotation
    const carouselInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(typeInterval);
      clearInterval(carouselInterval);
    };
  }, [images.length, fullText]);

  const currentImage = images[currentImageIndex];

  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center bg-gradient-to-br from-brand-blue1 via-brand-orange to-brand-yellow1 text-white hero-wash">
      {/* Content Left */}
      <div className="flex-1 px-4 py-20 md:py-24 lg:pl-16 lg:pr-8">
        <div className={`max-w-2xl mx-auto lg:mx-0 ${isVisible ? 'animate-slide-up' : ''}`}>
          <p className="eyebrow-text text-white/80 mb-4">Welcome</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
            Safe Travels for Solo Female Travelers
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 leading-relaxed min-h-[3rem]">
            {typedText}
            <span className="animate-text-flow">|</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/signup">
              <Button size="lg" className="bg-brand-yellow1 text-black hover:bg-brand-yellow2">
                Start Your Journey — Free Trial
              </Button>
            </Link>
            <Link href="/collections">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Explore Safe Spots
              </Button>
            </Link>
          </div>
          {/* Search Input (non-functional for now) */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search destinations..."
              className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              disabled
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white"
              disabled
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Image Carousel Right */}
      <div className="flex-1 px-4 py-8 lg:pr-16 lg:pl-8">
        <div className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl animate-float-medium bg-gradient-to-br from-brand-blue1/20 to-brand-orange/20">
          <Image
            src={currentImage.src}
            alt={`${currentImage.title}, ${currentImage.location}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            onError={(e) => {
              // Fallback to gradient background if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Overlay with caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-1">{currentImage.title}</h3>
              <p className="text-sm text-white/90 mb-1">{currentImage.location}</p>
              <p className="text-xs text-white/70">{currentImage.credit} • {currentImage.year}</p>
            </div>
          </div>
          {/* Carousel indicators */}
          <div className="absolute top-4 right-4 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

