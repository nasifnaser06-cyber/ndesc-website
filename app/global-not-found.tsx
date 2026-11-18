import type { Metadata } from "next";
import "@fontsource/bitter/600.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "./globals.css";

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = { title: "Page not found | Notre Dame Eco and Space Club" };

// The Bangla pages were taken off on 18 Nov 2026. Old /bn/ links go to the same page in English.
const forwardBangla = `(function(){var b=${JSON.stringify(bp)};var p=location.pathname;if(p.indexOf(b+"/bn")===0){location.replace(b+"/en"+p.slice(b.length+3)+location.search+location.hash);}})();`;

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: forwardBangla }} />
      </head>
      <body>
        <main className="wrap not-found">
          <p className="label">404</p>
          <h1>Lost in space</h1>
          <p className="lead">We could not find that page. It may have moved.</p>
          <p className="actions">
            <a className="btn" href={`${bp}/en/`}>Back to the home page</a>
          </p>
        </main>
      </body>
    </html>
  );
}
