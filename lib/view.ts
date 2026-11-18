import type { Metadata } from "next";
import { type L, type Locale, tr, path, formatDateRange, locales } from "@/lib/i18n";
import { type ClubEvent, eventTypes, isUpcoming } from "@/content/events";
import type { EventRowData } from "@/components/EventList";
import { ui } from "@/content/ui";
import { site } from "@/content/site";

export function eventRow(e: ClubEvent, lang: Locale): EventRowData {
  return {
    slug: e.slug,
    href: path(lang, `/events/${e.slug}`),
    type: e.type,
    typeLabel: tr(eventTypes[e.type], lang),
    date: formatDateRange(e.start, e.end, lang),
    title: tr(e.title, lang),
    where: tr(e.venue, lang),
    upcoming: isUpcoming(e),
  };
}

export function eventLabels(lang: Locale) {
  return {
    upcoming: tr(ui.upcoming, lang),
    past: tr(ui.past, lang),
    all: tr(ui.all, lang),
    allTypes: lang === "en" ? "All types" : "সব ধরন",
    details: tr(ui.details, lang),
    when: lang === "en" ? "When" : "সময়",
    kind: lang === "en" ? "Type" : "ধরন",
    empty: lang === "en" ? "No events match these filters." : "এই ফিল্টারে কোনো ইভেন্ট নেই।",
  };
}

/** Page title, description, language alternates and share card for one page. */
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const full = (lang: Locale, to: string) => `${bp}${path(lang, to)}`;

export function meta(lang: Locale, to: string, title: L | null, description: L, image?: { src: string; alt: L }): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l === "bn" ? "bn-BD" : "en", full(l, to)]));
  const t = title ? tr(title, lang) : undefined;
  return {
    title: t ? t : { absolute: tr(site.name, lang) },
    description: tr(description, lang),
    alternates: { canonical: full(lang, to), languages },
    openGraph: {
      type: "website",
      siteName: tr(site.name, lang),
      title: t ?? tr(site.name, lang),
      description: tr(description, lang),
      locale: lang === "bn" ? "bn_BD" : "en_GB",
      url: full(lang, to),
      ...(image ? { images: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image.src}`, width: 1200, height: 675, alt: tr(image.alt, lang) }] } : {}),
    },
    ...(image ? { twitter: { card: "summary_large_image" } } : {}),
  };
}
