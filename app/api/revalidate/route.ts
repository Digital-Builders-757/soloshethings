/**
 * Revalidation API Route
 * 
 * Webhook endpoint for WordPress to trigger ISR revalidation
 * Requires REVALIDATE_SECRET
 * 
 * SECURITY: This route is security-sensitive (accepts secrets, triggers server work).
 * All inputs are validated and sanitized.
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 * 
 * TODO: Add rate limiting (Upstash Redis or Vercel Edge Config) for production hardening
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Validation constants
const MAX_BODY_SIZE = 10 * 1024; // 10KB in bytes
const MAX_ITEMS = 25; // Max items per array
const MAX_STRING_LENGTH = 200; // Max length per path/tag string

export async function POST(request: NextRequest) {
  try {
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

    if (!REVALIDATE_SECRET) {
      throw new Error("REVALIDATE_SECRET environment variable is not set");
    }

    // 1. Enforce body size limit (byte-accurate, not character count)
    const contentLength = request.headers.get('content-length');
    
    if (contentLength) {
      // Safe number parsing (guards against NaN, Infinity, or maliciously large values)
      const contentLengthNum = Number(contentLength);
      if (!Number.isFinite(contentLengthNum) || contentLengthNum < 0) {
        return NextResponse.json(
          { error: "Invalid content-length header" },
          { status: 400 }
        );
      }
      
      if (contentLengthNum > MAX_BODY_SIZE) {
        return NextResponse.json(
          { error: `Request body exceeds maximum size of ${MAX_BODY_SIZE} bytes` },
          { status: 413 }
        );
      }
    }

    // Read body as arrayBuffer for byte-accurate size checking
    const arrayBuffer = await request.arrayBuffer();
    
    if (arrayBuffer.byteLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: `Request body exceeds maximum size of ${MAX_BODY_SIZE} bytes` },
        { status: 413 }
      );
    }

    // Decode buffer to text and parse JSON
    const bodyText = new TextDecoder().decode(arrayBuffer);
    let body: { secret?: string; paths?: unknown; tags?: unknown };
    
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { secret, paths, tags } = body;

    // 2. Validate secret from body (canonical contract)
    if (!secret || typeof secret !== "string" || secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // 3. Validate paths array (if provided)
    if (paths !== undefined) {
      if (!Array.isArray(paths)) {
        return NextResponse.json(
          { error: "paths must be an array" },
          { status: 400 }
        );
      }

      if (paths.length > MAX_ITEMS) {
        return NextResponse.json(
          { error: `paths array exceeds maximum of ${MAX_ITEMS} items` },
          { status: 400 }
        );
      }

      // Validate each path: must be string, start with /, reasonable length, no URLs
      for (const path of paths) {
        if (typeof path !== "string") {
          return NextResponse.json(
            { error: "All paths must be strings" },
            { status: 400 }
          );
        }

        if (path.length > MAX_STRING_LENGTH) {
          return NextResponse.json(
            { error: `Path exceeds maximum length of ${MAX_STRING_LENGTH} characters` },
            { status: 400 }
          );
        }

        // Path must start with / and not be a full URL
        if (!path.startsWith("/") || path.includes("://") || path.includes("http")) {
          return NextResponse.json(
            { error: "Paths must be relative paths starting with /" },
            { status: 400 }
          );
        }
      }
    }

    // 4. Validate tags array (if provided)
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: "tags must be an array" },
          { status: 400 }
        );
      }

      if (tags.length > MAX_ITEMS) {
        return NextResponse.json(
          { error: `tags array exceeds maximum of ${MAX_ITEMS} items` },
          { status: 400 }
        );
      }

      // Validate each tag: must be string, reasonable length, valid namespace
      const VALID_TAG_PREFIXES = ["posts", "post:", "posts:page:"];
      
      for (const tag of tags) {
        if (typeof tag !== "string") {
          return NextResponse.json(
            { error: "All tags must be strings" },
            { status: 400 }
          );
        }

        if (tag.length > MAX_STRING_LENGTH) {
          return NextResponse.json(
            { error: `Tag exceeds maximum length of ${MAX_STRING_LENGTH} characters` },
            { status: 400 }
          );
        }

        // Tag must match expected namespace (posts, post:*, posts:page:*)
        const isValidTag = VALID_TAG_PREFIXES.some(prefix => tag === prefix || tag.startsWith(prefix));
        if (!isValidTag) {
          return NextResponse.json(
            { error: `Tag must match expected namespace: posts, post:*, or posts:page:*` },
            { status: 400 }
          );
        }
      }
    }

    // 5. Revalidate paths (all validation passed)
    if (paths && Array.isArray(paths) && paths.length > 0) {
      for (const path of paths) {
        if (typeof path === "string") {
          revalidatePath(path);
        }
      }
    }

    // 6. Revalidate tags (all validation passed)
    if (tags && Array.isArray(tags) && tags.length > 0) {
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

