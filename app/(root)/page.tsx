import type { Metadata } from "next";

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Notre Dame Eco and Space Club",
  description: "The Notre Dame Eco and Space Club at Notre Dame College, Dhaka, since 1992.",
  robots: { index: false },
};

// GitHub Pages serves static files only, so the root page sends visitors on to a language.
// Bangla-language browsers go to /bn/, everyone else to /en/.
export default function RootRedirect() {
  const script = `(function(){var b=${JSON.stringify(bp)};var l=(navigator.languages||[navigator.language||""]).join(",").toLowerCase();location.replace(b+(/(^|,)bn/.test(l)?"/bn/":"/en/"));})();`;
  return (
    <>
      <meta httpEquiv="refresh" content={`2; url=${bp}/en/`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="wrap redirect-note">
        <p>
          <a href={`${bp}/en/`}>Notre Dame Eco and Space Club: English</a>
        </p>
        <p lang="bn">
          <a href={`${bp}/bn/`}>নটর ডেম ইকো অ্যান্ড স্পেস ক্লাব: বাংলা</a>
        </p>
      </div>
    </>
  );
}
