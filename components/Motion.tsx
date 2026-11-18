"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Plays each section's intro once, when it scrolls into view (rion-motion-web Part 2).
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
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section:not(.sky):not(.is-in)"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      // starts when the section's top passes about 88% of the screen height
      { rootMargin: "0px 0px -12% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
