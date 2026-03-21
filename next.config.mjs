/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: "/weekly-roundup",
        permanent: true,
      },
      {
        source: "/platforms",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
