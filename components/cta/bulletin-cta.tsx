/**
 * Bulletin CTA Component
 * 
 * Call-to-action for Curated Drops (bi-weekly admin posts)
 * AWA-inspired bulletin cadence pattern
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

type BulletinCTAProps = {
  title?: string;
  description?: string;
  ctaText?: string;
  href?: string;
  variant?: "default" | "accent";
  className?: string;
};

export function BulletinCTA({
  title = "Curated Drops",
  description = "Bi-weekly curated safe spots and travel stories from our community.",
  ctaText = "View Latest Drops",
  href = "/blog",
  variant = "default",
  className,
}: BulletinCTAProps) {
  const isAccent = variant === "accent";

  return (
    <section
      className={cn(
        "py-16 px-4 text-center",
        isAccent ? "bg-brand-blue2 text-white" : "bg-neutral-50",
        className
      )}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8">{description}</p>
        <Link
          href={href}
          className={cn(
            "inline-block px-8 py-3 rounded-lg font-semibold transition-colors",
            isAccent
              ? "bg-brand-yellow1 text-black hover:bg-brand-yellow2"
              : "bg-brand-blue1 text-white hover:bg-brand-blue2"
          )}
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}

