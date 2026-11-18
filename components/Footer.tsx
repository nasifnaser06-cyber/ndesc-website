import Link from "next/link";
import { type Locale, tr, path } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { site } from "@/content/site";

export default function Footer({ lang }: { lang: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <p className="footer-name">{tr(site.name, lang)}</p>
          <p className="small muted">{tr(ui.founded, lang)}</p>
          <p className="small muted">{tr(site.address, lang)}</p>
        </div>
        <div>
          <p className="label">{tr(ui.explore, lang)}</p>
          <ul>
            <li><Link href={path(lang, "/about")}>{tr(ui.nav.about, lang)}</Link></li>
            <li><Link href={path(lang, "/panel")}>{tr(ui.nav.panel, lang)}</Link></li>
            <li><Link href={path(lang, "/events")}>{tr(ui.nav.events, lang)}</Link></li>
            <li><Link href={path(lang, "/resources")}>{tr(ui.nav.resources, lang)}</Link></li>
          </ul>
        </div>
        <div>
          <p className="label">{tr(ui.takePart, lang)}</p>
          <ul>
            <li><Link href={path(lang, "/ness")}>{tr(ui.nav.ness, lang)}</Link></li>
            <li><Link href={path(lang, "/join")}>{tr(ui.nav.join, lang)}</Link></li>
            <li><Link href={path(lang, "/contact")}>{tr(ui.nav.contact, lang)}</Link></li>
          </ul>
        </div>
        <div>
          <p className="label">{tr(ui.follow, lang)}</p>
          <ul>
            <li><a href={site.social.facebook} rel="noopener">Facebook</a></li>
            <li><a href={site.social.instagram} rel="noopener">Instagram</a></li>
            {site.email && (
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="wrap footer-base">
        <p className="small muted">© {year} {tr(site.name, lang)}</p>
        <p className="small"><Link href={path(lang, "/privacy")}>{tr(ui.nav.privacy, lang)}</Link></p>
      </div>
    </footer>
  );
}
