import { notFound } from "next/navigation";
import { type Locale, tr, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { posts, getPost, newsCategories } from "@/content/news";
import { ui } from "@/content/ui";
import { PageHead, Txt } from "@/components/bits";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const p = getPost(slug);
  if (!p) return {};
  return meta(lang, `/news/${slug}`, p.title, p.summary);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const lang: Locale = "en";
  const p = getPost(slug);
  if (!p) notFound();
  return (
    <>
      <PageHead
        lang={lang}
        kicker={{ en: `${newsCategories[p.category].en}, ${formatDateRange(p.date, undefined, "en", "long")}`, bn: `${newsCategories[p.category].bn}, ${formatDateRange(p.date, undefined, "bn", "long")}` }}
        title={p.title}
        crumbs={[{ label: ui.nav.news, to: "/news" }]}
      />
      <article className="wrap prose">
        <p className="lead" style={{ color: "var(--starlight)" }}>{tr(p.summary, lang)}</p>
        {p.body.map((para, i) => (
          <p key={i}><Txt>{tr(para, lang)}</Txt></p>
        ))}
      </article>
    </>
  );
}
