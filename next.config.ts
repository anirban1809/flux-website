import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the build produces an `out/` directory we can zip
  // and ship to Amplify Hosting via the manual-deployment API.
  output: "export",

  // next/image's default loader needs a server. We don't use <Image> right
  // now, but flipping this avoids future surprises when someone adds one.
  images: { unoptimized: true },

  // Amplify serves the static site behind CloudFront — trailing slash makes
  // URLs canonical (`/about/` instead of `/about`) and matches Amplify's
  // default rewrite behavior.
  trailingSlash: true,
};

export default nextConfig;
