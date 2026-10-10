import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Type-check every `<Link href>` and router call against real routes.
  typedRoutes: true,

  // Emits .next/standalone so the Docker image can ship without node_modules.
  output: "standalone",

  images: {
    remotePatterns: [
      // 42 intra avatars.
      { protocol: "https", hostname: "cdn.intra.42.fr" },
    ],
  },
};

export default nextConfig;
