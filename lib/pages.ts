import { events } from "@/content/events";
import { posts } from "@/content/news";

/** Every page address on the site, without the language prefix ("" is the home page). */
export function sitePages(): string[] {
  return [
    "", "about", "executives", "panel", "ness", "ness/photosphere", "ness/register",
    "events", "resources", "news", "gallery", "join", "contact",
    ...events.map((e) => `events/${e.slug}`),
    ...posts.map((p) => `news/${p.slug}`),
  ];
}
