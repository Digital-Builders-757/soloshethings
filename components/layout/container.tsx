/**
 * Container Component
 * 
 * Wrapper for consistent max-width and padding
 * Mobile-first responsive design
 */

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

/**
 * Legacy helper retained for import compatibility.
 * Prefer `container mx-auto shell-inline` directly on new surfaces.
 */

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto shell-inline",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

