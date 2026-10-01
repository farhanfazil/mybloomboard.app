/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Next.js to optimize images (WebP / AVIF auto-conversion)
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints for srcset generation
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    // Cache optimised images for 1 month
    minimumCacheTTL: 2592000,
  },
  // Enable gzip/brotli compression
  compress: true,
  // Remove X-Powered-By header (minor security + perf)
  poweredByHeader: false,
  async redirects() {
    return [
      // The old "Team plan coming soon" waitlist: Team is now on the pricing section.
      { source: "/team", destination: "/#pricing", permanent: true },
      // The Freelance product is hidden for now.
      { source: "/freelance", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
