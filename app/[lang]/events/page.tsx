import { type Locale, tr } from "@/lib/i18n";
import { meta, eventRow, eventLabels } from "@/lib/view";
import { sortedEvents, eventTypes } from "@/content/events";
import { PageHead } from "@/components/bits";
import { FilteredEvents } from "@/components/EventList";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "Events", bn: "ইভেন্ট" };
const lead = {
  en: "Summits, festivals, camps and workshops, from the next one back to the early years.",
  bn: "সামিট, উৎসব, ক্যাম্প আর কর্মশালা, আসন্ন আয়োজন থেকে শুরুর দিনগুলো পর্যন্ত।",
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/events", title, lead);
}

export default async function Events({ params }: Props) {
  const { lang } = await params;
  const items = sortedEvents().map((e) => eventRow(e, lang));
  const types = Object.entries(eventTypes)
    .filter(([key]) => items.some((i) => i.type === key))
    .map(([key, label]) => ({ key, label: tr(label, lang) }));
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap">
        <FilteredEvents items={items} labels={eventLabels(lang)} types={types} />
      </div>
    </>
  );
}
