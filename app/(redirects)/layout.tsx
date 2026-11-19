import "../globals.css";

// Layout for the small forwarding pages (old /en/ addresses).
export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
