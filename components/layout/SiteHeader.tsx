/**
 * Site Header Component
 * 
 * Server Component that handles auth check and renders navigation
 * Editorial navigation labels for the Solo SHE Things brand
 */

import { getUser } from "@/lib/supabase/server";
import { NavClient } from "@/components/nav/NavClient";

type SiteHeaderProps = {
  variant?: "public" | "auth" | "app";
};

const publicNavLinks = [
  { href: "/collections", label: "Explore" },
  { href: "/blog", label: "Stories" },
  { href: "/map", label: "Safe Spots" },
];

const authNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
];

export async function SiteHeader({ variant = "public" }: SiteHeaderProps) {
  if (variant === "auth") {
    return (
      <NavClient
        publicLinks={publicNavLinks}
        isAuthenticated={false}
        showStickyNav={true}
      />
    );
  }

  const user = await getUser();
  const isAuthenticated = !!user;

  return (
    <NavClient
      publicLinks={publicNavLinks}
      authLinks={authNavLinks}
      isAuthenticated={isAuthenticated}
      showStickyNav={true}
    />
  );
}
