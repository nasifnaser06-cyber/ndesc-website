import Link from "next/link";
import { type Locale, tr, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { resources, resourceKinds, type ResourceKind } from "@/content/club";
import { PageHead, T } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "Resources", bn: "রিসোর্স" };
const lead = { en: "Past questions, handouts and sky guides to practise and learn with.", bn: "চর্চা আর শেখার জন্য আগের প্রশ্ন, হ্যান্ডআউট আর আকাশ পরিচিতি।" };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/resources", title, lead);
}

export default async function Resources({ params }: Props) {
  const { lang } = await params;
  const en = lang === "en";
  const kinds = Object.keys(resourceKinds) as ResourceKind[];
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <nav aria-label={en ? "Resource types" : "রিসোর্সের ধরন"} className="chips">
          {kinds.map((k) => (
            <a key={k} className="chip" href={`#${k}`} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{tr(resourceKinds[k], lang)}</a>
          ))}
        </nav>
        {kinds.map((k) => {
          const items = resources.filter((r) => r.kind === k);
          return (
            <section key={k} id={k} aria-labelledby={`h-${k}`}>
              <h2 id={`h-${k}`} style={{ marginBottom: "var(--s4)" }}>{tr(resourceKinds[k], lang)}</h2>
              {items.length === 0 ? (
                <p className="empty">
                  <T lang={lang} text={{ en: "Nothing here yet. [Club to add files]", bn: "এখনো কিছু নেই। [ক্লাব ফাইল যোগ করবে]" }} />
                </p>
              ) : (
                <ul className="event-list">
                  {items.map((r) => (
                    <li className="event-row" key={r.url}>
                      <p className="event-date">{r.year}</p>
                      <div className="event-main"><h3 style={{ fontSize: "1.125rem" }}><a href={r.url.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${r.url}` : r.url}>{tr(r.title, lang)}</a></h3></div>
                      <p className="small muted">{r.format}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
        <p className="small muted">
          {en ? "Have notes or past papers to share? " : "শেয়ার করার মতো নোট বা আগের প্রশ্ন আছে? "}
          <Link href={path(lang, "/contact")}>{en ? "Send them to the club" : "ক্লাবে পাঠান"}</Link>.
        </p>
      </div>
    </>
  );
}
