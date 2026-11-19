"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";

type BlurTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
};

/** Where the reveal starts / ends: the element's top as a share of the viewport height */
const START = 0.92;
const END = 0.5;

/**
 * Scroll-linked text reveal: words go from blurred and faint to sharp, one after another, as the text scrolls up.
 * JS writes only `--p` (0…1) on the element; each word derives its own blur/opacity from it in CSS
 * (about 3 words are mid-reveal at once). Without JS, or with reduced motion, the text is simply sharp.
 */
export function BlurText({ text, as: Tag = "span", className }: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (START * vh - top) / ((START - END) * vh)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Only track scroll while the text is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      onScroll();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref as never} className={className} style={{ "--n": words.length } as CSSProperties}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            // --w: this word's own progress (0…1), staggered by its index
            className="inline-block [--w:clamp(0,calc((var(--p,1)*(var(--n)+3)-var(--i))/3),1)] [filter:blur(calc((1-var(--w))*10px))] opacity-[calc(0.12+0.88*var(--w))] motion-reduce:[filter:none] motion-reduce:opacity-100"
            style={{ "--i": i } as CSSProperties}
          >
            {word}
          </span>
          {/* Spaces stay outside the inline-blocks, where they can wrap */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
