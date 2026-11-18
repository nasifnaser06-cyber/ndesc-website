import type { Metadata } from "next";

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Notre Dame Eco and Space Club",
  description: "The Notre Dame Eco and Space Club at Notre Dame College, Dhaka, since 1992.",
  robots: { index: false },
};

// GitHub Pages serves static files only, so the root page sends visitors on to the English site.
export default function RootRedirect() {
  const script = `location.replace(${JSON.stringify(bp + "/en/")});`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${bp}/en/`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="wrap redirect-note">
        <p>
          <a href={`${bp}/en/`}>Notre Dame Eco and Space Club</a>
        </p>
      </div>
    </>
  );
}
