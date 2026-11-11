import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

/** Inline code / token name. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={cn("rounded-md bg-white/6 px-1.5 py-0.5 font-mono text-[0.85em] text-ink/90", className)}>{children}</code>;
}

/** Numbered styleguide chapter: "01  Зарчим" over a hairline. */
export function SgSection({ id, index, title, intro, children }: { id: string; index: number; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="pt-20 first:pt-0 lg:pt-28">
      <div className="mb-10 flex items-baseline gap-4 border-b border-line pb-6">
        <span className="font-mono text-xs text-muted-2">{String(index).padStart(2, "0")}</span>
        <h2 className="text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.02em]">{title}</h2>
      </div>
      {intro && <p className="-mt-4 mb-10 max-w-[680px] text-[15px] leading-[1.65] text-muted">{intro}</p>}
      {children}
    </section>
  );
}

/** Sub-heading inside a chapter. `first` drops the top margin right under the chapter rule. */
export function SubHeading({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return <h3 className={cn("mb-5 text-lg font-semibold", first ? "mt-0" : "mt-12")}>{children}</h3>;
}

/** Labelled showcase box for a live component. */
export function Demo({ name, file, description, children, className }: { name: string; file?: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="relative mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[17px] font-semibold">{name}</h3>
        {file && <Code className="text-[12px] text-muted">{file}</Code>}
      </div>
      {description && <p className="relative -mt-3 mb-6 max-w-[640px] text-sm leading-[1.6] text-muted">{description}</p>}
      <div className={cn("relative", className)}>{children}</div>
    </GlassCard>
  );
}
