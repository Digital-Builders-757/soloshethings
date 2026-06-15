/**
 * NavbarServer
 *
 * Thin server component that resolves auth state via getUser() (never stale)
 * and hands it down to the client Navbar as a plain boolean.
 *
 * Mounting rules:
 *   - (public) layout  → yes
 *   - (auth)   layout  → yes
 *   - (app)    layout  → NO (app routes use SiteHeader / workspace nav)
 */

import { getUser } from '@/lib/supabase/server';
import { Navbar } from './Navbar';

export async function NavbarServer() {
  const user = await getUser();
  return <Navbar isAuthenticated={!!user} />;
}
