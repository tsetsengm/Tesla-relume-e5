import { cn } from "@/lib/cn";
import { Reveal, type RevealVariant } from "./Reveal";

type Spacing = "default" | "compact" | "none";

type SectionHeadingProps = {
  tagline?: string;
  title: string;
  text?: string;
  variant?: RevealVariant;
  /** Gap below the heading: default 56px, compact 40px, none 0 (Proximity: heading sits close to what it labels) */
  spacing?: Spacing;
  className?: string;
};

const spacings: Record<Spacing, string> = { default: "mb-14", compact: "mb-10", none: "mb-0" };

/** Centered tagline + title + lead paragraph, revealed in sequence. */
export function SectionHeading({ tagline, title, text, variant, spacing = "default", className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-[680px] text-center", spacings[spacing], className)}>
      {tagline && (
        <Reveal variant={variant}>
          <span className="tagline mb-3.5 block">{tagline}</span>
        </Reveal>
      )}
      <Reveal variant={variant} delay={80}>
        <h2 className="heading-2">{title}</h2>
      </Reveal>
      {text && (
        <Reveal variant={variant} delay={160}>
          <p className="lead mt-[18px]">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
