/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for SEO
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Headers for SEO and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
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
        ],
      },
      // Cache static assets
      {
        source: "/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for SEO (preserves link equity)
  async redirects() {
    return [
      {
        source: "/methodology",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/reviews",
        destination: "/review-archive",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/platforms",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Rewrites for cleaner URLs
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap.xml",
        },
        {
          source: "/robots.txt",
          destination: "/api/robots.txt",
        },
      ],
    };
  },
};

export default nextConfig;
