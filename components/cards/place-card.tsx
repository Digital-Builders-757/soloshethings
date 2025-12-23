/**
 * Place Card Component
 * 
 * AWA-inspired card for safe spots/places
 * Image-first design with title, location, and snippet
 * Mobile-first responsive
 */

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PlaceCardProps = {
  title: string;
  location?: string;
  snippet: string;
  imageUrl?: string;
  imageAlt?: string;
  href: string;
  variant?: "default" | "preview" | "featured";
  className?: string;
};

export function PlaceCard({
  title,
  location,
  snippet,
  imageUrl,
  imageAlt,
  href,
  variant = "default",
  className,
}: PlaceCardProps) {
  const isPreview = variant === "preview";
  const isFeatured = variant === "featured";

  return (
    <Link
      href={href}
      className={cn(
        "group block bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-video bg-neutral-200 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            Image Placeholder
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-4 left-4 bg-brand-yellow1 text-black px-3 py-1 rounded text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-blue1 transition-colors">
          {title}
        </h3>
        {location && (
          <p className="text-sm text-neutral-500 mb-3">{location}</p>
        )}
        <p
          className={cn(
            "text-neutral-600 mb-4",
            isPreview && "line-clamp-3"
          )}
        >
          {snippet}
        </p>
        {isPreview && (
          <div className="bg-brand-yellow1 text-black px-4 py-2 rounded text-sm font-medium inline-block">
            Join to View Full Story
          </div>
        )}
        {!isPreview && (
          <span className="text-brand-blue1 group-hover:text-brand-blue2 font-medium">
            Read Full Story →
          </span>
        )}
      </div>
    </Link>
  );
}

