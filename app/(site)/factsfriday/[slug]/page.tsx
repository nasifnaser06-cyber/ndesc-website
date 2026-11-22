import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { factsFriday, getFact, sortedFacts, factsCategories } from "@/content/factsFriday";
import { ExternalLink, PageHead } from "@/components/bits";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return factsFriday.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const f = getFact(slug);
  if (!f) return {};
  const big = f.cover.sizes[f.cover.sizes.length - 1];
  return meta(lang, `/factsfriday/${slug}`, { en: `${f.title} · FactsFriday`, bn: `${f.title} · FactsFriday` }, { en: f.summary, bn: f.summary }, {
    src: `${f.cover.base}-${big}.webp`,
    alt: { en: `FactsFriday: ${f.title}`, bn: `FactsFriday: ${f.title}` },
    width: big,
    height: big,
  });
}

export default async function FactPage({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const f = getFact(slug);
  if (!f) notFound();
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const small = f.cover.sizes[0];
  const large = f.cover.sizes[f.cover.sizes.length - 1];
  // Newer and older posts, for moving through the series.
  const all = sortedFacts();
  const i = all.findIndex((x) => x.slug === f.slug);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i < all.length - 1 ? all[i + 1] : undefined;

  return (
    <>
      <PageHead
        lang={lang}
        kicker={{ en: `${factsCategories[f.category]} · ${formatDateRange(f.date, undefined, lang, "long")}`, bn: factsCategories[f.category] }}
        title={{ en: f.title, bn: f.title }}
        crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.factsFriday, to: "/factsfriday" }]}
      />
      <div className="wrap">
        <article className="ff-article">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${bp}${f.cover.base}-${small}.webp`}
              srcSet={large > small ? `${bp}${f.cover.base}-${small}.webp ${small}w, ${bp}${f.cover.base}-${large}.webp ${large}w` : undefined}
              sizes="(min-width: 960px) 352px, 100vw"
              alt={`The FactsFriday post on ${f.title}, as published.`}
              width={large}
              height={large}
              decoding="async"
            />
            <figcaption>The post as published{f.facebook ? " on Facebook" : ""}.</figcaption>
          </figure>
          <div className="ff-body">
            <p className="ff-summary">{f.body[0]}</p>
            {f.body.slice(1).map((p, k) => <p key={k}>{p}</p>)}
            {f.fromImage && <p className="small muted">This post was published as a picture; the text above is copied from it.</p>}
            {f.writtenLater && <p className="small muted">This post was published as a picture without a caption. The text above was written later from the sources listed below.</p>}
            {f.credit && <p className="small muted">Written by {f.credit}</p>}
            {f.references && f.references.length > 0 && (
              <section className="ff-refs" aria-labelledby="refs">
                <h2 id="refs">Sources</h2>
                <ol>
                  {f.references.map((r, k) => (
                    <li key={k}>{r.url ? <ExternalLink href={r.url} lang={lang}>{r.label}</ExternalLink> : r.label}</li>
                  ))}
                </ol>
              </section>
            )}
            <div className="ff-foot">
              {f.facebook && (
                <ExternalLink className="btn btn-secondary btn-small" href={f.facebook} lang={lang}>See the original post</ExternalLink>
              )}
              <Link className="btn btn-secondary btn-small" href={path(lang, "/factsfriday")}>All FactsFriday posts</Link>
            </div>
            {(newer || older) && (
              <nav aria-label="More FactsFriday" className="ff-refs" style={{ display: "flex", justifyContent: "space-between", gap: "var(--s4)", flexWrap: "wrap" }}>
                {older ? <Link href={path(lang, `/factsfriday/${older.slug}`)}>← {older.title}</Link> : <span />}
                {newer ? <Link href={path(lang, `/factsfriday/${newer.slug}`)}>{newer.title} →</Link> : <span />}
              </nav>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
