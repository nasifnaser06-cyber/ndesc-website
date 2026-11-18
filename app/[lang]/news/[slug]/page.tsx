import { notFound } from "next/navigation";
import { type Locale, locales, tr, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { posts, getPost, newsCategories } from "@/content/news";
import { ui } from "@/content/ui";
import { PageHead, Txt } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return meta(lang, `/news/${slug}`, p.title, p.summary);
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;
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
