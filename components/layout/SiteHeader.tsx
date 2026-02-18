/**
 * Site Header Component
 * 
 * Server Component that handles auth check and renders navigation
 * Passes auth state and nav links to client Nav component
 * 
 * Variants:
 * - "public": Public pages (home, blog, collections, map)
 * - "auth": Auth pages (login, signup) - no authenticated nav items
 * - "app": Authenticated app pages (dashboard, profile, submit)
 */

import { getUser } from "@/lib/supabase/server";
import { NavClient } from "@/components/nav/NavClient";

type SiteHeaderProps = {
  variant?: "public" | "auth" | "app";
};

const publicNavLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/blog", label: "Blog" },
  { href: "/map", label: "Map" },
];

const authNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export async function SiteHeader({ variant = "public" }: SiteHeaderProps) {
  // For auth variant, always show public nav (no auth check needed)
  if (variant === "auth") {
    return (
      <NavClient
        publicLinks={publicNavLinks}
        isAuthenticated={false}
        showStickyNav={true}
      />
    );
  }

  // If Supabase env vars are missing, render without auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <NavClient
        publicLinks={publicNavLinks}
        isAuthenticated={false}
        showStickyNav={true}
      />
    );
  }

  // For app variant, require authentication (middleware handles redirect)
  // But we still check to determine nav items
  const user = await getUser();
  const isAuthenticated = !!user;

  // For app variant, if not authenticated, middleware will redirect
  // But we still render public nav as fallback
  if (variant === "app") {
    return (
      <NavClient
        publicLinks={publicNavLinks}
        authLinks={authNavLinks}
        isAuthenticated={isAuthenticated}
        showStickyNav={true}
      />
    );
  }

  // Public variant: show auth nav if authenticated, otherwise public nav
  return (
    <NavClient
      publicLinks={publicNavLinks}
      authLinks={authNavLinks}
      isAuthenticated={isAuthenticated}
      showStickyNav={true}
    />
  );
}
