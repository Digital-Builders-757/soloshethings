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
  default: "bg-white",
  accent: "bg-neutral-50",
  dark: "bg-brand-blue1 text-white",
};

const paddingClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

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

