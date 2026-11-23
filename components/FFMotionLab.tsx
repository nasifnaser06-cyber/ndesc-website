"use client";

import { useEffect, useState } from "react";
import { FX_KEY, readFx, reducedMotion } from "@/lib/fx";

/**
 * FactsFriday motion lab (preview only). Every effect stays off unless switched on with
 * ?fx=a,b,c in the address; ?lab=1 shows a small panel to switch them on and replay.
 * The CSS for each effect lives in globals.css under "FactsFriday motion lab", keyed on
 * html[data-fx~="name"], so nothing changes for normal visitors.
 */
export const FX_LIST: { key: string; label: string; page: "archive" | "post" | "both" }[] = [
  { key: "cascade", label: "A1 Cards cascade in", page: "archive" },
  { key: "settle", label: "A2 Picture settle", page: "both" },
  { key: "wipe", label: "A2 Picture wipe", page: "both" },
  { key: "blur", label: "A2 Picture blur to sharp", page: "both" },
  { key: "hover", label: "A3 Hover lift and zoom", page: "archive" },
  { key: "glide", label: "A4 Filter glide", page: "archive" },
  { key: "count", label: "A4 Count rolls", page: "archive" },
  { key: "featured", label: "A5 Featured latest fact", page: "archive" },
  { key: "depth", label: "A6 Depth on scroll", page: "archive" },
  { key: "flight", label: "P1 Card-to-post flight", page: "archive" },
  { key: "paras", label: "P3 Paragraphs appear", page: "post" },
  { key: "progress", label: "P4 Reading progress line", page: "post" },
  { key: "sticky", label: "P5 Sticky picture reacts", page: "post" },
  { key: "direction", label: "P6 Older/newer slide", page: "post" },
  { key: "numbers", label: "P7 Numbers count up", page: "post" },
];

const ROW_GAPS = [0, 70, 125, 170, 205, 235]; // uneven: each later card follows a little sooner

function revealOnView(els: Element[], onIn: (el: HTMLElement, i: number) => void, margin = "0px 0px -8% 0px") {
  const io = new IntersectionObserver((entries) => {
    const fresh = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
    fresh.forEach((el, i) => { onIn(el, i); io.unobserve(el); });
  }, { rootMargin: margin });
  els.forEach((el) => io.observe(el));
  return io;
}

function archiveEffects(fx: Set<string>): () => void {
  const cleanups: (() => void)[] = [];
  const wrap = document.querySelector(".ff-grid-wrap");
  if (!wrap) return () => {};
  const reveal = fx.has("cascade") || fx.has("settle") || fx.has("wipe") || fx.has("blur") || fx.has("featured");

  if (reveal) {
    const cards = () => Array.from(wrap.querySelectorAll<HTMLElement>(".ff-grid > li:not(.in)"));
    const io = revealOnView(cards(), (el) => {
      // Delay by position in its row, so each row arrives as one wave.
      const row = Array.from(el.parentElement!.children).filter((c) => (c as HTMLElement).offsetTop === el.offsetTop);
      const col = row.indexOf(el);
      el.style.setProperty("--fx-d", `${ROW_GAPS[Math.min(col, ROW_GAPS.length - 1)]}ms`);
      el.classList.add("in");
    });
    // Cards that appear later (after a filter change) are shown at once; the glide handles them.
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        const added = n instanceof HTMLLIElement && n.parentElement?.classList.contains("ff-grid") ? [n] : n instanceof HTMLElement && n.matches("ul.ff-grid") ? Array.from(n.children) as HTMLElement[] : [];
        added.forEach((el) => { el.style.setProperty("--fx-d", "0ms"); el.classList.add("in"); });
      }));
    });
    mo.observe(wrap, { childList: true, subtree: true });
    cleanups.push(() => { io.disconnect(); mo.disconnect(); });
  }

  if (fx.has("depth") && window.matchMedia("(min-width: 760px)").matches) {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      wrap.querySelectorAll<HTMLElement>(".ff-pic img").forEach((img) => {
        const r = img.parentElement!.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
        const off = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / mid));
        img.style.setProperty("--py", `${(off * -14).toFixed(1)}px`);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
  }
  return () => cleanups.forEach((c) => c());
}

function countUp(el: HTMLElement) {
  const final = el.textContent || "";
  const m = final.match(/^(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(%?)$/);
  if (!m) return;
  const target = Number((m[1] + (m[2] || "")).replace(/,/g, ""));
  const decimals = m[2] ? m[2].length - 1 : 0;
  const t0 = performance.now(), dur = 1400;
  const fmt = (n: number) => (decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US")) + m[3];
  el.style.minWidth = `${final.length}ch`;
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
    el.textContent = k < 1 ? fmt(target * e) : final;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function postEffects(fx: Set<string>): () => void {
  const cleanups: (() => void)[] = [];
  const body = document.querySelector<HTMLElement>(".ff-body");
  if (!body) return () => {};

  if (fx.has("paras")) {
    const io = revealOnView(Array.from(body.children), (el, i) => { el.style.setProperty("--fx-d", `${i * 90}ms`); el.classList.add("in"); }, "0px 0px -6% 0px");
    cleanups.push(() => io.disconnect());
  }

  if (fx.has("progress")) {
    const bar = document.createElement("div");
    bar.className = "ff-progress";
    bar.setAttribute("aria-hidden", "true");
    const cat = document.querySelector<HTMLElement>(".ff-article")?.dataset.cat || "general";
    bar.dataset.cat = cat;
    document.body.appendChild(bar);
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const done = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - r.top) / Math.max(1, total)));
      bar.style.transform = `scaleX(${done})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => { window.removeEventListener("scroll", onScroll); bar.remove(); });
  }

  if (fx.has("direction")) {
    let dir = "";
    try { dir = sessionStorage.getItem("ndesc-ff-dir") || ""; sessionStorage.removeItem("ndesc-ff-dir"); } catch { /* private mode */ }
    if (dir && !reducedMotion()) {
      const x = dir === "older" ? -70 : 70;
      document.querySelectorAll<HTMLElement>(".page-head > h1, .page-head > .label, .ff-article").forEach((el, i) => {
        el.animate([{ opacity: 0, transform: `translateX(${x}px)` }, { opacity: 1, transform: "none" }], { duration: 560, delay: i * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" });
      });
    }
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("a[data-dir]");
      if (!a) return;
      try { sessionStorage.setItem("ndesc-ff-dir", a.dataset.dir || ""); } catch { /* private mode */ }
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));
  }

  if (fx.has("numbers")) {
    // Wrap figures (not years) in the post text so they can count up when they come into view.
    const nums: HTMLElement[] = [];
    body.querySelectorAll<HTMLElement>(":scope > p").forEach((p) => {
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      const texts: Text[] = [];
      while (walker.nextNode()) texts.push(walker.currentNode as Text);
      texts.forEach((t) => {
        const parts = (t.textContent || "").split(/(\b(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?%?)/);
        if (parts.length < 2) return;
        const frag = document.createDocumentFragment();
        parts.forEach((s, i) => {
          const isNum = i % 2 === 1 && !/^(1[89]|20)\d\d$/.test(s) && Number(s.replace(/[,%]/g, "")) >= 3;
          if (isNum) { const span = document.createElement("span"); span.className = "ff-num"; span.textContent = s; nums.push(span); frag.appendChild(span); }
          else frag.appendChild(document.createTextNode(s));
        });
        t.replaceWith(frag);
      });
    });
    if (!reducedMotion()) {
      const io = revealOnView(nums, (el) => countUp(el), "0px 0px -15% 0px");
      cleanups.push(() => io.disconnect());
    }
  }
  return () => cleanups.forEach((c) => c());
}

export default function FFMotionLab({ page }: { page: "archive" | "post" }) {
  const [fx, setFx] = useState<Set<string> | null>(null);
  const [lab, setLab] = useState(false);

  useEffect(() => {
    const f = readFx();
    setFx(f);
    document.documentElement.dataset.fx = [...f].join(" ");
    let showLab = false;
    try {
      const q = new URLSearchParams(window.location.search).get("lab");
      if (q !== null) sessionStorage.setItem("ndesc-ff-lab", q === "0" ? "" : "1");
      showLab = !!sessionStorage.getItem("ndesc-ff-lab");
    } catch { /* private mode */ }
    setLab(showLab);
    const off = reducedMotion() && !f.has("numbers") ? () => {} : page === "archive" ? archiveEffects(f) : postEffects(f);
    return () => { off(); };
  }, [page]);

  if (!lab || !fx) return null;

  const apply = (next: Set<string>) => {
    const v = [...next].join(",");
    try { sessionStorage.setItem(FX_KEY, v); } catch { /* private mode */ }
    const url = new URL(window.location.href);
    url.searchParams.set("fx", v || "none");
    window.location.href = url.toString();
  };

  return (
    <aside className="ff-lab" aria-label="Motion preview panel">
      <p><b>Motion preview</b> · tick effects, the page reloads to replay</p>
      <div className="ff-lab-list">
        {FX_LIST.map((o) => (
          <label key={o.key} className={o.page !== "both" && o.page !== page ? "ff-lab-other" : undefined}>
            <input type="checkbox" checked={fx.has(o.key)} onChange={(e) => { const n = new Set(fx); if (e.target.checked) n.add(o.key); else n.delete(o.key); apply(n); }} /> {o.label}
          </label>
        ))}
      </div>
      <p className="ff-lab-actions">
        <button type="button" onClick={() => window.location.reload()}>Replay</button>
        <button type="button" onClick={() => apply(new Set())}>All off</button>
      </p>
    </aside>
  );
}
