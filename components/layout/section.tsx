/**
 * Section Component
 * 
 * Consistent section spacing and layout
 * Mobile-first responsive design
 */

import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "dark";
  padding?: "sm" | "md" | "lg" | "xl";
};

const variantClasses = {
  default: "page-warm",
  accent: "bg-[#f7e8be]/35",
  dark: "bg-[#7a331b] text-white",
};

const paddingClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "section-y",
  xl: "py-24",
};

/**
 * Legacy helper retained for import compatibility.
 * Prefer explicit section wrappers plus shared editorial utility classes on new surfaces.
 */
export function Section({
  children,
  className,
  variant = "default",
  padding = "lg",
}: SectionProps) {
  return (
    <section
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </section>
  );
}

