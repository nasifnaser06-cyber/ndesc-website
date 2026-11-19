import type { MetadataRoute } from "next";

// Built once into /robots.txt: every page may be indexed, and Google is pointed at the sitemap.
export const dynamic = "force-static";

const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://ndesc.com").replace(/\/+$/, "");
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}${bp}/sitemap.xml`,
  };
}
