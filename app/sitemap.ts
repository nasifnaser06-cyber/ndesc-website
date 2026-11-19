import type { MetadataRoute } from "next";
import { publishedLocales } from "@/lib/i18n";
import { events } from "@/content/events";
import { posts } from "@/content/news";
import { site } from "@/content/site";

// Built once into /sitemap.xml so Google can find every page.
export const dynamic = "force-static";

const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://ndesc.com").replace(/\/+$/, "");
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function sitemap(): MetadataRoute.Sitemap {
  // The register page stays out while it is a draft or a trial (it is noindex then too).
  const registerLive = Boolean(site.registration.endpoint) && !site.registration.trial;
  const pages = [
    "", "about", "executives", "ness", "ness/photosphere", "events", "resources", "news", "gallery", "join", "contact", "privacy",
    ...(registerLive ? ["ness/register"] : []),
    ...events.map((e) => `events/${e.slug}`),
    ...posts.map((p) => `news/${p.slug}`),
  ];
  return publishedLocales.flatMap((lang) =>
    pages.map((p) => ({
      url: `${origin}${bp}/${lang}/${p ? `${p}/` : ""}`,
      priority: p === "" ? 1 : p === "ness" ? 0.9 : 0.6,
    })),
  );
}
