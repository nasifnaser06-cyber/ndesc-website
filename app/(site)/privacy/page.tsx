import { type Locale, tr } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { ui } from "@/content/ui";
import { site } from "@/content/site";
import { PageHead, T } from "@/components/bits";

const title = { en: "Privacy", bn: "গোপনীয়তা" };
const lead = { en: "What this site collects and how students are protected.", bn: "এই সাইট কী তথ্য নেয় আর শিক্ষার্থীদের সুরক্ষা কীভাবে হয়।" };

export async function generateMetadata() {
  const lang: Locale = "en";
  return meta(lang, "/privacy", title, lead);
}

export default async function Privacy() {
  const lang: Locale = "en";
  const en = lang === "en";
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <article className="wrap prose">
        <p>{en ? "This website does not use cookies, tracking or advertising. The map at the bottom of each page comes from Google Maps, which may set its own cookies when it loads." : "এই ওয়েবসাইট কুকি, ট্র্যাকিং বা বিজ্ঞাপন ব্যবহার করে না। প্রতিটি পাতার নিচের মানচিত্রটি গুগল ম্যাপস থেকে আসে, যা লোড হওয়ার সময় নিজের কুকি রাখতে পারে।"}</p>
        <p>{en ? "If you send a message or register through a linked form, your details go only to the club and are used only to reply or to run the event you signed up for." : "লিংক করা ফর্মে বার্তা পাঠালে বা নিবন্ধন করলে আপনার তথ্য শুধু ক্লাবের কাছে যায়, আর শুধু উত্তর দেওয়া বা সংশ্লিষ্ট আয়োজন পরিচালনায় ব্যবহার হয়।"}</p>
        <p>{tr(ui.consentNote, lang)}</p>
        <p>
          {en ? "For any privacy request, email " : "গোপনীয়তা বিষয়ে যেকোনো অনুরোধে ইমেইল করুন "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.{" "}
          <T lang={lang} text={{ en: "[How long form answers are kept]", bn: "[ফর্মের তথ্য কতদিন রাখা হয়]" }} />
        </p>
      </article>
    </>
  );
}
