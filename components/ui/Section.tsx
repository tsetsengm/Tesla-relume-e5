import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** Home page uses half the vertical spacing */
  compact?: boolean;
  className?: string;
};

/** Page section with the site's horizontal gutter and a 1280px container. */
export function Section({ children, id, compact = false, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-4 sm:px-8 lg:px-16",
        compact ? "py-8 sm:py-10 lg:py-14" : "py-16 sm:py-20 lg:py-28",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-site">{children}</div>
    </section>
  );
}
