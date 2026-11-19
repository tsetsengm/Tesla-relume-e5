"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

type MagneticLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  /** How far the button follows the cursor, as a share of the cursor's distance from its centre */
  strength?: number;
};

/**
 * A link that leans toward the cursor and springs back on leave.
 * Writes `--mx` / `--my` (px) on the element; the classes below turn them into transforms,
 * so the label can drift further than the pill for a little depth.
 * Only runs for fine pointers with motion allowed — touch and reduced-motion get a plain link.
 */
export function MagneticLink({ href, className, children, strength = 0.35 }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0, enabled: false });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const s = state.current;
    const sync = () => {
      s.enabled = mq.matches;
      if (!s.enabled) reset();
    };
    const reset = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.x = s.y = s.vx = s.vy = s.tx = s.ty = 0;
      ref.current?.style.setProperty("--mx", "0px");
      ref.current?.style.setProperty("--my", "0px");
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  // Damped spring: follows smoothly, overshoots slightly on release
  const tick = () => {
    const s = state.current;
    const el = ref.current;
    if (!el) return;
    s.vx = (s.vx + (s.tx - s.x) * 0.16) * 0.74;
    s.vy = (s.vy + (s.ty - s.y) * 0.16) * 0.74;
    s.x += s.vx;
    s.y += s.vy;
    el.style.setProperty("--mx", `${s.x.toFixed(2)}px`);
    el.style.setProperty("--my", `${s.y.toFixed(2)}px`);
    const settled = Math.abs(s.tx - s.x) < 0.05 && Math.abs(s.ty - s.y) < 0.05 && Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05;
    s.raf = settled ? 0 : requestAnimationFrame(tick);
  };

  const start = () => {
    if (!state.current.raf) state.current.raf = requestAnimationFrame(tick);
  };

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const s = state.current;
    const el = ref.current;
    if (!s.enabled || !el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    // Measure against the resting position, not where the spring has moved it
    s.tx = (e.clientX - (r.left - s.x + r.width / 2)) * strength;
    s.ty = (e.clientY - (r.top - s.y + r.height / 2)) * strength;
    start();
  };

  const onPointerLeave = () => {
    const s = state.current;
    if (!s.enabled) return;
    s.tx = s.ty = 0;
    start();
  };

  const content = (
    <span className="inline-flex items-center gap-[inherit] [transform:translate3d(calc(var(--mx,0px)*0.45),calc(var(--my,0px)*0.45),0)]">
      {children}
    </span>
  );

  const props = {
    ref,
    className: `${className ?? ""} [transform:translate3d(var(--mx,0px),var(--my,0px),0)] will-change-transform`,
    onPointerMove,
    onPointerLeave,
  };

  // Same-page anchors stay plain <a> so the smooth-scroll handler can take them
  return href.startsWith("#") ? (
    <a href={href} {...props}>
      {content}
    </a>
  ) : (
    <Link href={href} {...props}>
      {content}
    </Link>
  );
}
