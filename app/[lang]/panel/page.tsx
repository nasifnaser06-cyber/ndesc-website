import { type Locale, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { moderators, panels } from "@/content/club";
import { ui } from "@/content/ui";
import { PageHead, PhotoSlot, T } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "The panel", bn: "প্যানেল" };
const lead = { en: "The teachers and students who run the club and the summit.", bn: "যে শিক্ষক ও শিক্ষার্থীরা ক্লাব আর সামিট পরিচালনা করেন।" };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/panel", title, lead);
}

export default async function Panel({ params }: Props) {
  const { lang } = await params;
  const en = lang === "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} crumbs={[{ label: ui.nav.about, to: "/about" }]} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s8)" }}>
        <section aria-labelledby="mods">
          <h2 id="mods" style={{ marginBottom: "var(--s5)" }}>{en ? "Moderators" : "মডারেটর"}</h2>
          <div className="people">
            {moderators.map((m, i) => (
              <div className="person" key={i}>
                <PhotoSlot lang={lang} label={{ en: "photo", bn: "ছবি" }} />
                <h3><T text={m.name} lang={lang} /></h3>
                <p className="small muted"><T text={m.role} lang={lang} /></p>
              </div>
            ))}
          </div>
        </section>
        {panels.map((p) => (
          <section key={p.session} aria-labelledby={`s-${p.session}`}>
            <h2 id={`s-${p.session}`} style={{ marginBottom: "var(--s5)" }}>
              {en ? "Executive panel" : "নির্বাহী প্যানেল"} {p.session}
              {p.current && <span className="tag tag-up" style={{ marginLeft: "var(--s3)", verticalAlign: "middle" }}>{en ? "Current" : "বর্তমান"}</span>}
            </h2>
            <div className="people">
              {p.members.map((m, i) => (
                <div className="person" key={i}>
                  <PhotoSlot lang={lang} label={{ en: "photo, with consent", bn: "ছবি, সম্মতিসহ" }} />
                  <h3 style={{ fontSize: "1.125rem" }}><T text={m.name} lang={lang} /></h3>
                  <p className="small muted"><T text={m.post} lang={lang} /></p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section aria-labelledby="former">
          <h2 id="former" style={{ marginBottom: "var(--s3)" }}>{en ? "Former panels" : "আগের প্যানেল"}</h2>
          <p className="muted"><T lang={lang} text={{ en: "[Earlier sessions to add, with each person's consent]", bn: "[আগের সেশনগুলো যোগ করতে হবে, প্রত্যেকের সম্মতিসহ]" }} /></p>
        </section>
        <p className="small muted">{tr(ui.consentNote, lang)}</p>
      </div>
    </>
  );
}
