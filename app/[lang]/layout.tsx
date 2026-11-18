import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/bitter/500.css";
import "@fontsource/bitter/600.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-bengali/600.css";
import "@fontsource/noto-serif-bengali/600.css";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { isLocale, locales, tr } from "@/lib/i18n";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

export const dynamicParams = false;

// Runs before the first paint. `js` lets the phone menu hide; `motion` lets sections wait for
// their scroll intro. If the site's script has not started within 2.5s, show everything.
const motionBoot =
  "(function(){var d=document.documentElement;d.classList.add('js','motion');" +
  "setTimeout(function(){if(!window.__ndescMotion)d.classList.remove('motion')},2500)})()";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = isLocale(lang) ? lang : "en";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: tr(site.name, l), template: `%s | ${tr(site.name, l)}` },
    icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg` },
  };
}

export const viewport: Viewport = { themeColor: "#0F1E36", colorScheme: "dark" };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "bn" ? "bn" : "en"} data-lang={lang}>
      <head>
        {/* Lets the CSS hide the phone menu only when the menu button can work. */}
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {tr(ui.skip, lang)}
        </a>
        <Header lang={lang} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer lang={lang} />
        <Motion />
      </body>
    </html>
  );
}
