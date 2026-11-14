import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "link";
type Size = "md" | "sm";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing icon: arrow (CTA), chevron (link to another page) or down (jump further down this page) */
  icon?: "arrow" | "chevron" | "down";
  href?: string;
  type?: "button" | "submit";
  /** <button> only — also dims the button and drops the hover lift */
  disabled?: boolean;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap border font-semibold leading-[1.4] transition-[transform,box-shadow,background-color,border-color,color] duration-200";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full border-transparent bg-linear-to-b from-accent to-accent-2 text-accent-ink shadow-glow hover:-translate-y-0.5 hover:shadow-glow-lg",
  secondary:
    "rounded-full border-line-strong bg-white/5 text-ink backdrop-blur-[10px] hover:-translate-y-0.5 hover:bg-white/10",
  link: "border-0 bg-transparent p-0 text-ink hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-[11px] text-[15px]",
  sm: "px-4 py-2 text-sm",
};

export function Button({ children, variant = "primary", size = "md", icon, href, type = "button", disabled, className }: ButtonProps) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], variant === "link" && size === "sm" && "text-sm", variant === "link" && size === "md" && "text-[15px]", className);

  const iconEl = icon && (
    <Image
      src={icon === "arrow" ? "/assets/icons/arrow-forward.svg" : icon === "down" ? "/assets/icons/chevron-down.svg" : "/assets/icons/chevron-right.svg"}
      width={icon === "arrow" ? 18 : icon === "down" ? 20 : 24}
      height={icon === "arrow" ? 18 : icon === "down" ? 20 : 24}
      alt=""
      unoptimized
      className={cn(
        // Figma icons are black: invert them everywhere except on the green button
        variant !== "primary" && "invert",
        variant === "link" && "transition-transform duration-200",
        variant === "link" && (icon === "down" ? "group-hover:translate-y-[2px]" : "group-hover:translate-x-[3px]"),
      )}
    />
  );

  if (!href) {
    return (
      <button
        type={type}
        disabled={disabled}
        className={cn(classes, "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none")}
      >
        {children}
        {iconEl}
      </button>
    );
  }

  // Same-page anchors stay plain <a> so the smooth-scroll handler can take them
  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {children}
        {iconEl}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {iconEl}
    </Link>
  );
}
