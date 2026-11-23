"use client";

import { useEffect, useState } from "react";

/**
 * FactsFriday motion lab: which preview effects are on.
 * Turned on with ?fx=cascade,settle,... in the address. The choice is remembered for the
 * browser tab (sessionStorage), so it carries from the archive to a post. ?fx=none clears it.
 * With no ?fx and nothing remembered, every effect is off and the pages behave as they do today.
 */
export const FX_KEY = "ndesc-ff-fx";

export function readFx(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const q = new URLSearchParams(window.location.search).get("fx");
  try {
    if (q !== null) {
      const v = q === "none" ? "" : q;
      sessionStorage.setItem(FX_KEY, v);
      return new Set(v.split(",").filter(Boolean));
    }
    return new Set((sessionStorage.getItem(FX_KEY) || "").split(",").filter(Boolean));
  } catch {
    return new Set((q || "").split(",").filter(Boolean));
  }
}

export function useFx(): Set<string> {
  const [fx, setFx] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setFx(readFx());
    const on = () => setFx(readFx());
    window.addEventListener("ndesc-fx", on);
    return () => window.removeEventListener("ndesc-fx", on);
  }, []);
  return fx;
}

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
