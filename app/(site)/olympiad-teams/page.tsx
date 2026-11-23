import Link from "next/link";
import { type Locale, path, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { olympiadTeams, olympiadIntro, olympiadHistory, olympiadWhyJoin, olympiadHowToJoin } from "@/content/olympiad";
import { PageHead } from "@/components/bits";
import { TeamIcon } from "@/components/TeamIcon";
import { IconArrow } from "@/components/HubIcons";

const title = { en: "Olympiad Teams", bn: "অলিম্পিয়াড দল" };
const lead = {
  en: "Meet NDESC's three Olympiad teams and the international Olympiads they prepare for.",
  bn: "NDESC-এর তিনটি অলিম্পিয়াড দল আর তারা যে আন্তর্জাতিক অলিম্পিয়াডের প্রস্তুতি নেয়।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/olympiad-teams", title, lead);
}

export default async function OlympiadTeams() {
  const lang: Locale = "en";
  const en = lang === "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.explore, to: "/explore" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s7)" }}>
        <p className="muted" style={{ maxWidth: "62ch", margin: 0 }}>{tr(olympiadIntro, lang)}</p>
        <div className="hub-grid">
          {olympiadTeams.map((t) => (
            <Link key={t.slug} className={`hub-card accent-${t.slug}`} href={path(lang, `/olympiad-teams/${t.slug}`)}>
              <span className="hub-icon"><TeamIcon slug={t.slug} /></span>
              <h2>
                {t.name}
                {t.newlyFormed && <> <span className="tag tag-up" style={{ verticalAlign: "middle", marginLeft: "var(--s2)", fontSize: "0.8125rem" }}>{en ? "Newly formed" : "নতুন"}</span></>}
              </h2>
              <p>{tr(t.discipline, lang)}</p>
              <div className="hub-preview">
                <div>
                  <span>{en ? "Prepares for" : "প্রস্তুতি নেয়"}</span>
                  <strong>{tr(t.olympiad.name, lang)} ({t.olympiad.short})</strong>
                </div>
              </div>
              <span className="hub-go">{en ? "Team page" : "দলের পাতা"} <IconArrow /></span>
            </Link>
          ))}
        </div>

        <section aria-labelledby="began" style={{ maxWidth: "62ch" }}>
          <h2 id="began" style={{ marginBottom: "var(--s4)" }}>{en ? "How the teams began" : "দলগুলো যেভাবে শুরু হলো"}</h2>
          {olympiadHistory.map((p, i) => <p key={i} className="muted" style={{ marginTop: i ? "var(--s4)" : 0 }}>{tr(p, lang)}</p>)}
        </section>

        <section aria-labelledby="why" style={{ maxWidth: "62ch" }}>
          <h2 id="why" style={{ marginBottom: "var(--s4)" }}>{en ? "Why join an Olympiad team?" : "কেন অলিম্পিয়াড দলে যোগ দেবেন?"}</h2>
          <p className="muted" style={{ marginBottom: "var(--s4)" }}>{tr(olympiadWhyJoin.intro, lang)}</p>
          <ul className="tick-list">
            {olympiadWhyJoin.items.map((it, i) => <li key={i}><span><strong>{tr(it.title, lang)}.</strong> {tr(it.text, lang)}</span></li>)}
          </ul>
        </section>

        <section aria-labelledby="howjoin" className="surface panel-band">
          <div>
            <h2 id="howjoin">{en ? "How to join" : "যেভাবে যোগ দেবেন"}</h2>
            <p className="muted">{tr(olympiadHowToJoin, lang)}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{en ? "Contact the club" : "ক্লাবে যোগাযোগ"}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
