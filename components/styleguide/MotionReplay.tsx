"use client";

import { useState, type ReactNode } from "react";
import { Reveal, type RevealVariant } from "@/components/ui/Reveal";

/** Re-mounts a <Reveal> so its entrance animation can be replayed on demand. */
export function MotionReplay({ variant, children }: { variant: RevealVariant; children: ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong">
        <Reveal key={run} variant={variant}>
          {children}
        </Reveal>
      </div>
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
      >
        ↻ Дахин тоглуулах
      </button>
    </div>
  );
}
