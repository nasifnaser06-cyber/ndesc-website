import Link from "next/link";
import { type Locale, path, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { moderators } from "@/content/club";
import { olympiadTeams, olympiadIntro } from "@/content/olympiad";
import { PageHead, PersonCard, PhotoSlot } from "@/components/bits";

const title = { en: "Our story", bn: "আমাদের গল্প" };
const lead = {
  en: "Founded on 28 October 1992, Notre Dame Eco and Space Club (NDESC) is Bangladesh's first national astronomical club at the higher secondary level.",
  bn: "১৯৯২ সালের ২৮ অক্টোবর প্রতিষ্ঠিত নটর ডেম ইকো অ্যান্ড স্পেস ক্লাব (NDESC) উচ্চমাধ্যমিক পর্যায়ে বাংলাদেশের প্রথম জাতীয় জ্যোতির্বিজ্ঞান ক্লাব।",
};

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/about", title, lead);
}

export default async function About() {
  const lang: Locale = "en";
  const en = lang === "en";
  return (
    <>
      <PageHead lang={lang} kicker={{ en: "About", bn: "আমাদের কথা" }} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s9)" }}>
        <PhotoSlot tall lang={lang} label={{ en: "the club at work, a wide shot", bn: "কাজে ব্যস্ত ক্লাব, বড় পরিসরের ছবি" }} />

        <section className="two-worlds">
          <div>
            <h2>{en ? "Who we are" : "আমরা কারা"}</h2>
            <p className="muted">
              {en
                ? "Formerly known as the Notre Dame Environmental Promotion Club, the club aims to spread knowledge of Astronomy, Earth Science and Biology and provides a hub for like-minded students to venture beyond their academic syllabus and explore new realms of science."
                : "আগে নটর ডেম এনভায়রনমেন্টাল প্রমোশন ক্লাব নামে পরিচিত এই ক্লাবের লক্ষ্য জ্যোতির্বিজ্ঞান, ভূবিজ্ঞান ও জীববিজ্ঞানের জ্ঞান ছড়িয়ে দেওয়া, আর সমমনা শিক্ষার্থীদের পাঠ্যসূচির বাইরে বিজ্ঞানের নতুন জগৎ খুঁজে দেখার জায়গা করে দেওয়া।"}
            </p>
          </div>
          <div>
            <h2>{en ? "What we do" : "আমরা যা করি"}</h2>
            <p className="muted">
              {en
                ? "In the past 34 years, NDESC has organised more than ten national events and numerous intra events, including the National Earth and Space Summit (NESS), Cosmoterrium, Fruits Fiesta and Botalinnaeus, with each event involving hundreds of students."
                : "গত ৩৪ বছরে NDESC দশটির বেশি জাতীয় আয়োজন আর অসংখ্য অভ্যন্তরীণ আয়োজন করেছে, যার মধ্যে আছে ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট (NESS), কসমোটেরিয়াম, ফ্রুটস ফিয়েস্তা ও বোটালিনিয়াস। প্রতিটি আয়োজনে অংশ নেয় শত শত শিক্ষার্থী।"}
            </p>
          </div>
        </section>

        <section aria-labelledby="club-life" className="two-worlds">
          <div>
            <h2 id="club-life">{en ? "Club life" : "ক্লাবের দিনগুলো"}</h2>
            <p className="muted">
              {en
                ? "The club also regularly holds weekly meetings and informative sessions, stargazing and solar observation programs with its own telescope and team selection tests for its Olympiad teams and other competitions for members, often in collaboration with various universities and research teams."
                : "ক্লাবে নিয়মিত সাপ্তাহিক সভা ও তথ্যভিত্তিক সেশন হয়, নিজস্ব টেলিস্কোপে তারা দেখা ও সূর্য পর্যবেক্ষণ হয়, আর অলিম্পিয়াড দল ও অন্যান্য প্রতিযোগিতার জন্য সদস্যদের বাছাই পরীক্ষা হয়, প্রায়ই বিভিন্ন বিশ্ববিদ্যালয় ও গবেষণা দলের সঙ্গে মিলে।"}
            </p>
          </div>
          <div>
            <h2>{en ? "What we publish" : "আমাদের প্রকাশনা"}</h2>
            <p className="muted">
              {en
                ? "NDESC also has its own annual publication, the DURBIN magazine and a long-running online weekly series of short science articles known as FactsFriday."
                : "NDESC-এর নিজস্ব বার্ষিক প্রকাশনা দুরবীন ম্যাগাজিন, আর অনলাইনে ছোট বিজ্ঞান লেখার দীর্ঘদিনের সাপ্তাহিক সিরিজ FactsFriday।"}
            </p>
          </div>
        </section>

        <section aria-labelledby="teams">
          <div className="section-head">
            <h2 id="teams">{en ? "Our Olympiad teams" : "আমাদের অলিম্পিয়াড দল"}</h2>
            <Link href={path(lang, "/olympiad-teams")}>{en ? "Explore our Olympiad teams" : "আমাদের অলিম্পিয়াড দল দেখুন"}</Link>
          </div>
          <p className="muted" style={{ maxWidth: "48rem", marginBottom: "var(--s6)" }}>{tr(olympiadIntro, lang)}</p>
          <div className="cards-3">
            {olympiadTeams.map((t) => (
              <div className="surface" key={t.slug}>
                <h3>
                  <Link href={path(lang, `/olympiad-teams/${t.slug}`)} style={{ color: "inherit" }}>{t.name}</Link>
                  {t.newlyFormed && <> <span className="tag tag-up" style={{ verticalAlign: "middle", marginLeft: "var(--s2)" }}>{en ? "Newly formed" : "নতুন"}</span></>}
                </h3>
                <p className="small muted">{en ? "Prepares for the" : "প্রস্তুতি নেয়"} {tr(t.olympiad.name, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="mods">
          <div className="section-head">
            <h2 id="mods">{en ? "Moderators" : "মডারেটর"}</h2>
            <Link href={path(lang, "/executives")}>{en ? "Meet the executives" : "কার্যনির্বাহীদের সঙ্গে পরিচিত হোন"}</Link>
          </div>
          <div className="people">
            {moderators.map((m, i) => (
              <PersonCard key={i} name={m.name} post={m.post} photo={m.photo} lang={lang} />
            ))}
          </div>
        </section>

        <section aria-labelledby="glance">
          <h2 id="glance" style={{ marginBottom: "var(--s4)" }}>{en ? "At a glance" : "এক নজরে"}</h2>
          <table className="at-a-glance">
            <tbody>
              <tr><th scope="row">{en ? "Founded" : "প্রতিষ্ঠা"}</th><td>{en ? "28 October 1992" : "২৮ অক্টোবর ১৯৯২"}</td></tr>
              <tr><th scope="row">{en ? "Former name" : "আগের নাম"}</th><td>{en ? "Notre Dame Environmental Promotion Club" : "নটর ডেম এনভায়রনমেন্টাল প্রমোশন ক্লাব"}</td></tr>
              <tr><th scope="row">{en ? "Renamed" : "নাম পরিবর্তন"}</th><td>{en ? "23 May 2018" : "২৩ মে ২০১৮"}</td></tr>
              <tr><th scope="row">{en ? "Home" : "ঠিকানা"}</th><td>{en ? "Notre Dame College, Dhaka" : "নটর ডেম কলেজ, ঢাকা"}</td></tr>
              <tr><th scope="row">{en ? "Signature event" : "প্রধান আয়োজন"}</th><td><Link href={path(lang, "/ness")}>{en ? "National Earth and Space Summit" : "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট"}</Link></td></tr>
              <tr><th scope="row">{en ? "Other events" : "অন্যান্য আয়োজন"}</th><td>{en ? "Cosmoterrium, Fruits Fiesta, Botalinnaeus, National Space Camp, workshops" : "কসমোটেরিয়াম, ফ্রুটস ফিয়েস্তা, বোটালিনিয়াস, ন্যাশনাল স্পেস ক্যাম্প, কর্মশালা"}</td></tr>
              <tr><th scope="row">{en ? "Publications" : "প্রকাশনা"}</th><td>{en ? "DURBIN magazine (annual), FactsFriday (weekly, online)" : "দুরবীন ম্যাগাজিন (বার্ষিক), FactsFriday (সাপ্তাহিক, অনলাইন)"}</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
