"use client";

import { useEffect, useState } from "react";
import { sgSections } from "@/data/styleguide";
import { cn } from "@/lib/cn";

const ACTIVATION_LINE = 140; // px below the viewport top (navbar + breathing room)

/** Sticky numbered table of contents that highlights the chapter being read. */
export function Toc() {
  const [active, setActive] = useState<string>(sgSections[0].id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // Last chapter whose top has passed the activation line; the first one before any has.
      let current: string = sgSections[0].id;
      for (const s of sgSections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= ACTIVATION_LINE) current = s.id;
      }
      // At the very bottom the last short chapters can never reach the line
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sgSections[sgSections.length - 1].id;
      }
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
  }, []);

  return (
    <nav aria-label="Styleguide агуулга" className="sticky top-[104px] hidden self-start lg:block">
      <ol className="flex flex-col gap-1">
        {sgSections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "flex items-baseline gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors hover:text-ink",
                active === s.id ? "bg-white/5 text-ink" : "text-muted",
              )}
            >
              <span className={cn("font-mono text-[11px]", active === s.id ? "text-accent" : "text-muted-2")}>{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
