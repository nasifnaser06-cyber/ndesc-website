"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFx, reducedMotion } from "@/lib/fx";

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

type Filters = { q: string; cat: string; year: string };

function filterItems(items: FactsCard[], { q, cat, year }: Filters) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter((f) => (!cat || f.category === cat) && (!year || f.year === year) && words.every((w) => f.haystack.includes(w)));
}

/** Waits until a selector exists (used by the card-to-post flight). */
function waitFor(sel: string, ms = 3000): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    // setTimeout, not requestAnimationFrame: frames are paused while a view transition waits.
    const tick = () => {
      if (document.querySelector(sel) || performance.now() - t0 > ms) resolve();
      else setTimeout(tick, 16);
    };
    tick();
  });
}

/** FactsFriday list with a search box, a category filter and a year filter. The full list is in the
    page HTML, so it works without JavaScript; the filters only hide cards.
    Motion lab effects (only when switched on with ?fx=..., see lib/fx.ts): glide, count, featured, flight. */
export default function FactsFridayArchive({ items, categories, years }: { items: FactsCard[]; categories: { key: string; label: string }[]; years: string[] }) {
  const fx = useFx();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({ q: "", cat: "", year: "" });
  const shown = useMemo(() => filterItems(items, filters), [items, filters]);
  const filtered = !!(filters.q || filters.cat || filters.year);

  const gridWrap = useRef<HTMLDivElement>(null);
  const cardEls = useRef(new Map<string, HTMLLIElement>());
  const before = useRef(new Map<string, DOMRect>());

  // Glide: remember where every card is, make leaving cards fade out where they stood, then let
  // the remaining cards travel from their old place to the new one (FLIP).
  function change(next: Partial<Filters>) {
    const nf = { ...filters, ...next };
    if (fx.has("glide") && !reducedMotion() && gridWrap.current) {
      const wrapBox = gridWrap.current.getBoundingClientRect();
      const keep = new Set(filterItems(items, nf).map((f) => f.slug));
      before.current = new Map();
      cardEls.current.forEach((el, slug) => {
        const r = el.getBoundingClientRect();
        before.current.set(slug, r);
        if (!keep.has(slug)) {
          const ghost = el.cloneNode(true) as HTMLElement;
          ghost.classList.add("ff-ghost");
          Object.assign(ghost.style, { position: "absolute", left: `${r.left - wrapBox.left}px`, top: `${r.top - wrapBox.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: "0", listStyle: "none", pointerEvents: "none" });
          gridWrap.current!.appendChild(ghost);
          ghost.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.94)" }], { duration: 280, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }).finished.then(() => ghost.remove());
        }
      });
    }
    setFilters(nf);
  }

  useLayoutEffect(() => {
    if (!fx.has("glide") || before.current.size === 0) return;
    let i = 0;
    cardEls.current.forEach((el, slug) => {
      const old = before.current.get(slug);
      const now = el.getBoundingClientRect();
      if (old) {
        const dx = old.left - now.left, dy = old.top - now.top;
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      } else {
        el.animate([{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 120 + Math.min(i++, 8) * 40, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" });
      }
    });
    before.current = new Map();
  }, [shown, fx]);

  // Count: the number rolls from the old total to the new one.
  const [shownCount, setShownCount] = useState(shown.length);
  const lastCount = useRef(shown.length);
  useEffect(() => {
    const from = lastCount.current, to = shown.length;
    lastCount.current = to;
    if (!fx.has("count") || reducedMotion() || from === to) { setShownCount(to); return; }
    const t0 = performance.now(), dur = 600;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      setShownCount(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown.length, fx]);

  // Flight: the clicked card's picture and title travel into the post page (View Transitions).
  function open(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
    if (!fx.has("flight") || !doc.startViewTransition || reducedMotion() || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const card = e.currentTarget;
    const img = card.querySelector("img") as HTMLElement | null;
    const h3 = card.querySelector("h3") as HTMLElement | null;
    if (img) img.style.viewTransitionName = "ff-cover";
    if (h3) h3.style.viewTransitionName = "ff-title";
    document.documentElement.classList.add("ff-flying");
    const t = doc.startViewTransition(async () => {
      router.push(href);
      await waitFor(".ff-article figure img");
      window.scrollTo(0, 0);
    }) as { finished: Promise<void> };
    t.finished.finally(() => document.documentElement.classList.remove("ff-flying"));
  }

  const featured = fx.has("featured") && !filtered;
  const label = shown.length === items.length && !filtered ? `${shownCount} posts` : `${shownCount} of ${items.length} posts`;

  return (
    <>
      <div className="ff-tools" role="search">
        <label className="visually-hidden" htmlFor="ff-q">Search FactsFriday</label>
        <input id="ff-q" type="search" placeholder="Search by topic, title or year" value={filters.q} onChange={(e) => change({ q: e.target.value })} autoComplete="off" />
        <label className="visually-hidden" htmlFor="ff-cat">Category</label>
        <select id="ff-cat" value={filters.cat} onChange={(e) => change({ cat: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="ff-year">Year</label>
        <select id="ff-year" value={filters.year} onChange={(e) => change({ year: e.target.value })}>
          <option value="">All years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <p className="ff-count" aria-live="polite">{label}</p>
      <div className="ff-grid-wrap" ref={gridWrap}>
        {shown.length === 0 ? (
          <p className="empty ff-empty">No posts match that search. Try another word, or clear the filters.</p>
        ) : (
          <ul className="ff-grid">
            {shown.map((f, i) => (
              <li
                key={f.slug}
                className={featured && i === 0 ? "ff-featured" : undefined}
                ref={(el) => { if (el) cardEls.current.set(f.slug, el); else cardEls.current.delete(f.slug); }}
              >
                <Link className="ff-card" href={f.href} onClick={(e) => open(e, f.href)}>
                  <span className="ff-pic">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured && i === 0 && f.img2x ? f.img2x : f.img} srcSet={f.img2x ? `${f.img} 1x, ${f.img2x} 2x` : undefined} alt="" width={400} height={400} loading={i < 8 ? "eager" : "lazy"} decoding="async" />
                  </span>
                  <span className="ff-text">
                    {featured && i === 0 && <span className="ff-latest">Latest fact</span>}
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
