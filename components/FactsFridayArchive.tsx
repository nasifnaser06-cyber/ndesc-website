"use client";

import Link from "next/link";
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

/** FactsFriday list with a search box, a category filter and a year filter. The full list is in the
    page HTML, so it works without JavaScript; the filters only hide cards. */
export default function FactsFridayArchive({ items, categories, years }: { items: FactsCard[]; categories: { key: string; label: string }[]; years: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [year, setYear] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = useMemo(
    () => items.filter((f) => (!cat || f.category === cat) && (!year || f.year === year) && words.every((w) => f.haystack.includes(w))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, cat, year, q],
  );

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
      {shown.length === 0 ? (
        <p className="empty">No posts match that search. Try another word, or clear the filters.</p>
      ) : (
        <ul className="ff-grid">
          {shown.map((f) => (
            <li key={f.slug}>
              <Link className="ff-card" href={f.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} srcSet={f.img2x ? `${f.img} 1x, ${f.img2x} 2x` : undefined} alt="" width={400} height={400} loading="lazy" decoding="async" />
                <span className="ff-meta"><span>{f.categoryLabel}</span><span aria-hidden="true">·</span><time dateTime={f.date}>{f.dateLabel}</time></span>
                <h3>{f.title}</h3>
                <p>{f.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
