import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Product photos (up to 5) and custom-order references are uploaded
    // through Server Actions, whose request body is capped at 1MB by default.
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default nextConfig;
