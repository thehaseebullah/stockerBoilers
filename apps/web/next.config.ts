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
  experimental: {
    // any experimental flags if needed
  },
};

export default nextConfig;
