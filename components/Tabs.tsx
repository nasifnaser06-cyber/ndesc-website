"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

export type Tab = { id: string; label: string; content: ReactNode };

/**
 * Accessible tabs. Without JavaScript every panel shows, one after another, each with its
 * own heading. With JavaScript only the chosen panel shows, and the choice is kept in the
 * address (#current, #former) when `syncHash` is on, so a link can open a given tab.
 */
export default function Tabs({ tabs, initial, label, syncHash = false, small = false }: { tabs: Tab[]; initial: string; label: string; syncHash?: boolean; small?: boolean }) {
  const [active, setActive] = useState(initial);
  const [ready, setReady] = useState(false);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setReady(true);
    if (!syncHash) return;
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [syncHash, tabs]);

  const choose = (id: string, focus = false) => {
    setActive(id);
    if (syncHash) history.replaceState(null, "", `#${id}`);
    if (focus) refs.current[tabs.findIndex((t) => t.id === id)]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(tabs[next].id, true);
  };

  return (
    <div className={`tabs ${small ? "tabs-small" : ""}`} data-ready={ready}>
      <div role="tablist" aria-label={label} className="tab-list">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-controls={`${base}-panel-${t.id}`}
            aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            className="tab"
            onClick={() => choose(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${base}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.id}`}
          className="tab-panel"
          hidden={ready && active !== t.id}
          tabIndex={0}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
