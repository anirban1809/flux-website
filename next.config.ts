import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs with trailing slashes — matches Amplify's default
  // rewrite behavior so deep links don't 308-redirect on first load.
  trailingSlash: true,
};

export default nextConfig;
