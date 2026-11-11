import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "strong" | "accent";

type GlassCardProps = {
  children: ReactNode;
  as?: "div" | "article";
  /** default: subtle border · strong: brighter border · accent: green border + glow (featured) */
  tone?: Tone;
  /** Lift + brighten on hover */
  interactive?: boolean;
  className?: string;
};

const tones: Record<Tone, string> = {
  default: "border-line bg-glass",
  strong: "border-line-strong bg-glass",
  accent: "border-accent/40 bg-glass-2 bg-[radial-gradient(120%_90%_at_50%_0%,rgb(93_240_168/0.1),transparent_60%)]",
};

/** Frosted glass panel with a soft accent glow on hover. */
export function GlassCard({ children, as: Tag = "div", tone = "default", interactive = false, className }: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-card border backdrop-blur-[14px]",
        tones[tone],
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(120%_120%_at_0%_0%,rgb(93_240_168/0.08),transparent_45%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        interactive && "transition-[translate,background-color,border-color] duration-200 hover:-translate-y-1 hover:bg-glass-2",
        interactive && tone === "default" && "hover:border-line-strong",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
