export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];

/**
 * Languages the site is published in. Bangla was taken off on 18 Nov 2026 (Mahmud's call);
 * the Bangla text is kept in content/. Since 20 Nov 2026 the English pages live at the root
 * (app/(site)/, no /en/ prefix); bringing Bangla back would mean adding a /bn/ copy of those
 * routes, adding "bn" here and putting the language switch back in components/Header.tsx.
 */
export const publishedLocales: readonly Locale[] = ["en"];

/** A piece of text in both site languages. */
export type L = { en: string; bn: string };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function tr(text: L, lang: Locale): string {
  return text[lang];
}

/** The default language has no prefix in addresses (ndesc.com/events/). Since 20 Nov 2026. */
export const defaultLocale: Locale = "en";

/** Path inside the site for a language, e.g. path("en", "/events") -> "/events/", path("bn", "/events") -> "/bn/events/". */
export function path(lang: Locale, to = "/"): string {
  const clean = to === "/" ? "" : to.replace(/\/+$/, "");
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  return `${prefix}${clean}/`;
}

const dateLocale: Record<Locale, string> = { en: "en-GB", bn: "bn-BD" };

/** "28 Jan 2027" or "28–30 Jan 2027" or "30 Sep – 2 Oct 2026". */
export function formatDateRange(start: string, end: string | undefined, lang: Locale, month: "short" | "long" = "short"): string {
  const loc = dateLocale[lang];
  const s = new Date(`${start}T00:00:00Z`);
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(loc, { timeZone: "UTC", ...opts }).format(d);
  if (!end || end === start) return fmt(s, { day: "numeric", month, year: "numeric" });
  const e = new Date(`${end}T00:00:00Z`);
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
  if (sameMonth) {
    return `${fmt(s, { day: "numeric" })}–${fmt(e, { day: "numeric", month, year: "numeric" })}`;
  }
  if (sameYear) {
    return `${fmt(s, { day: "numeric", month })} – ${fmt(e, { day: "numeric", month, year: "numeric" })}`;
  }
  return `${fmt(s, { day: "numeric", month, year: "numeric" })} – ${fmt(e, { day: "numeric", month, year: "numeric" })}`;
}

/** Digits in the reader's script (Bangla numerals on Bangla pages). */
export function num(value: number | string, lang: Locale): string {
  if (lang === "en") return String(value);
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  return String(value).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}
