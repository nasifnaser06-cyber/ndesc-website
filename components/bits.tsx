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

const bp = () => process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** The club's own logo (public/brand/). Decorative where the club's name is written beside it. */
export function Logo({ size = 44, alt = "" }: { size?: number; alt?: string }) {
  const src = (s: number) => `${bp()}/brand/ndesc-logo-${s}.png`;
  const one = size <= 48 ? 48 : 144;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="logo-mark" src={src(one)} srcSet={`${src(one)} 1x, ${src(one === 48 ? 96 : 288)} 2x`} width={size} height={size} alt={alt} aria-hidden={alt ? undefined : true} />
  );
}

/** Notre Dame College's crest, on a light tile so its black lettering reads on the night background. */
export function CollegeCrest({ alt }: { alt: string }) {
  return (
    <span className="crest-tile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${bp()}/brand/ndc-crest-72.png`} srcSet={`${bp()}/brand/ndc-crest-72.png 1x, ${bp()}/brand/ndc-crest-144.png 2x, ${bp()}/brand/ndc-crest-216.png 3x`} width={69} height={72} alt={alt} loading="lazy" />
    </span>
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
    <a className={`btn ${secondary ? "btn-secondary" : ""}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> {tr(ui.newTab, lang)}</span>
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

/** A link to another site (Facebook, Instagram) that opens in a new tab, and says so to screen readers. */
export function ExternalLink({ href, children, lang, className }: { href: string; children: ReactNode; lang: Locale; className?: string }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> {tr(ui.newTab, lang)}</span>
    </a>
  );
}

/** A person's card on the Executives and About pages. Photos only with consent. */
export function PersonCard({ name, post, department, photo, poster, lang }: { name: L; post: L; department?: L; photo?: string; poster?: string; lang: Locale }) {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const role = department ? `${tr(post, lang)}, ${tr(department, lang)}` : tr(post, lang);
  return (
    <div className="person">
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="person-poster"
          src={`${bp}${poster}-480.webp`}
          srcSet={`${bp}${poster}-480.webp 480w, ${bp}${poster}-960.webp 960w`}
          sizes="(min-width: 1280px) 290px, (min-width: 600px) 30vw, 46vw"
          alt={`${lang === "en" ? "Poster" : "পোস্টার"}: ${tr(name, lang)}, ${role}`}
          loading="lazy"
          decoding="async"
          width={960}
          height={960}
        />
      ) : photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="person-photo" src={`${bp}${photo}`} alt={tr(name, lang)} loading="lazy" width={400} height={500} />
      ) : (
        <PhotoSlot lang={lang} label={{ en: "photo, with consent", bn: "ছবি, সম্মতিসহ" }} />
      )}
      <h3><T text={name} lang={lang} /></h3>
      <p className="small muted">
        <T text={post} lang={lang} />
        {department && (
          <>
            , <T text={department} lang={lang} />
          </>
        )}
      </p>
    </div>
  );
}

/** A responsive banner or poster image (16:9 WebP files at several widths in public/). */
export function Banner({ name, widths, alt, lang, sizes = "(min-width: 1280px) 1216px, 100vw", priority = false, className = "", height = 1080 }: { name: string; widths: number[]; alt: L; lang: Locale; sizes?: string; priority?: boolean; className?: string; height?: number; social?: string }) {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const largest = Math.max(...widths);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`banner ${className}`}
      src={`${bp}${name}-${largest}.webp`}
      srcSet={widths.map((w) => `${bp}${name}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      alt={tr(alt, lang)}
      width={1920}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
