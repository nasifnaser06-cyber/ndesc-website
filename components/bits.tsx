import Link from "next/link";
import type { ReactNode } from "react";
import { type L, type Locale, tr, path } from "@/lib/i18n";
import { ui } from "@/content/ui";

/** Renders text and marks any [square bracket] part as a placeholder for the club to fill in. */
export function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="todo">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

export function T({ text, lang }: { text: L; lang: Locale }) {
  return <Txt>{tr(text, lang)}</Txt>;
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-mark">
      <ellipse cx="20" cy="20" rx="18" ry="8" fill="none" stroke="#A9B7CC" strokeWidth="1.5" transform="rotate(-20 20 20)" />
      <circle cx="20" cy="20" r="7" fill="#1F3B63" stroke="#E9EEF6" strokeWidth="1.5" />
      <path d="M20 25 C20 21 17 18 14 18 C14 21 17 24 20 25 Z M20 25 C20 20 23 17 27 17 C27 21 24 24 20 25 Z" fill="#8FD3A6" />
      <circle cx="35" cy="12" r="1.8" fill="#E9EEF6" />
    </svg>
  );
}

/** A few fixed stars for sky sections. Decorative only. */
export function Stars() {
  return <span className="stars" aria-hidden="true" />;
}

export function PhotoSlot({ label, lang, className = "", tall = false }: { label: L; lang: Locale; className?: string; tall?: boolean }) {
  return (
    <div className={`photo-slot ${tall ? "tall" : ""} ${className}`} role="img" aria-label={`${tr(ui.photoSoon, lang)}: ${tr(label, lang)}`}>
      <span>
        {tr(ui.photoSoon, lang)}
        <br />
        <small>{tr(label, lang)}</small>
      </span>
    </div>
  );
}

/** A button that goes to one of the club's forms, or says the link is coming when it is not set yet. */
export function FormButton({ href, children, lang, secondary = false }: { href: string | null; children: ReactNode; lang: Locale; secondary?: boolean }) {
  if (!href) {
    return (
      <span className={`btn ${secondary ? "btn-secondary" : ""} is-disabled`} aria-disabled="true">
        {children}
        <small className="btn-note">{tr(ui.formSoon, lang)}</small>
      </span>
    );
  }
  return (
    <a className={`btn ${secondary ? "btn-secondary" : ""}`} href={href} rel="noopener">
      {children}
    </a>
  );
}

export function PageHead({ kicker, title, lead, lang, crumbs }: { kicker?: L; title: L; lead?: L; lang: Locale; crumbs?: { label: L; to: string }[] }) {
  return (
    <header className="page-head wrap">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label={tr(ui.breadcrumb, lang)} className="crumbs">
          <ol>
            {crumbs.map((c) => (
              <li key={c.to}>
                <Link href={path(lang, c.to)}>{tr(c.label, lang)}</Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {kicker && <p className="label">{tr(kicker, lang)}</p>}
      <h1>
        <T text={title} lang={lang} />
      </h1>
      {lead && (
        <p className="lead">
          <T text={lead} lang={lang} />
        </p>
      )}
    </header>
  );
}

export function SectionHead({ title, link, lang }: { title: L; link?: { label: L; to: string }; lang: Locale }) {
  return (
    <div className="section-head">
      <h2>{tr(title, lang)}</h2>
      {link && <Link href={path(lang, link.to)}>{tr(link.label, lang)}</Link>}
    </div>
  );
}
