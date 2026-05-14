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

import { logServerFailure } from "@/lib/server-log";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/blog";

  const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

  if (!PREVIEW_SECRET) {
    logServerFailure({
      category: "wp_fetch",
      operation: "preview.GET",
      cause: new Error("PREVIEW_SECRET not configured"),
    });
    return new Response("Preview not configured", { status: 503 });
  }

  if (secret !== PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  try {
    const draft = await draftMode();
    draft.enable();
  } catch (error) {
    logServerFailure({
      category: "wp_fetch",
      operation: "preview.GET.enableDraft",
      cause: error,
    });
    return new Response("Preview failed", { status: 500 });
  }

  redirect(slug);
}
