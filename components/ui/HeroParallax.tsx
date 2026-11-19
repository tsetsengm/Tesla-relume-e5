"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** How much slower than the page the photo moves (0 = with the page, 1 = fixed) */
const DEPTH = 0.3;
/** Zoom at the top of the hero; eases to 1 as the hero scrolls away */
const ZOOM = 0.06;

/**
 * Hero photo layer that drifts slower than the page and zooms out as you scroll past it.
 * Writes `--hy` / `--hs` only while the hero is on screen; reduced motion gets a still photo (CSS).
 */
export function HeroParallax({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = section.getBoundingClientRect();
      const scrolled = Math.max(0, -r.top);
      const progress = Math.min(1, scrolled / r.height);
      el.style.setProperty("--hy", `${(scrolled * DEPTH).toFixed(1)}px`);
      el.style.setProperty("--hs", (1 + ZOOM * (1 - progress)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Lenis drives native window scroll, so plain scroll events stay in sync with it
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(section);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "will-change-transform [transform:translate3d(0,var(--hy,0px),0)_scale(var(--hs,1.06))] motion-reduce:[transform:none]",
        className,
      )}
    >
      {children}
    </div>
  );
}
