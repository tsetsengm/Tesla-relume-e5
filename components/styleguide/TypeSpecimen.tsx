"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Spec = { family: string; weight: string; size: string; lineHeight: string; tracking: string };

function measure(el: HTMLElement): Spec {
  const s = getComputedStyle(el);
  const px = (v: string) => (v.endsWith("px") ? `${Math.round(parseFloat(v) * 10) / 10}px` : v);
  return {
    family: s.fontFamily.split(",")[0].replace(/["']/g, "").replace(/^__|_[\da-f]+$/g, "").replace(/ Fallback.*/, ""),
    weight: s.fontWeight,
    size: px(s.fontSize),
    lineHeight: px(s.lineHeight),
    tracking: s.letterSpacing === "normal" ? "0" : px(s.letterSpacing),
  };
}

/** Renders a text style with its computed font metrics (updates with the viewport). */
export function TypeSpecimen({ name, usage, sample, className }: { name: string; usage: string; sample: string; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [spec, setSpec] = useState<Spec | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSpec(measure(el)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="grid gap-4 border-b border-line py-7 last:border-b-0 lg:grid-cols-[220px_1fr] lg:gap-10">
      <div>
        <p className="font-mono text-[13px] text-ink">{name}</p>
        <p className="mt-1 text-[13px] text-muted">{usage}</p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-2">
          {spec ? `${spec.family} ${spec.weight} · ${spec.size}/${spec.lineHeight} · ${spec.tracking}` : "…"}
        </p>
      </div>
      <p ref={ref} className={cn("min-w-0 break-words", className)}>
        {sample}
      </p>
    </div>
  );
}
