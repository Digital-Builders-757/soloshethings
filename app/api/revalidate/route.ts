/**
 * Revalidation API Route
 * 
 * Webhook endpoint for WordPress to trigger ISR revalidation
 * Requires REVALIDATE_SECRET
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

    if (!REVALIDATE_SECRET) {
      throw new Error("REVALIDATE_SECRET environment variable is not set");
    }

    // Parse request body
    // Phase 1.2: Add body size limit (max 10KB) to prevent DoS
    const body = await request.json();
    const { secret, paths, tags } = body;

    // Validate secret from body (canonical contract)
    if (!secret || secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Validate input (arrays of strings, max 25 items to prevent abuse)
    const MAX_ITEMS = 25;

    if (paths && !Array.isArray(paths)) {
      return NextResponse.json(
        { error: "paths must be an array" },
        { status: 400 }
      );
    }

    if (paths && paths.length > MAX_ITEMS) {
      return NextResponse.json(
        { error: `paths array exceeds maximum of ${MAX_ITEMS} items` },
        { status: 400 }
      );
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "tags must be an array" },
        { status: 400 }
      );
    }

    if (tags && tags.length > MAX_ITEMS) {
      return NextResponse.json(
        { error: `tags array exceeds maximum of ${MAX_ITEMS} items` },
        { status: 400 }
      );
    }

    // Revalidate paths
    if (paths && paths.length > 0) {
      for (const path of paths) {
        if (typeof path === "string") {
          revalidatePath(path);
        }
      }
    }

    // Revalidate tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        if (typeof tag === "string") {
          revalidateTag(tag);
        }
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: paths || [],
      tags: tags || [],
      now: Date.now(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

