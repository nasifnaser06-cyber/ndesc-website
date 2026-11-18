import Link from "next/link";
import { type Locale, tr, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { posts, newsCategories } from "@/content/news";
import { PageHead } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "News", bn: "খবর" };
const lead = { en: "Announcements, results and what to look for in the sky.", bn: "ঘোষণা, ফলাফল আর আকাশে কী দেখবেন।" };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/news", title, lead);
}

export default async function News({ params }: Props) {
  const { lang } = await params;
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap">
        <ul className="event-list">
          {sorted.map((p) => (
            <li key={p.slug} className="event-row">
              <p className="event-date">{formatDateRange(p.date, undefined, lang)}</p>
              <div className="event-main">
                <h3><Link href={path(lang, `/news/${p.slug}`)}>{tr(p.title, lang)}</Link></h3>
                <p className="small muted">{tr(p.summary, lang)}</p>
              </div>
              <p className="event-status"><span className="tag">{tr(newsCategories[p.category], lang)}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
