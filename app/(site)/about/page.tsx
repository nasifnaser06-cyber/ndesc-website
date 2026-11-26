import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { moderators } from "@/content/club";
import { olympiadTeams, olympiadIntro } from "@/content/olympiad";
import { PageHead, PersonCard } from "@/components/bits";

const title = "Our story";
const lead = "Founded on 28 October 1992, Notre Dame Eco and Space Club (NDESC) is Bangladesh's first national astronomical club at the higher secondary level.";
export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/about", title, lead);
}

export default async function About() {
  const lang: Locale = "en";
  return (
    <>
      <PageHead lang={lang} kicker={"About"} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s9)" }}>
        {/* Botalinnaeus and World Environment Day 2026 (Mahmud, 27 Nov 2026). */}
        <figure className="photo-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="home-photo"
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/about/botalinnaeus-2026-1280.webp`}
            srcSet={[640, 960, 1280, 2048].map((w) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/about/botalinnaeus-2026-${w}.webp ${w}w`).join(", ")}
            sizes="(min-width: 1280px) 1216px, 100vw"
            alt={"A teacher points out the leaves of a tree to a crowd of NDESC members in college uniform on the Notre Dame College campus"}
            width={2048}
            height={1536}
            fetchPriority="high"
          />
          <figcaption>{"Botalinnaeus and World Environment Day Celebration 2026"}</figcaption>
        </figure>

        <section className="two-worlds">
          <div>
            <h2>{"Who we are"}</h2>
            <p className="muted">
              {"Formerly known as the Notre Dame Environmental Promotion Club, the club aims to spread knowledge of Astronomy, Earth Science and Biology and provides a hub for like-minded students to venture beyond their academic syllabus and explore new realms of science."}
            </p>
          </div>
          <div>
            <h2>{"What we do"}</h2>
            <p className="muted">
              {"In the past 34 years, NDESC has organised more than ten national events and numerous intra events, including the National Earth and Space Summit (NESS), Cosmoterrium, Fruits Fiesta and Botalinnaeus, with each event involving hundreds of students."}
            </p>
          </div>
        </section>

        <section aria-labelledby="club-life" className="two-worlds">
          <div>
            <h2 id="club-life">{"Club life"}</h2>
            <p className="muted">
              {"The club also regularly holds weekly meetings and informative sessions, stargazing and solar observation programs with its own telescope and team selection tests for its Olympiad teams and other competitions for members, often in collaboration with various universities and research teams."}
            </p>
          </div>
          <div>
            <h2>{"What we publish"}</h2>
            <p className="muted">
              {"NDESC also has its own annual publication, the DURBIN magazine and a long-running online weekly series of short science articles known as FactsFriday."}
            </p>
          </div>
        </section>

        <section aria-labelledby="teams">
          <div className="section-head">
            <h2 id="teams">{"Our Olympiad teams"}</h2>
            <Link href={path(lang, "/olympiad-teams")}>{"Explore our Olympiad teams"}</Link>
          </div>
          <p className="muted" style={{ maxWidth: "48rem", marginBottom: "var(--s6)" }}>{olympiadIntro}</p>
          <div className="cards-3">
            {olympiadTeams.map((t) => (
              <div className="surface" key={t.slug}>
                <h3>
                  <Link href={path(lang, `/olympiad-teams/${t.slug}`)} style={{ color: "inherit" }}>{t.name}</Link>
                  {t.newlyFormed && <> <span className="tag tag-up" style={{ verticalAlign: "middle", marginLeft: "var(--s2)" }}>{"Newly formed"}</span></>}
                </h3>
                <p className="small muted">{"Prepares for the"} {t.olympiad.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="mods">
          <div className="section-head">
            <h2 id="mods">{"Moderators"}</h2>
            <Link href={path(lang, "/executives")}>{"Meet the executives"}</Link>
          </div>
          <div className="people">
            {moderators.map((m, i) => (
              <PersonCard key={i} name={m.name} post={m.post} photo={m.photo} lang={lang} />
            ))}
          </div>
        </section>

        <section aria-labelledby="glance">
          <h2 id="glance" style={{ marginBottom: "var(--s4)" }}>{"At a glance"}</h2>
          <table className="at-a-glance">
            <tbody>
              <tr><th scope="row">{"Founded"}</th><td>{"28 October 1992"}</td></tr>
              <tr><th scope="row">{"Former name"}</th><td>{"Notre Dame Environmental Promotion Club"}</td></tr>
              <tr><th scope="row">{"Renamed"}</th><td>{"23 May 2018"}</td></tr>
              <tr><th scope="row">{"Home"}</th><td>{"Notre Dame College, Dhaka"}</td></tr>
              <tr><th scope="row">{"Signature event"}</th><td><Link href={path(lang, "/ness")}>{"National Earth and Space Summit"}</Link></td></tr>
              <tr><th scope="row">{"Other events"}</th><td><Link href={path(lang, "/events/cosmoterrium-2026")}>{"Cosmoterrium"}</Link>, <Link href={path(lang, "/events/fruits-fiesta-2025")}>{"Fruits Fiesta"}</Link>, <Link href={path(lang, "/events/botalinnaeus-2025")}>{"Botalinnaeus"}</Link>, <Link href={path(lang, "/events/stargazing-night-camp-2024")}>{"Stargazing Night Camp"}</Link>, <Link href={path(lang, "/events/space-camp-2018")}>{"National Space Camp"}</Link>, {"workshops"}</td></tr>
              <tr><th scope="row">{"Publications"}</th><td>{"DURBIN magazine (annual), FactsFriday (weekly, online)"}</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
