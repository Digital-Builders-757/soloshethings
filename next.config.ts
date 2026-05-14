import type { NextConfig } from "next";

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

export default nextConfig;

