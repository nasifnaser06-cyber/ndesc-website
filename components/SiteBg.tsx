"use client";

import { usePathname } from "next/navigation";
import BgDrift from "@/components/BgDrift";

/**
 * Homepage: the Milky Way background (Mahmud, 27 Nov 2026). Every other page except the NESS X section
 * (/ness/..., which includes Photosphere and Register and has its own pictures) gets only the same dark
 * blue-green tint and glass, without the photo.
 * Sized per device (phones 1600px wide, laptops 2560px, big screens the full 3709px) and preloaded so it
 * arrives with the page; a tiny blurred copy underneath shows instantly. The dark blue-green veil and the
 * glass boxes are in globals.css under .home-bg. Same phone drift as NESS X and Photosphere.
 */
const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PLACEHOLDER =
  "data:image/webp;base64,UklGRuQAAABXRUJQVlA4INgAAACwBgCdASowABoAPqFCmkmmJCKhNVv8AMAUCUATpmZfDQkUz8YmaK55GoX9x5p0kbus35tirff5Oj6RHBQdAAD++mHfFqijwmHrOIv2yJJPLejX/D9DPAXDx4tpGrDbdKzBHDVmis7B6xEyR33mvzTFVeyDMVsHXfWAi3bvmDGjcU50xG7DJqD0xO7rWGMNt3VhMdfV7vzUTQSJ6uKDJRf3bFCBXA1rDA138w1g0pNZv8Vo/QF90USYxIOQiDXGJPir8vRAB863BnTJ7MZRobkC9oc4zMdOsAA=";

export default function SiteBg() {
  const pathname = usePathname() ?? "/";
  const bare = bp && pathname.startsWith(bp) ? pathname.slice(bp.length) || "/" : pathname;
  if (bare === "/ness" || bare.startsWith("/ness/")) return null;
  // Every page but the homepage: only the dark blue-green tint, no photo (Mahmud, 27 Nov 2026).
  if (bare !== "/") return <div className="home-bg site-tint" aria-hidden="true" />;
  return (
    <>
      <link rel="preload" as="image" type="image/webp" href={`${bp}/home/galaxy-bg-1600.webp`} media="(max-width: 900px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/webp" href={`${bp}/home/galaxy-bg-2560.webp`} media="(min-width: 901px) and (max-width: 1600px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/webp" href={`${bp}/home/galaxy-bg-3709.webp`} media="(min-width: 1601px)" fetchPriority="high" />
      <div
        className="home-bg bg-drift"
        aria-hidden="true"
        style={{
          ["--bg-sm" as string]: `url("${bp}/home/galaxy-bg-1600.webp")`,
          ["--bg-md" as string]: `url("${bp}/home/galaxy-bg-2560.webp")`,
          ["--bg-lg" as string]: `url("${bp}/home/galaxy-bg-3709.webp")`,
          ["--bg-ph" as string]: `url("${PLACEHOLDER}")`,
        }}
      />
      <BgDrift />
    </>
  );
}
