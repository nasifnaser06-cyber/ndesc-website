import type { MetadataRoute } from "next";
import { path, publishedLocales } from "@/lib/i18n";
import { sitePages } from "@/lib/pages";
import { site } from "@/content/site";

// Built once into /sitemap.xml so Google can find every page.
export const dynamic = "force-static";

const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://ndesc.com").replace(/\/+$/, "");
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function sitemap(): MetadataRoute.Sitemap {
  // The register page stays out while it is a draft or a trial (it is noindex then too).
  const registerLive = Boolean(site.registration.endpoint) && !site.registration.trial;
  // "panel" only forwards to Executives, so it stays out too.
  const pages = sitePages().filter((p) => p !== "panel" && p !== "events/ness-x" && (registerLive || p !== "ness/register"));
  return publishedLocales.flatMap((lang) =>
    pages.map((p) => ({
      url: `${origin}${bp}${path(lang, p ? `/${p}` : "/")}`,
      priority: p === "" ? 1 : p === "ness" ? 0.9 : 0.6,
    })),
  );
}
