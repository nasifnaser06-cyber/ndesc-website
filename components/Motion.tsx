"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Section intros (rion-motion-web Part 2 and Part 16), replayed every time a section
 * comes back into view (Mahmud, 18 Nov 2026).
 * - `is-in` is added once a section's top passes about 88% of the screen height.
 * - It is removed only when the section has left the screen completely, so nothing
 *   flickers near the edge. On the way out the section records which side it left by,
 *   so it drops in from above when scrolling back up and rises from below going down.
 * The inline script in the layout adds `motion` to <html> before the first paint;
 * this component marks itself ready so the failsafe there does not undo it.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __ndescMotion?: boolean }).__ndescMotion = true;
    if (!("IntersectionObserver" in window)) {
      root.classList.remove("motion");
      return;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section:not(.sky)"));

    const enter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add("is-in");
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const leave = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.remove("is-in");
        // Left through the top: it will come back from the top when scrolling up.
        el.dataset.from = e.boundingClientRect.top < 0 ? "top" : "bottom";
      }
    });

    sections.forEach((s) => {
      enter.observe(s);
      leave.observe(s);
    });
    return () => {
      enter.disconnect();
      leave.disconnect();
    };
  }, [pathname]);

  return null;
}
