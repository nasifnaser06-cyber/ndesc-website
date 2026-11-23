"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type FactsCard = {
  slug: string;
  href: string;
  title: string;
  date: string;
  dateLabel: string;
  year: string;
  category: string;
  categoryLabel: string;
  summary: string;
  img: string;
  img2x?: string;
  /** Lower-case text the search looks through (title, topic, category, year, opening of the post). */
  haystack: string;
};

/** Waits until a selector exists. setTimeout, not requestAnimationFrame: frames pause while a view transition waits. */
function waitFor(sel: string, ms = 3000): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => {
      if (document.querySelector(sel) || performance.now() - t0 > ms) resolve();
      else setTimeout(tick, 16);
    };
    tick();
  });
}

/** FactsFriday list with a search box, a category filter and a year filter. The full list is in the
    page HTML, so it works without JavaScript; the filters only hide cards.
    Opening a card plays the card-to-post flight where the browser has view transitions
    (Chrome, Edge, Safari); elsewhere, or with reduced motion, it is a normal link. */
export default function FactsFridayArchive({ items, categories, years }: { items: FactsCard[]; categories: { key: string; label: string }[]; years: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [year, setYear] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = useMemo(
    () => items.filter((f) => (!cat || f.category === cat) && (!year || f.year === year) && words.every((w) => f.haystack.includes(w))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, cat, year, q],
  );

  // The clicked card's picture and title travel into the post page.
  function open(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };
    if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const card = e.currentTarget;
    const img = card.querySelector("img") as HTMLElement | null;
    const h3 = card.querySelector("h3") as HTMLElement | null;
    if (img) img.style.viewTransitionName = "ff-cover";
    if (h3) h3.style.viewTransitionName = "ff-title";
    document.documentElement.classList.add("ff-flying");
    const t = doc.startViewTransition(async () => {
      router.push(href);
      await waitFor(".ff-article .ff-pic img");
      window.scrollTo(0, 0);
    });
    t.finished.finally(() => document.documentElement.classList.remove("ff-flying"));
  }

  return (
    <>
      <div className="ff-tools" role="search">
        <label className="visually-hidden" htmlFor="ff-q">Search FactsFriday</label>
        <input id="ff-q" type="search" placeholder="Search by topic, title or year" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        <label className="visually-hidden" htmlFor="ff-cat">Category</label>
        <select id="ff-cat" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="ff-year">Year</label>
        <select id="ff-year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p className="ff-count" aria-live="polite">
        {shown.length === items.length ? `${items.length} posts` : `${shown.length} of ${items.length} posts`}
      </p>
      <div className="ff-grid-wrap">
        {shown.length === 0 ? (
          <p className="empty">No posts match that search. Try another word, or clear the filters.</p>
        ) : (
          <ul className="ff-grid">
            {shown.map((f, i) => (
              <li key={f.slug}>
                <Link className="ff-card" href={f.href} onClick={(e) => open(e, f.href)}>
                  <span className="ff-pic">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img} srcSet={f.img2x ? `${f.img} 1x, ${f.img2x} 2x` : undefined} alt="" width={400} height={400} loading={i < 8 ? "eager" : "lazy"} decoding="async" />
                  </span>
                  <span className="ff-text">
                    <span className="ff-meta"><span className="ff-cat">{f.categoryLabel}</span><span aria-hidden="true">·</span><time dateTime={f.date}>{f.dateLabel}</time></span>
                    <h3>{f.title}</h3>
                    <p>{f.summary}</p>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
