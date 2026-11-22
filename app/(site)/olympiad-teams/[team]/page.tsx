import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale, path, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { olympiadTeams, getTeam } from "@/content/olympiad";
import { ExternalLink, PageHead } from "@/components/bits";
import { TeamIcon } from "@/components/TeamIcon";

type Props = { params: Promise<{ team: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return olympiadTeams.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { team } = await params;
  const lang: Locale = "en";
  const t = getTeam(team);
  if (!t) return {};
  return meta(lang, `/olympiad-teams/${t.slug}`, { en: `${t.name} · Olympiad Teams`, bn: `${t.name} · অলিম্পিয়াড দল` }, t.overview);
}

// Sections show only when the club has given their content; nothing is filled in on its behalf.
export default async function TeamPage({ params }: Props) {
  const { team } = await params;
  const lang: Locale = "en";
  const t = getTeam(team);
  if (!t) notFound();
  const en = lang === "en";
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const achievements = [...t.achievements].sort((a, b) => b.year.localeCompare(a.year));
  const others = olympiadTeams.filter((x) => x.slug !== t.slug);

  return (
    <>
      <PageHead
        lang={lang}
        kicker={t.newlyFormed ? { en: `${tr(t.discipline, "en")} · Newly formed`, bn: tr(t.discipline, "bn") } : t.discipline}
        title={{ en: t.name, bn: t.name }}
        lead={t.overview}
        crumbs={[{ label: ui.nav.explore, to: "/explore" }, { label: ui.nav.olympiadTeams, to: "/olympiad-teams" }]}
      />
      <div className={`wrap accent-${t.slug}`} style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <section aria-labelledby="focus">
          <div style={{ display: "flex", gap: "var(--s4)", alignItems: "center", marginBottom: "var(--s4)" }}>
            <span className="hub-icon"><TeamIcon slug={t.slug} /></span>
            <h2 id="focus" style={{ margin: 0 }}>{en ? "Academic focus" : "শিক্ষাগত লক্ষ্য"}</h2>
          </div>
          <dl className="team-facts">
            <div><dt>{en ? "Olympiad" : "অলিম্পিয়াড"}</dt><dd>{tr(t.olympiad.name, lang)} ({t.olympiad.short})</dd></div>
            <div><dt>{en ? "Field" : "বিষয়"}</dt><dd>{tr(t.discipline, lang)}</dd></div>
          </dl>
        </section>

        <section aria-labelledby="prep">
          <h2 id="prep" style={{ marginBottom: "var(--s4)" }}>{en ? "How the team prepares" : "দল যেভাবে প্রস্তুতি নেয়"}</h2>
          <ul className="tick-list">
            {t.preparation.map((p, i) => <li key={i}>{tr(p, lang)}</li>)}
          </ul>
        </section>

        {t.selection && (
          <section aria-labelledby="sel">
            <h2 id="sel" style={{ marginBottom: "var(--s4)" }}>{en ? "Selection and eligibility" : "বাছাই ও যোগ্যতা"}</h2>
            <p className="muted">{tr(t.selection, lang)}</p>
          </section>
        )}

        {t.mentors.length > 0 && (
          <section aria-labelledby="mentors">
            <h2 id="mentors" style={{ marginBottom: "var(--s4)" }}>{en ? "Mentors and coordinators" : "মেন্টর ও সমন্বয়ক"}</h2>
            <ul className="tick-list">{t.mentors.map((m) => <li key={m.name}><span><strong>{m.name}</strong>, {m.role}</span></li>)}</ul>
          </section>
        )}

        {achievements.length > 0 && (
          <section aria-labelledby="ach">
            <h2 id="ach" style={{ marginBottom: "var(--s4)" }}>{en ? "Achievements" : "অর্জন"}</h2>
            <ul className="event-list">
              {achievements.map((a, i) => (
                <li className="event-row" key={i}>
                  <p className="event-date">{a.year}</p>
                  <div className="event-main">
                    <h3 style={{ fontSize: "1.125rem" }}>{a.award}</h3>
                    <p className="small muted">{a.competition}{a.credit ? ` · ${a.credit}` : ""}</p>
                  </div>
                  {a.source && <p className="small"><ExternalLink href={a.source.url} lang={lang}>{a.source.label}</ExternalLink></p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {t.milestones.length > 0 && (
          <section aria-labelledby="mile">
            <h2 id="mile" style={{ marginBottom: "var(--s4)" }}>{en ? "Milestones" : "মাইলফলক"}</h2>
            <ul className="event-list">
              {t.milestones.map((m, i) => (
                <li className="event-row" key={i}><p className="event-date">{m.year}</p><div className="event-main"><p>{tr(m.text, lang)}</p></div></li>
              ))}
            </ul>
          </section>
        )}

        {t.photos.length > 0 && (
          <section aria-labelledby="photos">
            <h2 id="photos" style={{ marginBottom: "var(--s4)" }}>{en ? "Photos" : "ছবি"}</h2>
            <div className="cards-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {t.photos.map((p) => <img key={p.src} src={`${bp}${p.src}`} alt={tr(p.alt, lang)} loading="lazy" style={{ width: "100%", height: "auto", borderRadius: 14 }} />)}
            </div>
          </section>
        )}

        {t.resources.length > 0 && (
          <section aria-labelledby="learn">
            <h2 id="learn" style={{ marginBottom: "var(--s4)" }}>{en ? "Learning resources" : "শেখার উপকরণ"}</h2>
            <ul className="tick-list">{t.resources.map((r) => <li key={r.url}><ExternalLink href={r.url} lang={lang}>{tr(r.title, lang)}</ExternalLink></li>)}</ul>
          </section>
        )}

        <section aria-labelledby="join" className="surface panel-band">
          <div>
            <h2 id="join">{en ? `Interested in ${t.name}?` : `${t.name}-এ আগ্রহী?`}</h2>
            <p className="muted">{en ? "Ask the club about the next selection test and how to take part." : "পরের বাছাই পরীক্ষা আর অংশ নেওয়ার উপায় জানতে ক্লাবের সঙ্গে যোগাযোগ করুন।"}</p>
          </div>
          <div className="actions">
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{en ? "Contact the club" : "ক্লাবে যোগাযোগ"}</Link>
          </div>
        </section>

        <nav aria-label={en ? "Other teams" : "অন্য দল"} className="small" style={{ display: "flex", gap: "var(--s5)", flexWrap: "wrap" }}>
          {others.map((o) => <Link key={o.slug} href={path(lang, `/olympiad-teams/${o.slug}`)}>{o.name} →</Link>)}
        </nav>
      </div>
    </>
  );
}
