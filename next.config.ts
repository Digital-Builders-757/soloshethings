import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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

