import Link from "next/link";
import { type Locale, tr, path } from "@/lib/i18n";
import { meta } from "@/lib/view";
import { galleryAlbums } from "@/content/club";
import { ui } from "@/content/ui";
import { PageHead, PhotoSlot } from "@/components/bits";

type Props = { params: Promise<{ lang: Locale }> };
const title = { en: "Gallery", bn: "গ্যালারি" };
const lead = { en: "Photos from summits, camps and nights under the sky.", bn: "সামিট, ক্যাম্প আর আকাশের নিচের রাতগুলোর ছবি।" };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return meta(lang, "/gallery", title, lead);
}

export default async function Gallery({ params }: Props) {
  const { lang } = await params;
  const en = lang === "en";
  const albums = [...galleryAlbums].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHead lang={lang} title={title} lead={lead} />
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "var(--s6)" }}>
        <div className="grid-3">
          {albums.map((a) => (
            <div key={a.title.en} className="stack" style={{ gap: "var(--s2)" }}>
              <PhotoSlot lang={lang} label={{ en: "album cover", bn: "অ্যালবামের কভার" }} />
              <h3>{tr(a.title, lang)}</h3>
              <p className="small muted">{a.photos.length === 0 ? (en ? "Photos coming soon" : "ছবি শিগগিরই") : `${a.photos.length}`}</p>
            </div>
          ))}
        </div>
        <p className="small muted">
          {tr(ui.consentNote, lang)} <Link href={path(lang, "/contact")}>{tr(ui.nav.contact, lang)}</Link>
        </p>
      </div>
    </>
  );
}
