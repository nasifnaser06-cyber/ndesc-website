import Link from "next/link";
import { type Locale, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { moderators } from "@/content/club";
import { PageHead, PhotoSlot, T } from "@/components/bits";

const title = { en: "Our story", bn: "আমাদের গল্প" };
const lead = {
  en: "From an environmental club in 1992 to the club behind one of the country's biggest school science summits.",
  bn: "১৯৯২ সালের একটি পরিবেশ ক্লাব থেকে দেশের অন্যতম বড় স্কুল-কলেজ বিজ্ঞান সামিটের আয়োজক।",
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
            <h2>{en ? "Where we started" : "যেভাবে শুরু"}</h2>
            <p className="muted">
              {en
                ? "The club was founded on 28 October 1992 as the Notre Dame Environmental Promotion Club, to conserve ecosystems with a focus on wildlife and biological diversity."
                : "১৯৯২ সালের ২৮ অক্টোবর নটর ডেম এনভায়রনমেন্টাল প্রমোশন ক্লাব নামে ক্লাবটির প্রতিষ্ঠা। লক্ষ্য ছিল বাস্তুতন্ত্র সংরক্ষণ, বিশেষ করে বন্যপ্রাণী ও জীববৈচিত্র্য রক্ষা।"}
            </p>
          </div>
          <div>
            <h2>{en ? "What we do now" : "এখন যা করি"}</h2>
            <p className="muted">
              {en
                ? "As members spent more time on astronomy and space, the club took the name Eco and Space Club. It runs workshops, seminars, stargazing camps, field tours and competitions, and organises the National Earth and Space Summit."
                : "সদস্যরা জ্যোতির্বিজ্ঞান আর মহাকাশ নিয়ে বেশি কাজ শুরু করলে ক্লাবের নাম হয় ইকো অ্যান্ড স্পেস ক্লাব। ক্লাবটি কর্মশালা, সেমিনার, তারা দেখার ক্যাম্প, ফিল্ড ট্যুর ও প্রতিযোগিতা আয়োজন করে, আর আয়োজন করে ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট।"}
            </p>
          </div>
        </section>

        <section aria-labelledby="mods">
          <div className="section-head">
            <h2 id="mods">{en ? "Moderators" : "মডারেটর"}</h2>
            <Link href={path(lang, "/executives")}>{en ? "Meet the executives" : "কার্যনির্বাহীদের সঙ্গে পরিচিত হোন"}</Link>
          </div>
          <div className="people">
            {moderators.map((m, i) => (
              <div className="person" key={i}>
                <PhotoSlot lang={lang} label={{ en: "photo", bn: "ছবি" }} />
                <h3><T text={m.name} lang={lang} /></h3>
                <p className="small muted"><T text={m.post} lang={lang} /></p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="glance">
          <h2 id="glance" style={{ marginBottom: "var(--s4)" }}>{en ? "At a glance" : "এক নজরে"}</h2>
          <table className="at-a-glance">
            <tbody>
              <tr><th scope="row">{en ? "Founded" : "প্রতিষ্ঠা"}</th><td>{en ? "28 October 1992" : "২৮ অক্টোবর ১৯৯২"}</td></tr>
              <tr><th scope="row">{en ? "Former name" : "আগের নাম"}</th><td>{en ? "Notre Dame Environmental Promotion Club" : "নটর ডেম এনভায়রনমেন্টাল প্রমোশন ক্লাব"}</td></tr>
              <tr><th scope="row">{en ? "Renamed" : "নাম পরিবর্তন"}</th><td><T lang={lang} text={{ en: "[23 May 2018? confirm]", bn: "[২৩ মে ২০১৮? নিশ্চিত করুন]" }} /></td></tr>
              <tr><th scope="row">{en ? "Home" : "ঠিকানা"}</th><td>{en ? "Notre Dame College, Dhaka" : "নটর ডেম কলেজ, ঢাকা"}</td></tr>
              <tr><th scope="row">{en ? "Signature event" : "প্রধান আয়োজন"}</th><td><Link href={path(lang, "/ness")}>{en ? "National Earth and Space Summit" : "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট"}</Link></td></tr>
              <tr><th scope="row">{en ? "Other events" : "অন্যান্য আয়োজন"}</th><td>{en ? "Cosmoterrium (intra-college), National Space Camp, workshops" : "কসমোটেরিয়াম (আন্তঃকলেজ), ন্যাশনাল স্পেস ক্যাম্প, কর্মশালা"}</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
