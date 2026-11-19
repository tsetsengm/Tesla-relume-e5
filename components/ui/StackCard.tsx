"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Same condition as the `pin` variant in globals.css: wide and tall enough for a pinned 640px panel */
const PIN_QUERY = "(min-width: 62rem) and (min-height: 50rem)";

/**
 * A panel in a pinned stack (its <section> is `pin:sticky`). As the next section slides over it,
 * it shrinks a little and darkens, so the stack reads as layers. Writes `--cover` (0…1).
 */
export function StackCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    let next = section?.nextElementSibling ?? null;
    while (next && next.tagName !== "SECTION") next = next.nextElementSibling;
    if (!el || !next) return; // the last panel is never covered

    const pin = window.matchMedia(PIN_QUERY);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!pin.matches) {
        el.style.setProperty("--cover", "0");
        return;
      }
      const card = el.getBoundingClientRect();
      const nextTop = next.getBoundingClientRect().top;
      const cover = Math.min(1, Math.max(0, 1 - (nextTop - card.top) / card.height));
      el.style.setProperty("--cover", cover.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pin.addEventListener("change", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      pin.removeEventListener("change", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative origin-top rounded-panel [transform:scale(calc(1-var(--cover,0)*0.06))] motion-reduce:[transform:none]"
    >
      {children}
      {/* Darkens the covered panel */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-panel bg-bg opacity-[calc(var(--cover,0)*0.7)]"
      />
    </div>
  );
}
