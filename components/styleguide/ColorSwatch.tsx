"use client";

import { useSyncExternalStore } from "react";

type Rgba = { r: number; g: number; b: number; a: number };

const cache = new Map<string, string>();

/** Resolve a CSS custom property to "r,g,b,a" via the browser's own color parser. */
function readToken(cssVar: string): string {
  const cached = cache.get(cssVar);
  if (cached) return cached;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  const probe = document.createElement("span");
  probe.style.color = raw;
  document.body.appendChild(probe);
  const nums = getComputedStyle(probe).color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  probe.remove();
  const value = `${nums[0]},${nums[1]},${nums[2]},${nums[3] ?? 1}`;
  cache.set(cssVar, value);
  return value;
}

const noopSubscribe = () => () => {};

export function useToken(cssVar: string): Rgba | null {
  const value = useSyncExternalStore(noopSubscribe, () => readToken(cssVar), () => null);
  if (!value) return null;
  const [r, g, b, a] = value.split(",").map(Number);
  return { r, g, b, a };
}

const hex = ({ r, g, b }: Rgba) => "#" + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");

const blend = (top: Rgba, bottom: Rgba): Rgba => ({
  r: top.r * top.a + bottom.r * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  b: top.b * top.a + bottom.b * (1 - top.a),
  a: 1,
});

function luminance({ r, g, b }: Rgba) {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrast(x: Rgba, y: Rgba) {
  const [l1, l2] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Swatch whose value, alpha and contrast are read live from app/globals.css. */
export function ColorSwatch({ name, usage }: { name: string; usage: string }) {
  const cssVar = `--color-${name}`;
  const color = useToken(cssVar);
  const bg = useToken("--color-bg");
  const ratio = color && bg ? contrast(blend(color, bg), bg) : null;

  return (
    <div>
      <div className="h-[72px] rounded-xl border border-line" style={{ background: `var(${cssVar})` }} />
      <p className="mt-3 font-mono text-[12px] text-ink">{cssVar}</p>
      <p className="mt-1 font-mono text-[12px] text-muted-2">
        {color ? (
          <>
            {hex(color)}
            {color.a < 1 && ` · ${Math.round(color.a * 100)}%`}
            {ratio && ` · ${ratio.toFixed(1)}:1`}
          </>
        ) : (
          "…"
        )}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-muted">{usage}</p>
    </div>
  );
}
