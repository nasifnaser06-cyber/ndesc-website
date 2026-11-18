import type { Metadata } from "next";
import "@fontsource/bitter/600.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/noto-sans-bengali/400.css";
import "./globals.css";

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = { title: "Page not found | Notre Dame Eco and Space Club" };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="wrap not-found">
          <p className="label">404</p>
          <h1>Lost in space</h1>
          <p className="lead">We could not find that page. It may have moved.</p>
          <p lang="bn" className="lead">পাতাটি খুঁজে পাওয়া যায়নি। হয়তো সরানো হয়েছে।</p>
          <p className="actions">
            <a className="btn" href={`${bp}/en/`}>Back to the home page</a>
            <a className="btn btn-secondary" href={`${bp}/bn/`} lang="bn">হোম পেজে ফিরে যান</a>
          </p>
        </main>
      </body>
    </html>
  );
}
