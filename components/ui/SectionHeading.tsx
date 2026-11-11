import { cn } from "@/lib/cn";
import { Reveal, type RevealVariant } from "./Reveal";

type SectionHeadingProps = {
  tagline?: string;
  title: string;
  text?: string;
  variant?: RevealVariant;
  className?: string;
};

/** Centered tagline + title + lead paragraph, revealed in sequence. */
export function SectionHeading({ tagline, title, text, variant, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-14 max-w-[680px] text-center", className)}>
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
          <p className="mt-[18px] text-lg leading-[1.65] text-muted [text-shadow:0_1px_24px_rgb(0_0_0/0.55)]">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
