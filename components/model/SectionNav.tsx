"use client";

import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/useActiveSection";

type Item = { id: string; label: string };

/**
 * Uniform Connectedness + Common Region: every chapter of a long model page in one sticky bar,
 * highlighting the chapter being read. Scrolls sideways on phones.
 */
export function SectionNav({ items }: { items: Item[] }) {
  const active = useActiveSection(
    items.map((i) => i.id),
    { activationLine: 220, fallbackToFirst: false },
  );

  return (
    <nav aria-label="Хуудасны хэсгүүд" className="sticky top-[72px] z-30 border-y border-line bg-bg/80 backdrop-blur-[16px]">
      <ul className="mx-auto flex max-w-site gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-8 lg:justify-center">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "block rounded-full px-3.5 py-1.5 text-sm transition-colors",
                active === item.id ? "bg-white/10 text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
