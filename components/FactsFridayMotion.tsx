"use client";

import { useEffect } from "react";

/**
 * FactsFriday motion, Apple style (rion-motion-web Part 2; Mahmud picked the "Apple style" package, 23 Nov 2026).
 * Archive: cards rise 30px and fade in, 0.15s apart in each row, once they reach 85% of the screen;
 *          a slim bar with a Search button slides down once the page title has left the screen.
 * Post:    the same slide-down bar with the post title and "Next fact";
 *          the paragraph in the middle of the screen is full strength, the others fade back (pinned story);
 *          arrow buttons for the "More FactsFriday" swipe row.
 * The scroll-linked heading, quiet hover and press, and the card-to-post flight are in CSS and
 * FactsFridayArchive. Styles: "FactsFriday motion" in globals.css.
 */
const ROW_GAPS = [0, 150, 300, 450, 600, 750]; // Apple's even 0.15s steps

function revealCards(): () => void {
  const grid = document.querySelector(".ff-grid-wrap");
  if (!grid || !("IntersectionObserver" in window)) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      const row = Array.from(el.parentElement!.children).filter((c) => (c as HTMLElement).offsetTop === el.offsetTop);
      el.style.setProperty("--ff-d", `${ROW_GAPS[Math.min(row.indexOf(el), ROW_GAPS.length - 1)]}ms`);
      el.classList.add("in");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -15% 0px" });
  const watch = () => grid.querySelectorAll<HTMLElement>(".ff-grid > li:not(.in)").forEach((el) => io.observe(el));
  watch();
  // Cards that come back after a search or filter appear at once.
  const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => {
    const added = n instanceof HTMLLIElement ? [n] : n instanceof HTMLElement && n.matches("ul.ff-grid") ? Array.from(n.children) : [];
    added.forEach((el) => { (el as HTMLElement).style.setProperty("--ff-d", "0ms"); el.classList.add("in"); });
  })));
  mo.observe(grid, { childList: true, subtree: true });
  return () => { io.disconnect(); mo.disconnect(); };
}

function subBar(page: "archive" | "post"): () => void {
  const head = document.querySelector(".page-head");
  if (!head || !("IntersectionObserver" in window)) return () => {};
  const bar = document.createElement("div");
  bar.className = "ff-subnav";
  const title = document.createElement("span");
  title.className = "ff-subnav-title";
  title.textContent = page === "post" ? (document.querySelector(".page-head h1")?.textContent || "FactsFriday") : "FactsFriday";
  bar.appendChild(title);
  if (page === "post") {
    const older = document.querySelector<HTMLAnchorElement>('a[data-older]');
    const a = document.createElement("a");
    a.className = "ff-subnav-btn";
    a.href = older ? older.href : (document.querySelector<HTMLAnchorElement>("a[data-all-posts]")?.href || "/factsfriday/");
    a.textContent = older ? "Next fact" : "All posts";
    a.tabIndex = -1;
    bar.appendChild(a);
  } else {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ff-subnav-btn";
    b.textContent = "Search";
    b.tabIndex = -1;
    b.onclick = () => {
      const q = document.getElementById("ff-q") as HTMLInputElement | null;
      q?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      setTimeout(() => q?.focus({ preventScroll: true }), 400);
    };
    bar.appendChild(b);
  }
  // A visual shortcut only: the same links are on the page, so screen readers skip it.
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const io = new IntersectionObserver(([e]) => bar.classList.toggle("is-shown", !e.isIntersecting));
  io.observe(head);
  return () => { io.disconnect(); bar.remove(); };
}

function pinnedStory(): () => void {
  const steps = Array.from(document.querySelectorAll<HTMLElement>(".ff-body > p"));
  if (steps.length < 2 || !("IntersectionObserver" in window)) return () => {};
  document.querySelector(".ff-body")?.classList.add("ff-story");
  const set = (n: number) => steps.forEach((s, i) => s.classList.toggle("is-active", i === n));
  set(0);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(steps.indexOf(e.target as HTMLElement)); }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
  return () => { io.disconnect(); document.querySelector(".ff-body")?.classList.remove("ff-story"); };
}

function swipeRow(): () => void {
  const w = document.querySelector<HTMLElement>(".ff-more");
  if (!w) return () => {};
  const g = w.querySelector<HTMLElement>(".ff-more-row"), prev = w.querySelector<HTMLButtonElement>("[data-prev]"), next = w.querySelector<HTMLButtonElement>("[data-next]");
  if (!g || !prev || !next || !g.firstElementChild) return () => {};
  w.classList.add("has-paddles");
  const step = () => (g.firstElementChild as HTMLElement).getBoundingClientRect().width + 16;
  const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth") as ScrollBehavior;
  const upd = () => { prev.disabled = g.scrollLeft < 4; next.disabled = g.scrollLeft + g.clientWidth > g.scrollWidth - 4; };
  prev.onclick = () => g.scrollBy({ left: -step() * 2, behavior: smooth() });
  next.onclick = () => g.scrollBy({ left: step() * 2, behavior: smooth() });
  g.addEventListener("scroll", upd, { passive: true });
  window.addEventListener("resize", upd);
  upd();
  return () => { g.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
}

export default function FactsFridayMotion({ page }: { page: "archive" | "post" }) {
  useEffect(() => {
    const offs = page === "archive" ? [revealCards(), subBar("archive")] : [subBar("post"), pinnedStory(), swipeRow()];
    return () => offs.forEach((off) => off());
  }, [page]);
  return null;
}
