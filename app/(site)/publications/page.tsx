import Link from "next/link";
import { type Locale, path, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { durbin, articles } from "@/content/publications";
import { resources, resourceKinds } from "@/content/club";
import { PageHead } from "@/components/bits";

const title = { en: "Publications", bn: "প্রকাশনা" };
const lead = {
  en: "NDESC's library: the DURBIN magazine, long-form science articles and educational resources.",
  bn: "NDESC-এর লাইব্রেরি: দুরবীন ম্যাগাজিন, বিস্তারিত বিজ্ঞান লেখা আর শিক্ষামূলক উপকরণ।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/publications", title, lead);
}

export default async function Publications() {
  const lang: Locale = "en";
  const en = lang === "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const issues = [...durbin.issues].sort((a, b) => b.year.localeCompare(a.year));
  const fileUrl = (u: string) => (u.startsWith("/") ? `${bp}${u}` : u);

  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <nav aria-label={en ? "Sections" : "অংশ"} className="chips">
          <a className="chip" href="#durbin" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>DURBIN Magazine</a>
          <a className="chip" href="#articles" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{en ? "Scientific articles" : "বিজ্ঞান লেখা"}</a>
          <a className="chip" href="#resources" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{en ? "Educational resources" : "শিক্ষামূলক উপকরণ"}</a>
        </nav>

        <section id="durbin" aria-labelledby="h-durbin">
          <h2 id="h-durbin" style={{ marginBottom: "var(--s3)" }}>DURBIN Magazine</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>{tr(durbin.about, lang)}</p>
          {issues.length === 0 ? (
            <p className="empty">{en ? "Issues of DURBIN will be added here to read and download." : "দুরবীনের সংখ্যাগুলো পড়া ও ডাউনলোডের জন্য এখানে যোগ হবে।"}</p>
          ) : (
            <ul className="ff-grid">
              {issues.map((d) => (
                <li key={d.title}>
                  <div className="ff-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {d.cover && <img src={fileUrl(d.cover)} alt={`Cover of ${d.title}`} width={400} height={400} loading="lazy" style={{ aspectRatio: "3 / 4" }} />}
                    <span className="ff-meta">{d.year}{d.editors ? ` · ${d.editors}` : ""}</span>
                    <h3>{d.title}</h3>
                    {d.description && <p>{tr(d.description, lang)}</p>}
                    {d.pdf && <a className="btn btn-secondary btn-small" href={fileUrl(d.pdf)} download>{en ? "Download PDF" : "পিডিএফ ডাউনলোড"}{d.fileInfo ? ` (${d.fileInfo})` : ""}</a>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="articles" aria-labelledby="h-articles">
          <h2 id="h-articles" style={{ marginBottom: "var(--s3)" }}>{en ? "Scientific articles" : "বিজ্ঞান লেখা"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>
            {en ? "Long-form science writing and research explanations by NDESC members. For short weekly science facts, see " : "NDESC সদস্যদের বিস্তারিত বিজ্ঞান লেখা ও গবেষণার ব্যাখ্যা। ছোট সাপ্তাহিক বিজ্ঞান তথ্যের জন্য দেখুন "}
            <Link href={path(lang, "/factsfriday")}>FactsFriday</Link>.
          </p>
          {articles.length === 0 ? (
            <p className="empty">{en ? "Articles will be added here as they are published." : "লেখা প্রকাশিত হলে এখানে যোগ হবে।"}</p>
          ) : (
            <ul className="event-list">
              {articles.map((a) => (
                <li className="event-row" key={a.url}>
                  <p className="event-date">{a.date}</p>
                  <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={fileUrl(a.url)}>{a.title}</a></h3><p className="small muted">{tr(a.summary, lang)}{a.author ? ` · ${a.author}` : ""}</p></div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="resources" aria-labelledby="h-resources">
          <h2 id="h-resources" style={{ marginBottom: "var(--s3)" }}>{en ? "Educational resources" : "শিক্ষামূলক উপকরণ"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)" }}>
            {en ? "Olympiad papers, workshop handouts and sky guides. The same list lives on the " : "অলিম্পিয়াডের প্রশ্ন, কর্মশালার হ্যান্ডআউট আর আকাশ পরিচিতি। একই তালিকা আছে "}
            <Link href={path(lang, "/resources")}>{en ? "Resources page" : "রিসোর্স পাতায়"}</Link>.
          </p>
          {resources.length === 0 ? (
            <p className="empty">{en ? "Resources will be added here to download." : "ডাউনলোডের জন্য উপকরণ এখানে যোগ হবে।"}</p>
          ) : (
            <ul className="event-list">
              {resources.map((r) => (
                <li className="event-row" key={r.url}>
                  <p className="event-date">{r.year}</p>
                  <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={fileUrl(r.url)}>{tr(r.title, lang)}</a></h3><p className="small muted">{tr(resourceKinds[r.kind], lang)}</p></div>
                  <p className="small muted">{r.format}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
