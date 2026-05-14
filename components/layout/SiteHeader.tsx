/**
 * Site Header Component
 *
 * Server Component that handles auth check and renders navigation
 * Editorial navigation labels for the Solo SHE Things brand
 */

import { NavClient } from "@/components/nav/NavClient";
import { getUser } from "@/lib/supabase/server";

const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Travel + SHE Things" },
  { href: "/collections", label: "Solo SHEntries" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

const authNavLinks = [
  { href: "/dashboard", label: "My dashboard" },
  { href: "/subscribe", label: "Billing" },
  { href: "/places", label: "Browse stories" },
  { href: "/saved", label: "Saved stories" },
  { href: "/profile", label: "My profile" },
  { href: "/submit", label: "Submit story" },
];

export async function SiteHeader() {
  const user = await getUser();
  const isAuthenticated = !!user;

  return (
    <NavClient
      publicLinks={publicNavLinks}
      authLinks={authNavLinks}
      isAuthenticated={isAuthenticated}
      accountHint={user?.email ?? undefined}
      showStickyNav={true}
    />
  );
}
