import type { NextConfig } from "next";

// The deploy workflow sets NEXT_PUBLIC_BASE_PATH from GitHub Pages. With the
// custom domain (ndesc.com) it is empty, so the site runs at /. Without a custom
// domain it would be /<repo-name>. Locally it is empty too.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // static HTML in ./out, readable by search engines and link previews
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
};

export default nextConfig;
