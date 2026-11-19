import { cn } from "@/lib/cn";
import { BlurText } from "./BlurText";
import { Reveal, type RevealVariant } from "./Reveal";

type Spacing = "default" | "compact" | "none";

type SectionHeadingProps = {
  tagline?: string;
  title: string;
  text?: string;
  variant?: RevealVariant;
  /** Gap below the heading: default 56px, compact 40px, none 0 (Proximity: heading sits close to what it labels) */
  spacing?: Spacing;
  /** Wider box (960px) so a longer title stays on one line on desktop */
  wide?: boolean;
  className?: string;
};

const spacings: Record<Spacing, string> = { default: "mb-14", compact: "mb-10", none: "mb-0" };

/** Centered tagline + title + lead paragraph, revealed in sequence. */
export function SectionHeading({ tagline, title, text, variant, spacing = "default", wide = false, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto text-center", wide ? "max-w-[960px]" : "max-w-[680px]", spacings[spacing], className)}>
      {tagline && (
        <Reveal variant={variant}>
          <span className="tagline mb-3.5 block">{tagline}</span>
        </Reveal>
      )}
      {/* Words sharpen out of a blur as the heading scrolls up */}
      <BlurText as="h2" text={title} className="heading-2" />
      {text && (
        <Reveal variant={variant} delay={160}>
          <p className="lead mt-[18px]">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
