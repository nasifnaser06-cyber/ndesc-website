import { type Locale, tr, num } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { officers, executiveSessions } from "@/content/club";
import { ui } from "@/content/ui";
import { PageHead, PersonCard, Txt } from "@/components/bits";
import Tabs from "@/components/Tabs";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "Executives", bn: "কার্যনির্বাহী" };
const lead = {
  en: "The teachers who guide the club and the students who run it, session by session.",
  bn: "যে শিক্ষকেরা ক্লাবকে পথ দেখান আর যে শিক্ষার্থীরা প্রতি সেশনে ক্লাব পরিচালনা করেন।",
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/executives", title, lead);
}

const sessionLabel = (s: string, lang: Locale) => (lang === "bn" ? num(s, "bn") : s);

export default async function Executives({ params }: Props) {
  const { lang } = await params;
  const en = lang === "en";
  const current = executiveSessions.find((s) => s.current) ?? executiveSessions[0];
  const former = executiveSessions.filter((s) => s !== current);

  const officersPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-officers">
      <h2 id="h-officers" className="tab-heading">{en ? "Officers" : "উপদেষ্টা ও মডারেটর"}</h2>
      <div className="people">
        {officers.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
      </div>
    </div>
  );

  const currentPanel = (
    <div className="tab-section" role="region" aria-labelledby="h-current">
      <h2 id="h-current" className="tab-heading">
        {en ? "Executive panel" : "কার্যনির্বাহী পরিষদ"} <span className="session-tag"><Txt>{sessionLabel(current.session, lang)}</Txt></span>
      </h2>
      <div className="people">
        {current.members.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
      </div>
    </div>
  );

  const formerPanel = (
    <div className="stack" style={{ gap: "var(--s5)" }}>
      <h2 className="tab-heading">{en ? "Former executives" : "সাবেক কার্যনির্বাহী"}</h2>
      {former.length === 0 ? (
        <p className="empty">{en ? "Earlier sessions will be added here." : "আগের সেশনগুলো এখানে যোগ হবে।"}</p>
      ) : (
        <Tabs
          small
          label={en ? "Session" : "সেশন"}
          initial={former[0].session}
          tabs={former.map((s) => ({
            id: s.session,
            label: sessionLabel(s.session, lang),
            content: (
              <div className="tab-section" role="region" aria-label={`${en ? "Session" : "সেশন"} ${s.session}`}>
                <h3 className="tab-heading small-heading"><Txt>{sessionLabel(s.session, lang)}</Txt></h3>
                <div className="people">
                  {s.members.map((p, i) => <PersonCard key={i} lang={lang} {...p} />)}
                </div>
              </div>
            ),
          }))}
        />
      )}
    </div>
  );

  return (
    <>
      <PageHead lang={lang} kicker={{ en: "Meet the team", bn: "আমাদের দল" }} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s7)" }}>
        <Tabs
          syncHash
          label={en ? "Executives" : "কার্যনির্বাহী"}
          initial="current"
          tabs={[
            { id: "officers", label: en ? "Officers" : "উপদেষ্টা", content: officersPanel },
            { id: "current", label: en ? "Current" : "বর্তমান", content: currentPanel },
            { id: "former", label: en ? "Former" : "সাবেক", content: formerPanel },
          ]}
        />
        <p className="small muted">{tr(ui.consentNote, lang)}</p>
      </div>
    </>
  );
}
