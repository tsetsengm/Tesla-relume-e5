"use client";

import { cn } from "@/lib/cn";
import { useActiveSection } from "@/lib/useActiveSection";

type Step = { slug: string; name: string };

/**
 * Uniform Connectedness: the model showcases as numbered stops on one line.
 * Sticky under the navbar while the showcases are on screen; the line fills up to the model being read.
 */
export function ModelStepper({ steps }: { steps: Step[] }) {
  const ids = steps.map((s) => s.slug);
  const active = useActiveSection(ids, { activationLine: 220, fallbackToFirst: false });
  const index = active ? ids.indexOf(active) : -1;
  const inset = 50 / steps.length; // % from each edge to the first/last dot (centred columns)
  const progress = index <= 0 ? 0 : (index / (steps.length - 1)) * (100 - 2 * inset);

  return (
    <nav aria-label="Загварууд" className="sticky top-[72px] z-30 border-y border-line bg-bg/80 backdrop-blur-[16px]">
      <div className="mx-auto max-w-[880px] px-4 py-3 sm:px-8">
      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {/* The connecting line (through the 10px dots' centres), and its filled part up to the active model */}
        <span aria-hidden className="absolute top-[4.5px] h-px bg-line-strong" style={{ left: `${inset}%`, right: `${inset}%` }} />
        <span
          aria-hidden
          className="absolute top-[4.5px] h-px bg-accent transition-[width] duration-500 ease-soft"
          style={{ left: `${inset}%`, width: `${progress}%` }}
        />
        {steps.map((step, i) => {
          const isActive = i === index;
          const isPast = index >= 0 && i < index;
          return (
            <li key={step.slug} className="relative flex justify-center">
              <a href={`#${step.slug}`} aria-current={isActive ? "step" : undefined} className="group flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 rounded-full border transition-colors",
                    isActive ? "border-accent bg-accent shadow-[0_0_10px_var(--color-accent)]" : isPast ? "border-accent bg-bg" : "border-line-strong bg-bg group-hover:border-ink",
                  )}
                />
                <span className={cn("whitespace-nowrap text-xs transition-colors", isActive ? "text-ink" : "text-muted group-hover:text-ink")}>
                  <span className="mr-1 font-mono text-[10px] text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                  {step.name}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      </div>
    </nav>
  );
}
