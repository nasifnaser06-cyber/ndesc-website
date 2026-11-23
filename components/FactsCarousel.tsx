"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FactsCard } from "@/lib/factsCards";

/*
 * FactsFriday carousel: one horizontal strip, newest first, centred card in front.
 *
 * Baseline: native horizontal scrolling with CSS scroll snapping, so swipes, trackpads and links work
 * even before (or without) this script. Depth: where the browser has scroll-driven animations, CSS
 * scales and stacks each card from its distance to the centre (globals.css, "FactsFriday carousel");
 * elsewhere this script does the same on scroll. Cards are only ever scaled, never rotated.
 * This script adds: the settled active post and its caption, mouse dragging, previous/next buttons,
 * arrow keys, click-to-centre, and an announcement once a card settles.
 */

// Was the last navigation a browser Back/Forward? (Set before Next renders the new page.)
let lastHistoryNav = 0;
if (typeof window !== "undefined") window.addEventListener("popstate", () => { lastHistoryNav = Date.now(); });
export function cameByHistory(): boolean {
  return Date.now() - lastHistoryNav < 4000;
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cssDepth = () =>
  typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()") && document.documentElement.dataset.fcJs !== "1";

/** Resolves once a selector exists. setTimeout, not requestAnimationFrame: frames pause while a view transition waits. */
function waitFor(sel: string, ms = 3000): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => (document.querySelector(sel) || performance.now() - t0 > ms ? resolve() : setTimeout(tick, 16));
    tick();
  });
}

type Props = {
  items: FactsCard[];
  /** The post to centre. When it changes from outside (filters, restoring), the strip jumps to it without animating. */
  activeSlug?: string;
  /** Called once a new post has settled in the centre. */
  onActiveChange?: (slug: string) => void;
  /** Called just before the centred post's article opens. */
  onOpen?: (slug: string) => void;
  label: string;
  compact?: boolean;
  /** Card-to-post flight (view transitions) when the centred picture is clicked. */
  flight?: boolean;
  headingLevel?: 2 | 3;
};

export default function FactsCarousel({ items, activeSlug, onActiveChange, onOpen, label, compact = false, flight = false, headingLevel = 2 }: Props) {
  const router = useRouter();
  const track = useRef<HTMLUListElement>(null);
  const slideEls = useRef<(HTMLLIElement | null)[]>([]);
  const titleEl = useRef<HTMLHeadingElement>(null);
  const wanted = Math.max(0, items.findIndex((x) => x.slug === activeSlug));
  const [active, setActive] = useState(wanted);
  const [enhanced, setEnhanced] = useState(false);
  const [announce, setAnnounce] = useState("");
  const s = useRef({
    pos: [] as number[], width: 0, step: 1, active: wanted, target: -1, scrolling: false, raf: 0, timer: 0,
    jsDepth: false, reduce: false, down: false, dragging: false, suppress: false, startX: 0, startLeft: 0,
    samples: [] as { x: number; t: number }[], items: null as FactsCard[] | null,
  });
  const cb = useRef({ onActiveChange, onOpen });
  cb.current = { onActiveChange, onOpen };

  const measure = () => {
    const t = track.current;
    if (!t) return;
    s.current.pos = slideEls.current.slice(0, items.length).map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0));
    s.current.width = t.clientWidth;
    s.current.step = s.current.pos.length > 1 ? s.current.pos[1] - s.current.pos[0] : 1;
  };
  const leftFor = (i: number) => (s.current.pos[i] ?? 0) - s.current.width / 2;
  const nearest = (center: number) => {
    let best = 0, d = Infinity;
    s.current.pos.forEach((p, i) => { const k = Math.abs(p - center); if (k < d) { d = k; best = i; } });
    return best;
  };

  /** JS depth for browsers without scroll-driven animations: same curve as the CSS keyframes. */
  const paint = () => {
    s.current.raf = 0;
    const t = track.current;
    if (!t || !s.current.jsDepth) return;
    const center = t.scrollLeft + s.current.width / 2;
    slideEls.current.slice(0, items.length).forEach((el, i) => {
      if (!el) return;
      const d = Math.abs((s.current.pos[i] ?? 0) - center) / s.current.step;
      const scale = d <= 1 ? 1 - 0.2 * d : d <= 2 ? 0.8 - 0.16 * (d - 1) : 0.64;
      const dim = d <= 1 ? 0.3 * d : d <= 2 ? 0.3 + 0.25 * (d - 1) : 0.55;
      const card = el.firstElementChild as HTMLElement | null;
      if (card) { card.style.transform = `scale(${scale.toFixed(4)})`; card.style.setProperty("--fc-dim", dim.toFixed(3)); }
      el.style.zIndex = String(100 - Math.round(Math.min(d, 3) * 33));
    });
  };

  const settle = () => {
    const st = s.current, t = track.current;
    if (!t || st.dragging || st.down) return;
    st.scrolling = false;
    st.target = -1;
    t.classList.remove("is-dragging");
    const i = nearest(t.scrollLeft + st.width / 2);
    if (i !== st.active) {
      st.active = i;
      setActive(i);
      const it = items[i];
      if (it) {
        setAnnounce(`${it.title}, post ${i + 1} of ${items.length}`);
        cb.current.onActiveChange?.(it.slug);
      }
    }
  };

  const go = (i: number, smooth = true) => {
    const t = track.current;
    if (!t || !items.length) return;
    const k = Math.max(0, Math.min(items.length - 1, i));
    s.current.target = k;
    const left = leftFor(k);
    if (Math.abs(t.scrollLeft - left) < 1) { settle(); return; }
    s.current.scrolling = true;
    t.scrollTo({ left, behavior: smooth && !s.current.reduce ? "smooth" : "instant" });
  };
  const base = () => (s.current.target >= 0 ? s.current.target : s.current.active);

  // Jump (no animation) to the wanted post whenever the list or the wanted post changes from outside.
  useLayoutEffect(() => {
    const t = track.current;
    if (!t) return;
    measure();
    const listChanged = s.current.items !== items;
    s.current.items = items;
    if (listChanged || wanted !== s.current.active) {
      t.scrollTo({ left: leftFor(wanted), behavior: "instant" });
      s.current.active = wanted;
      s.current.target = -1;
      setActive(wanted);
    }
    if (s.current.jsDepth) paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, wanted]);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const st = s.current;
    st.jsDepth = !cssDepth();
    st.reduce = reducedMotion();
    t.classList.toggle("fc-jsdepth", st.jsDepth && !st.reduce);
    setEnhanced(true);
    const hasScrollEnd = "onscrollend" in window;
    const onScroll = () => {
      st.scrolling = true;
      if (st.jsDepth && !st.reduce && !st.raf) st.raf = requestAnimationFrame(paint);
      if (!hasScrollEnd) { clearTimeout(st.timer); st.timer = window.setTimeout(settle, 140); }
    };
    const onEnd = () => settle();
    t.addEventListener("scroll", onScroll, { passive: true });
    t.addEventListener("scrollend", onEnd);
    // Keep the active post centred when the window or the strip changes size.
    const ro = new ResizeObserver(() => {
      measure();
      t.scrollTo({ left: leftFor(st.active), behavior: "instant" });
      if (st.jsDepth) paint();
    });
    ro.observe(t);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => { st.reduce = mq.matches; t.classList.toggle("fc-jsdepth", st.jsDepth && !st.reduce); measure(); t.scrollTo({ left: leftFor(st.active), behavior: "instant" }); };
    mq.addEventListener("change", onMq);
    if (st.jsDepth) paint();
    return () => {
      t.removeEventListener("scroll", onScroll);
      t.removeEventListener("scrollend", onEnd);
      ro.disconnect();
      mq.removeEventListener("change", onMq);
      clearTimeout(st.timer);
      cancelAnimationFrame(st.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse dragging (touch and trackpads scroll natively).
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    const st = s.current;
    st.down = true; st.dragging = false; st.startX = e.clientX; st.startLeft = track.current.scrollLeft;
    st.samples = [{ x: e.clientX, t: e.timeStamp }];
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const st = s.current, t = track.current;
    if (!st.down || !t) return;
    const dx = e.clientX - st.startX;
    if (!st.dragging && Math.abs(dx) > 5) {
      st.dragging = true;
      t.setPointerCapture(e.pointerId);
      t.classList.add("is-dragging"); // snapping off while the strip follows the mouse
    }
    if (st.dragging) {
      t.scrollLeft = st.startLeft - dx;
      st.samples.push({ x: e.clientX, t: e.timeStamp });
      if (st.samples.length > 6) st.samples.shift();
    }
  };
  const onPointerUp = () => {
    const st = s.current, t = track.current;
    if (!st.down || !t) return;
    st.down = false;
    if (!st.dragging) return;
    st.dragging = false;
    st.suppress = true; // the click that follows a drag must not open anything
    window.setTimeout(() => { st.suppress = false; }, 80);
    const a = st.samples[0], b = st.samples[st.samples.length - 1];
    const v = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px per ms, positive = dragged right
    const projected = t.scrollLeft + st.width / 2 - v * 180;
    go(nearest(projected));
  };

  const onCardClick = (e: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    const st = s.current;
    if (st.suppress) { e.preventDefault(); return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // new tab or window: normal link
    if (i !== st.active || st.scrolling) { e.preventDefault(); go(i); return; }
    const it = items[i];
    cb.current.onOpen?.(it.slug);
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };
    if (flight && e.detail > 0 && doc.startViewTransition && !st.reduce) {
      e.preventDefault();
      const img = e.currentTarget.querySelector("img") as HTMLElement | null;
      if (img) img.style.viewTransitionName = "ff-cover";
      if (titleEl.current) titleEl.current.style.viewTransitionName = "ff-title";
      document.documentElement.classList.add("ff-flying");
      const tr = doc.startViewTransition(async () => {
        router.push(it.href);
        await waitFor(".ff-article .ff-pic img");
        window.scrollTo(0, 0);
      });
      tr.finished.finally(() => document.documentElement.classList.remove("ff-flying"));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(base() + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(base() - 1); }
  };

  const cur = items[Math.min(active, items.length - 1)];
  const H = headingLevel === 3 ? "h3" : "h2";
  if (!cur) return null;

  return (
    <div className={`fc${compact ? " fc-compact" : ""}${enhanced ? " is-enhanced" : ""}`} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown}>
      <ul
        ref={track}
        className="fc-track"
        tabIndex={0}
        aria-label={`${label}. Use the left and right arrow keys to move between posts.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => { if (s.current.suppress) { e.preventDefault(); e.stopPropagation(); } }}
        onDragStart={(e) => e.preventDefault()}
      >
        {items.map((f, i) => (
          <li key={f.slug} ref={(el) => { slideEls.current[i] = el; }} className={`fc-slide${i === active ? " is-active" : ""}`}>
            <Link
              href={f.href}
              className="fc-card"
              prefetch={false}
              draggable={false}
              tabIndex={enhanced ? -1 : undefined}
              aria-label={i === active || !enhanced ? f.title : `Show ${f.title}`}
              onClick={(e) => onCardClick(e, i)}
            >
              <span className="fc-frame">
                {f.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.img}
                    srcSet={f.img2x ? `${f.img} 400w, ${f.img2x} 800w` : undefined}
                    sizes={compact ? "(max-width: 600px) 52vw, 240px" : "(max-width: 600px) 80vw, 560px"}
                    alt=""
                    width={400}
                    height={400}
                    draggable={false}
                    loading={Math.abs(i - wanted) <= 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : (
                  <span className="fc-fallback">{f.title}</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="fc-controls">
          <button type="button" className="fc-btn" aria-label="Newer post" disabled={active <= 0} onClick={() => go(base() - 1)}>
            <span aria-hidden="true">‹</span>
          </button>
          <span className="fc-pos" aria-hidden="true">{active + 1} / {items.length}</span>
          <button type="button" className="fc-btn" aria-label="Older post" disabled={active >= items.length - 1} onClick={() => go(base() + 1)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}

      <div className="fc-caption">
        <div key={cur.slug} className="fc-caption-inner">
          <p className="fc-meta"><span>{cur.categoryLabel}</span><span aria-hidden="true"> · </span><time dateTime={cur.date}>{cur.dateLabel}</time></p>
          <H className="fc-title" ref={titleEl}>{cur.title}</H>
          <p className="fc-teaser">{cur.summary}</p>
          <Link className="btn btn-secondary btn-small fc-read" href={cur.href} onClick={() => cb.current.onOpen?.(cur.slug)}>
            Read the post<span className="visually-hidden">: {cur.title}</span>
          </Link>
        </div>
      </div>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">{announce}</p>
    </div>
  );
}
