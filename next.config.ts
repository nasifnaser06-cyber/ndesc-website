import type { NextConfig } from "next";

// On GitHub Pages the site lives under /<repo-name>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH; locally it is empty so the site runs at /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // static HTML in ./out, readable by search engines and link previews
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
};

export default nextConfig;
