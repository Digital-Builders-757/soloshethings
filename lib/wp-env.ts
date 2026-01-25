/**
 * WordPress Environment Resolvers
 *
 * Canonical, server-only env resolution with dual-name support.
 * Prefer WORDPRESS_* and fall back to legacy names.
 */

import "server-only";

function cleanEnv(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeUrlForCompare(url: string): string {
  return url.replace(/\/+$/, "");
}

function warnIfConflict(
  preferredKey: string,
  fallbackKey: string,
  preferredRaw: string | undefined,
  fallbackRaw: string | undefined
) {
  const preferred = cleanEnv(preferredRaw);
  const fallback = cleanEnv(fallbackRaw);

  if (preferred && fallback) {
    const isUrlKey =
      preferredKey.endsWith("URL") || fallbackKey.endsWith("URL");
    const normalizedPreferred = isUrlKey
      ? normalizeUrlForCompare(preferred)
      : preferred;
    const normalizedFallback = isUrlKey
      ? normalizeUrlForCompare(fallback)
      : fallback;

    if (normalizedPreferred !== normalizedFallback) {
      console.warn(
        `[wp-env] Both ${preferredKey} and ${fallbackKey} are set but differ; using ${preferredKey}.`
      );
    }
  }
}

const preferredUrl = cleanEnv(process.env.WORDPRESS_URL);
const fallbackUrl = cleanEnv(process.env.WP_URL);
warnIfConflict("WORDPRESS_URL", "WP_URL", process.env.WORDPRESS_URL, process.env.WP_URL);

const resolvedWordpressBaseUrl = (() => {
  const candidate = preferredUrl ?? fallbackUrl;
  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      console.warn(
        "[wp-env] WordPress URL must be http(s); WordPress integration disabled."
      );
      return null;
    }
    return normalizeUrlForCompare(parsed.origin + parsed.pathname);
  } catch {
    console.warn("[wp-env] WordPress URL is invalid; WordPress integration disabled.");
    return null;
  }
})();

const preferredSecret = cleanEnv(process.env.WORDPRESS_REVALIDATE_SECRET);
const fallbackSecret = cleanEnv(process.env.REVALIDATE_SECRET);
warnIfConflict(
  "WORDPRESS_REVALIDATE_SECRET",
  "REVALIDATE_SECRET",
  process.env.WORDPRESS_REVALIDATE_SECRET,
  process.env.REVALIDATE_SECRET
);

const resolvedRevalidateSecret = preferredSecret ?? fallbackSecret ?? null;

export function getWordpressBaseUrl(): string | null {
  return resolvedWordpressBaseUrl;
}

export function getRevalidateSecret(): string | null {
  return resolvedRevalidateSecret;
}
