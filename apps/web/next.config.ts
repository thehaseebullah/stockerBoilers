import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@stoker/ui",
    "@stoker/contracts",
    "@stoker/domain",
    "@stoker/db",
    "@stoker/field-sync",
    "@stoker/simulator",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
