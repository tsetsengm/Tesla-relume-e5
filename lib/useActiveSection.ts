"use client";

import { useEffect, useState } from "react";

type Options = {
  /** Px below the viewport top that a section's top must pass to become active */
  activationLine?: number;
  /** Before any section reaches the line: the first id (TOC style) or null (stepper style) */
  fallbackToFirst?: boolean;
};

/**
 * Scroll-spy: the id of the last section (from `ids`) whose top has passed the activation line.
 * At the very bottom of the page the last id wins, since short final sections can never reach the line.
 */
export function useActiveSection(ids: readonly string[], { activationLine = 140, fallbackToFirst = true }: Options = {}) {
  const [active, setActive] = useState<string | null>(fallbackToFirst ? (ids[0] ?? null) : null);
  const key = ids.join("|");

  useEffect(() => {
    const list = key.split("|");
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = fallbackToFirst ? list[0] : null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= activationLine) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const lastEl = document.getElementById(list[list.length - 1]);
      if (atBottom && lastEl && lastEl.getBoundingClientRect().top < window.innerHeight) current = list[list.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [key, activationLine, fallbackToFirst]);

  return active;
}
