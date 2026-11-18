import Link from "next/link";
import { type Locale, tr, path, formatDateRange, num } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { getEvent } from "@/content/events";
import { nessGroups, nessCategories, nessSchedule, nessPast, nessFaq } from "@/content/club";
import { FormButton, Stars, T } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "NESS 2027", bn: "NESS ২০২৭" };
const description = {
  en: "National Earth and Space Summit 2027, 28–30 January at Notre Dame College, Dhaka. Olympiads, quizzes, team contests, talks and exhibitions.",
  bn: "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট ২০২৭, ২৮–৩০ জানুয়ারি, নটর ডেম কলেজ, ঢাকা। অলিম্পিয়াড, কুইজ, দলীয় প্রতিযোগিতা, আলোচনা ও প্রদর্শনী।",
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/ness", title, description);
}

export default async function Ness({ params }: Props) {
  const { lang } = await params;
  const en = lang === "en";
  const ness = getEvent("ness-2027")!;

  return (
    <>
      <section className="sky" aria-labelledby="ness-h1">
        <Stars />
        <div className="wrap sky-inner" style={{ paddingBlock: "var(--s8) var(--s7)" }}>
          <div className="sky-copy">
            <p className="label"><T lang={lang} text={{ en: "10th National Earth and Space Summit", bn: "১০ম ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট" }} /></p>
            <h1 id="ness-h1">{tr(title, lang)}</h1>
            <p>{en ? "Three days of olympiads, quizzes, team contests, talks and exhibitions on ecology, earth science and astronomy." : "পরিবেশ, ভূবিজ্ঞান ও জ্যোতির্বিজ্ঞান নিয়ে তিন দিনের অলিম্পিয়াড, কুইজ, দলীয় প্রতিযোগিতা, আলোচনা ও প্রদর্শনী।"}</p>
            <dl className="facts">
              <div><dt>{tr(ui.dates, lang)}</dt><dd>{formatDateRange(ness.start, ness.end, lang, "long")}</dd></div>
              <div><dt>{tr(ui.venue, lang)}</dt><dd>{en ? "Notre Dame College, Motijheel, Dhaka" : "নটর ডেম কলেজ, মতিঝিল, ঢাকা"}</dd></div>
              <div><dt>{tr(ui.for, lang)}</dt><dd>{en ? "Primary to higher secondary students" : "প্রাথমিক থেকে উচ্চমাধ্যমিক শিক্ষার্থী"}</dd></div>
            </dl>
            <div className="actions">
              <FormButton href={site.forms.nessRegister} lang={lang}>{tr(ui.register, lang)}</FormButton>
              <a className="btn btn-secondary" href="#exhibit">{tr(ui.exhibit, lang)}</a>
            </div>
            <p className="small">{en ? "The Photosphere and Stellarscapes exhibitions are free to visit without registering." : "ফটোস্ফিয়ার ও স্টেলারস্কেপস প্রদর্শনী দেখতে নিবন্ধন লাগে না।"}</p>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s9)", paddingTop: "var(--s8)" }}>
        <section aria-labelledby="programme">
          <h2 id="programme" style={{ marginBottom: "var(--s6)" }}>{en ? "What happens over three days" : "তিন দিনে যা থাকছে"}</h2>
          <div className="groups">
            {nessGroups.map((g) => (
              <div key={g.title.en}>
                <h3>{tr(g.title, lang)}</h3>
                <p className="muted small">{tr(g.items, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="cats">
          <h2 id="cats" style={{ marginBottom: "var(--s4)" }}>{en ? "Categories" : "বিভাগ"}</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">{en ? "Category" : "বিভাগ"}</th><th scope="col">{en ? "Classes" : "শ্রেণি"}</th></tr></thead>
              <tbody>
                {nessCategories.map((c) => (
                  <tr key={c.name.en}><td>{tr(c.name, lang)}</td><td><T text={c.classes} lang={lang} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="schedule">
          <h2 id="schedule" style={{ marginBottom: "var(--s5)" }}>{en ? "Schedule" : "সময়সূচি"}</h2>
          <div className="cards-3">
            {nessSchedule.map((d) => (
              <div className="surface" key={d.day.en}>
                <h3>{tr(d.day, lang)}</h3>
                <p className="muted small"><T text={d.plan} lang={lang} /></p>
              </div>
            ))}
          </div>
        </section>

        <section id="register" aria-labelledby="reg">
          <h2 id="reg" style={{ marginBottom: "var(--s5)" }}>{en ? "How to register" : "যেভাবে নিবন্ধন করবেন"}</h2>
          <ol className="steps">
            <li><p><strong>{en ? "Pick your events" : "ইভেন্ট বেছে নিন"}</strong></p><p className="muted small"><T lang={lang} text={{ en: "Solo pass, team pass or both. [Pass prices]", bn: "একক পাস, দলীয় পাস বা দুটোই। [পাসের দাম]" }} /></p></li>
            <li><p><strong>{en ? "Register online" : "অনলাইনে নিবন্ধন"}</strong></p><p className="muted small">{en ? "Use the form below. Your school's campus ambassador can help." : "নিচের ফর্ম ব্যবহার করুন। আপনার প্রতিষ্ঠানের ক্যাম্পাস অ্যাম্বাসেডর সাহায্য করতে পারবেন।"}</p></li>
            <li><p><strong>{en ? "Pay" : "ফি জমা দিন"}</strong></p><p className="muted small"><T lang={lang} text={{ en: "[Payment details]", bn: "[ফি জমার নিয়ম]" }} /></p></li>
            <li><p><strong>{en ? "Get your confirmation" : "নিশ্চিতকরণ পান"}</strong></p><p className="muted small"><T lang={lang} text={{ en: "[By email or SMS, with your participant ID]", bn: "[ইমেইল বা এসএমএসে, অংশগ্রহণকারী আইডিসহ]" }} /></p></li>
          </ol>
          <div className="actions" style={{ marginTop: "var(--s5)" }}>
            <FormButton href={site.forms.nessRegister} lang={lang}>{en ? "Register for NESS 2027" : "NESS ২০২৭-এ নিবন্ধন করুন"}</FormButton>
          </div>
        </section>

        <section id="exhibit" className="surface panel-band" aria-labelledby="exh">
          <div>
            <p className="label">{en ? "For organisations" : "প্রতিষ্ঠানের জন্য"}</p>
            <h2 id="exh">{en ? "Show your project at NESS" : "NESS-এ আপনার প্রকল্প দেখান"}</h2>
            <p className="muted">
              {en
                ? "Universities, research teams, clubs and companies can take a stall and meet thousands of students and families. Past exhibitors include Formula IUT, Amateur Experimental Rocketry Dhaka and MICB Scientific Society."
                : "বিশ্ববিদ্যালয়, গবেষণা দল, ক্লাব ও প্রতিষ্ঠান স্টল নিয়ে হাজারো শিক্ষার্থী ও পরিবারের কাছে পৌঁছাতে পারে। আগের প্রদর্শকদের মধ্যে ছিল ফর্মুলা আইইউটি, অ্যামেচার এক্সপেরিমেন্টাল রকেট্রি ঢাকা ও এমআইসিবি সায়েন্টিফিক সোসাইটি।"}
            </p>
            <p className="small muted"><T lang={lang} text={{ en: "[Stall sizes, cost and deadline]", bn: "[স্টলের আকার, খরচ ও শেষ তারিখ]" }} /></p>
          </div>
          <div className="actions">
            <FormButton href={site.forms.nessExhibit} lang={lang}>{en ? "Apply to exhibit" : "প্রদর্শনের আবেদন"}</FormButton>
            <Link className="btn btn-secondary" href={path(lang, "/contact")}>{en ? "Ask the NESS team" : "NESS টিমকে জিজ্ঞেস করুন"}</Link>
          </div>
        </section>

        <section aria-labelledby="past">
          <h2 id="past" style={{ marginBottom: "var(--s4)" }}>{en ? "Past summits" : "আগের সামিট"}</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th scope="col">{en ? "Edition" : "আসর"}</th><th scope="col">{en ? "Year" : "বছর"}</th><th scope="col">{en ? "Highlights" : "উল্লেখযোগ্য"}</th></tr></thead>
              <tbody>
                {nessPast.map((p) => (
                  <tr key={p.edition.en}>
                    <td style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                      {p.slug ? <Link href={path(lang, `/events/${p.slug}`)}>{tr(p.edition, lang)}</Link> : tr(p.edition, lang)}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}><T text={{ en: p.year, bn: num(p.year, "bn") }} lang={lang} /></td>
                    <td className="muted"><T text={p.note} lang={lang} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: "var(--s3)" }}>
            {en ? "Figures as reported by The Daily Star, The Financial Express and Dhaka Tribune. Each summit page links its sources." : "সংখ্যাগুলো দ্য ডেইলি স্টার, দ্য ফিন্যান্সিয়াল এক্সপ্রেস ও ঢাকা ট্রিবিউনের প্রতিবেদন থেকে। প্রতিটি সামিটের পাতায় সূত্র দেওয়া আছে।"}
          </p>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" style={{ marginBottom: "var(--s3)" }}>{en ? "Questions" : "প্রশ্নোত্তর"}</h2>
          {nessFaq.map((f) => (
            <details key={f.q.en}>
              <summary>{tr(f.q, lang)}</summary>
              <p><T text={f.a} lang={lang} /></p>
            </details>
          ))}
          <p className="small muted" style={{ marginTop: "var(--s4)" }}>
            {en ? "Still stuck? " : "আরও জানতে "}<Link href={path(lang, "/contact")}>{en ? "Contact the NESS team" : "NESS টিমের সঙ্গে যোগাযোগ করুন"}</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
