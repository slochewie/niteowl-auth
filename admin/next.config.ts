import type { NextConfig } from "next";

const authInternalUrl = process.env.AUTH_INTERNAL_URL ?? "http://auth:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authInternalUrl}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
