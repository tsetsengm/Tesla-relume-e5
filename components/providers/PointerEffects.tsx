"use client";

import { useEffect } from "react";

/**
 * One document-level mouse listener that feeds CSS variables to opted-in elements,
 * so the cards themselves stay server components:
 * - `[data-spotlight]` gets `--sx` / `--sy`: the cursor in px from its top-left (the `spotlight` utility draws the glow)
 * - `[data-tilt]` gets `--px` / `--py`: the cursor from -1 to 1 across it (GlassCard `tilt` turns them into rotation)
 * Fine pointers only; tilt also stays off with reduced motion.
 */
export function PointerEffects() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const resetTilt = () => {
      tilted?.style.setProperty("--px", "0");
      tilted?.style.setProperty("--py", "0");
      tilted = null;
    };

    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${(e.clientX - r.left).toFixed(1)}px`);
        spot.style.setProperty("--sy", `${(e.clientY - r.top).toFixed(1)}px`);
      }

      const tilt = calm.matches ? null : (target?.closest<HTMLElement>("[data-tilt]") ?? null);
      if (tilt !== tilted) resetTilt();
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        const py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        tilt.style.setProperty("--px", px.toFixed(3));
        tilt.style.setProperty("--py", py.toFixed(3));
        tilted = tilt;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Cursor left the window: let the tilted card settle
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) resetTilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
