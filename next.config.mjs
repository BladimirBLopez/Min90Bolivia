/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/partido/[slug]/opengraph-image": ["./data/liga2026/**/*"],
    "/partido/**": ["./data/liga2026/**/*"],
    "/equipo/[slug]/opengraph-image": ["./data/liga2026/**/*"],
    "/equipo/**": ["./data/liga2026/**/*"],
  },
};

export default nextConfig;
