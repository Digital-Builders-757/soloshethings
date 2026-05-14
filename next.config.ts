import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Pin workspace root so Next doesn't pick a parent directory when multiple lockfiles exist (see Next.js lockfile warning).
const projectRoot = __dirname;
const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      ...(supabaseImageHost
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseImageHost,
              pathname: '/storage/v1/object/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // WordPress domains must be added manually per environment
      // Add patterns like: { protocol: 'https', hostname: 'your-wordpress-site.com', pathname: '/**' }
      // Or use unoptimized: true in Image components for dynamic WordPress domains
    ],
    // Allow unoptimized images for WordPress (dynamic domains)
    // This is safe since WordPress images are already optimized
    unoptimized: false,
  },
};

const sentryOrg = process.env.SENTRY_ORG?.trim();
const sentryProject = process.env.SENTRY_PROJECT?.trim();

/** When org + project are set, wrap for tunnel + optional source maps (authToken may be unset locally). */
const exportConfig =
  sentryOrg && sentryProject
    ? withSentryConfig(
        nextConfig,
        {
          org: sentryOrg,
          project: sentryProject,
          authToken: process.env.SENTRY_AUTH_TOKEN?.trim(),
          silent: !process.env.CI,
          widenClientFileUpload: true,
          tunnelRoute: "/monitoring",
          webpack: {
            automaticVercelMonitors: true,
            treeshake: {
              removeDebugLogging: true,
            },
          },
        },
      )
    : nextConfig;

export default exportConfig;
