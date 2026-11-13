"use client";

import { sgSections } from "@/data/styleguide";
import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/useActiveSection";

const ids = sgSections.map((s) => s.id);

/** Sticky numbered table of contents that highlights the chapter being read. */
export function Toc() {
  const active = useActiveSection(ids);

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
