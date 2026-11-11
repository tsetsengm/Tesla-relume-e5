"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type RevealVariant = "rise" | "grow";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  /** rise: fade + slide up · grow: fade + slide up + scale from 94% */
  variant?: RevealVariant;
  as?: "div" | "section" | "li";
  className?: string;
  style?: CSSProperties;
  id?: string;
};

const hidden: Record<RevealVariant, string> = {
  rise: "opacity-0 translate-y-[26px]",
  grow: "opacity-0 translate-y-12 scale-[0.94] origin-bottom",
};

/** Animates its children into view the first time they scroll into the viewport. */
export function Reveal({ children, delay = 0, variant = "rise", as: Tag = "div", className, style, id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion is handled in CSS (motion-reduce:*); only very old browsers lack IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn(
        "transition-[opacity,translate,scale] duration-700 ease-soft motion-reduce:transition-none",
        shown ? "translate-y-0 scale-100 opacity-100" : hidden[variant],
        "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
