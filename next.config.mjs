/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // CMS already provides pre-sized variants (thumbnail, card, full).
    // Skip Next.js re-optimization to avoid upstream proxy timeouts on Render free tier.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ecodarshinibackend-1.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ecodarshinibackend2.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
