/**
 * Preview Mode API Route
 * 
 * Enables draft mode for WordPress preview
 * Requires PREVIEW_SECRET
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/blog";

  const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

  if (!PREVIEW_SECRET) {
    throw new Error("PREVIEW_SECRET environment variable is not set");
  }

  if (secret !== PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}

