import type { Metadata } from "next";
import { path } from "@/lib/i18n";
import { sitePages } from "@/lib/pages";

// Until 20 Nov 2026 every page lived under /en/ (ndesc.com/en/ness/). The pages now live at
// the root (ndesc.com/ness/). GitHub Pages serves static files only, so each old /en/ address
// is a small page that forwards to the new one and tells search engines where it went.
type Props = { params: Promise<{ rest?: string[] }> };

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "").replace(/\/+$/, "");

export const dynamicParams = false;

export function generateStaticParams() {
  return sitePages().map((p) => ({ rest: p ? p.split("/") : [] }));
}

async function target(params: Props["params"]) {
  const { rest } = await params;
  return `${bp}${path("en", rest?.length ? `/${rest.join("/")}` : "/")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const to = await target(params);
  return {
    title: "Notre Dame Eco and Space Club",
    robots: { index: false, follow: true },
    alternates: { canonical: origin ? `${origin}${to}` : to },
  };
}

export default async function OldEnglishAddress({ params }: Props) {
  const to = await target(params);
  const script = `location.replace(${JSON.stringify(to)}+location.search+location.hash);`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="wrap redirect-note">
        <p>
          This page has moved to <a href={to}>{to}</a>.
        </p>
      </div>
    </>
  );
}
