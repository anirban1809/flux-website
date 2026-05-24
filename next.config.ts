import type { NextConfig } from "next";

const INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/anirban1809/zipcode/main/install.sh";

const nextConfig: NextConfig = {
  // Canonical URLs with trailing slashes — matches Amplify's default
  // rewrite behavior so deep links don't 308-redirect on first load.
  trailingSlash: true,

  async redirects() {
    return [
      {
        // /install is the public install endpoint advertised in the hero.
        // Next.js's trailingSlash:true means it normalizes /install ->
        // /install/ before matching redirect rules, so we declare the
        // source with the trailing slash. `curl -fsSL` follows the chain
        // transparently either way.
        source: "/install/",
        destination: INSTALL_SCRIPT_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
