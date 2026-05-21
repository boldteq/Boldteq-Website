import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === "development",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 991, 1200, 1280, 1440, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
  async redirects() {
    // Route reconciliation with live boldteq.com canonical URLs:
    //   /our-works/:slug  → /our-work/:slug  (singular detail)
    //   /blog/:slug       → /blog-posts/:slug (excluding /blog and /blog/categories/* which stay)
    // Next.js :slug matches a single segment only, so /blog/:slug will NOT match /blog/categories/foo.
    return [
      {
        source: "/our-works/:slug",
        destination: "/our-work/:slug",
        permanent: true,
      },
      {
        // Single-segment `[^/]+` so /blog/categories/<slug> (3-segment) is excluded.
        // Negative lookahead `(?!categories$)` so the literal slug "categories"
        // (would be /blog/categories alone) is also excluded.
        // Result: only /blog/<post-slug> redirects; /blog, /blog/categories,
        // and /blog/categories/<slug> all remain untouched.
        source: "/blog/:slug((?!categories$)[^/]+)",
        destination: "/blog-posts/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    // In dev, skip long-cache headers on _next/static — Turbopack HMR depends on
    // browser revalidating chunks. Immutable cache breaks chunk reloading and
    // surfaces as "module factory not available" errors after file edits.
    const cacheRules = isDev
      ? []
      : [
          {
            source: "/_next/static/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            source: "/images/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=86400, stale-while-revalidate=604800",
              },
            ],
          },
          {
            source: "/fonts/(.*)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
        ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      ...cacheRules,
    ];
  },
};

export default nextConfig;
