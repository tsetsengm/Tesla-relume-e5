import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "strong" | "accent";

type GlassCardProps = {
  children: ReactNode;
  as?: "div" | "article";
  /** default: subtle border · strong: brighter border · accent: green border + glow (featured) */
  tone?: Tone;
  /** Lift + brighten on hover, with a glow and border light that follow the cursor */
  interactive?: boolean;
  /** Glow + border light that follow the cursor. On by default for interactive cards; turn on for static panels too */
  spotlight?: boolean;
  /** Lean toward the cursor in 3D. Children can read `--px` / `--py` (-1…1) for their own parallax */
  tilt?: boolean;
  className?: string;
};

const tones: Record<Tone, string> = {
  default: "border-line bg-glass",
  strong: "border-line-strong bg-glass",
  accent: "border-accent/40 bg-glass-2 bg-[radial-gradient(120%_90%_at_50%_0%,rgb(93_240_168/0.1),transparent_60%)]",
};

/** Frosted glass panel with a soft accent glow on hover. */
export function GlassCard({ children, as: Tag = "div", tone = "default", interactive = false, spotlight = interactive, tilt = false, className }: GlassCardProps) {
  return (
    <Tag
      // Picked up by components/providers/PointerEffects
      data-spotlight={spotlight || undefined}
      data-tilt={tilt || undefined}
      className={cn(
        "relative rounded-card border backdrop-blur-[14px]",
        tones[tone],
        spotlight
          ? "spotlight"
          : "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_0%_0%,rgb(93_240_168/0.08),transparent_45%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        interactive && "transition-[translate,transform,background-color,border-color] duration-300 ease-soft hover:-translate-y-1 hover:bg-glass-2",
        interactive && tone === "default" && "hover:border-line-strong",
        tilt &&
          "[transform:perspective(900px)_rotateX(calc(var(--py,0)*-5deg))_rotateY(calc(var(--px,0)*6deg))] motion-reduce:[transform:none]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
