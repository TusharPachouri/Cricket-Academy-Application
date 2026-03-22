/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for React Three Fiber + Three.js to bundle correctly
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Optimize framer-motion bundle size
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Cache 3D model and static assets aggressively
      {
        source: "/(:path*\\.glb)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
