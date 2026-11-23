import { type Locale, path, formatDateRange } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { sortedFacts, factsCategories, type FactsCategory } from "@/content/factsFriday";
import { PageHead } from "@/components/bits";
import FactsFridayArchive, { type FactsCard } from "@/components/FactsFridayArchive";
import FFMotionLab from "@/components/FFMotionLab";

// Motion lab (preview only): sets html[data-fx] before the first paint so hidden-until-revealed
// effects do not flash. Does nothing unless ?fx=... was used in this tab.
const fxBoot = `(function(){try{var q=new URLSearchParams(location.search).get("fx");var v=q!==null?(q==="none"?"":q):(sessionStorage.getItem("ndesc-ff-fx")||"");if(q!==null)sessionStorage.setItem("ndesc-ff-fx",v);document.documentElement.dataset.fx=v.split(",").join(" ")}catch(e){}})()`;


const title = { en: "FactsFriday", bn: "FactsFriday" };
const lead = {
  en: "Explore fascinating scientific facts, discoveries, and explanations from NDESC's weekly science series.",
  bn: "NDESC-এর সাপ্তাহিক বিজ্ঞান সিরিজের চমকপ্রদ বৈজ্ঞানিক তথ্য, আবিষ্কার আর ব্যাখ্যা।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/factsfriday", title, lead);
}

export default async function FactsFridayPage() {
  const lang: Locale = "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const facts = sortedFacts();
  const items: FactsCard[] = facts.map((f) => {
    const small = f.cover.sizes[0];
    const large = f.cover.sizes[f.cover.sizes.length - 1];
    return {
      slug: f.slug,
      href: path(lang, `/factsfriday/${f.slug}`),
      title: f.title,
      date: f.date,
      dateLabel: formatDateRange(f.date, undefined, lang, "long"),
      year: f.date.slice(0, 4),
      category: f.category,
      categoryLabel: factsCategories[f.category],
      summary: f.summary,
      img: `${bp}${f.cover.base}-${small}.webp`,
      img2x: large > small ? `${bp}${f.cover.base}-${large}.webp` : undefined,
      haystack: [f.title, f.summary, factsCategories[f.category], f.date.slice(0, 4), f.body.join(" ").slice(0, 600)].join(" ").toLowerCase(),
    };
  });
  // Only categories and years that actually have posts.
  const used = new Set(facts.map((f) => f.category));
  const categories = (Object.keys(factsCategories) as FactsCategory[]).filter((k) => used.has(k)).map((k) => ({ key: k, label: factsCategories[k] }));
  const years = [...new Set(facts.map((f) => f.date.slice(0, 4)))].sort().reverse();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: fxBoot }} />
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap">
        {items.length === 0 ? (
          <p className="empty">The first posts will appear here soon.</p>
        ) : (
          <FactsFridayArchive items={items} categories={categories} years={years} />
        )}
      </div>
      <FFMotionLab page="archive" />
    </>
  );
}
