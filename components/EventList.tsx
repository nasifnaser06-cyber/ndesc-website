"use client";

import Link from "next/link";
import { useState } from "react";

export type EventRowData = {
  slug: string;
  href: string;
  type: string;
  typeLabel: string;
  date: string;
  title: string;
  where: string;
  upcoming: boolean;
};

type Labels = { upcoming: string; past: string; all: string; allTypes: string; details: string; when: string; kind: string; empty: string };

function Row({ e, labels }: { e: EventRowData; labels: Labels }) {
  return (
    <li className="event-row">
      <p className="event-date">{e.date}</p>
      <div className="event-main">
        <h3>
          <Link href={e.href}>{e.title}</Link>
        </h3>
        <p className="small muted">
          {e.typeLabel}. {e.where}
        </p>
      </div>
      <p className="event-status">
        <span className={`tag ${e.upcoming ? "tag-up" : ""}`}>{e.upcoming ? labels.upcoming : labels.past}</span>
      </p>
    </li>
  );
}

/** Static list (used on the home page). */
export function EventRows({ items, labels }: { items: EventRowData[]; labels: Labels }) {
  return (
    <ul className="event-list">
      {items.map((e) => (
        <Row key={e.slug} e={e} labels={labels} />
      ))}
    </ul>
  );
}

/** Events page list with time and type filters. Without JavaScript every event shows. */
export function FilteredEvents({ items, labels, types }: { items: EventRowData[]; labels: Labels; types: { key: string; label: string }[] }) {
  const [when, setWhen] = useState<"all" | "upcoming" | "past">("all");
  const [kind, setKind] = useState<string>("all");
  const shown = items.filter(
    (e) => (when === "all" || (when === "upcoming") === e.upcoming) && (kind === "all" || e.type === kind),
  );
  const whenOpts = [
    { key: "all", label: labels.all },
    { key: "upcoming", label: labels.upcoming },
    { key: "past", label: labels.past },
  ] as const;
  return (
    <>
      <div className="filters">
        <div className="chips" role="group" aria-label={labels.when}>
          {whenOpts.map((o) => (
            <button key={o.key} type="button" className="chip" aria-pressed={when === o.key} onClick={() => setWhen(o.key)}>
              {o.label}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label={labels.kind}>
          <button type="button" className="chip" aria-pressed={kind === "all"} onClick={() => setKind("all")}>
            {labels.allTypes}
          </button>
          {types.map((t) => (
            <button key={t.key} type="button" className="chip" aria-pressed={kind === t.key} onClick={() => setKind(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="visually-hidden" aria-live="polite">
        {shown.length}
      </p>
      {shown.length === 0 ? (
        <p className="empty">{labels.empty}</p>
      ) : (
        <ul className="event-list">
          {shown.map((e) => (
            <Row key={e.slug} e={e} labels={labels} />
          ))}
        </ul>
      )}
    </>
  );
}
