"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type Locale, tr, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { Logo } from "./bits";

const navItems = [
  { key: "about", to: "/about" },
  { key: "executives", to: "/executives" },
  { key: "ness", to: "/ness" },
  { key: "events", to: "/events" },
  { key: "resources", to: "/resources" },
  { key: "news", to: "/news" },
  { key: "gallery", to: "/gallery" },
] as const;

/** Strip the base path and language from the current URL, e.g. /ndesc-website/bn/events/ -> /events */
function useSubPath(lang: Locale) {
  const pathname = usePathname() || "/";
  const withoutLang = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "");
  return withoutLang.replace(/\/+$/, "") || "/";
}

export default function Header({ lang }: { lang: Locale }) {
  const sub = useSubPath(lang);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the phone menu on navigation and with Escape.
  useEffect(() => setOpen(false), [sub]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: string) => sub === to || sub.startsWith(`${to}/`);

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href={path(lang)} className="brand">
          <Logo />
          <span className="brand-name">
            {lang === "en" ? (
              <>
                Notre Dame
                <br />
                Eco and Space Club
              </>
            ) : (
              <>
                নটর ডেম
                <br />
                ইকো অ্যান্ড স্পেস ক্লাব
              </>
            )}
          </span>
        </Link>

        <nav aria-label={tr(ui.mainNav, lang)} className="main-nav" id="main-nav" data-open={open}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={path(lang, item.to)} aria-current={isActive(item.to) ? "page" : undefined}>
                  {tr(ui.nav[item.key], lang)}
                </Link>
              </li>
            ))}
            <li className="only-menu">
              <Link href={path(lang, "/contact")} aria-current={isActive("/contact") ? "page" : undefined}>
                {tr(ui.nav.contact, lang)}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-tools">
          {site.forms.nessRegister ? (
            <a className="btn btn-small join-btn" href={site.forms.nessRegister} target="_blank" rel="noopener noreferrer">
              {lang === "en" ? "Register" : "নিবন্ধন"}
              <span className="visually-hidden"> {lang === "en" ? "for NESSX" : "NESSX-এ"} {tr(ui.newTab, lang)}</span>
            </a>
          ) : (
            <Link className="btn btn-small join-btn" href={`${path(lang, "/ness")}#register`}>
              {lang === "en" ? "Register" : "নিবন্ধন"}
            </Link>
          )}
          <button
            ref={menuButton}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={tr(open ? ui.menuClose : ui.menuOpen, lang)}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {site.draft && (
        <p className="draft-ribbon">
          <span className="wrap">{tr(ui.draft, lang)}</span>
        </p>
      )}
    </header>
  );
}
