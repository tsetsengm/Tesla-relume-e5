import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Trim } from "@/data/model-details/types";

export function TrimCard({ trim }: { trim: Trim }) {
  return (
    <GlassCard as="article" interactive tone={trim.featured ? "accent" : "default"} className="flex h-full flex-col gap-6 px-7 py-8">
      {trim.badge && (
        <span className="relative self-start rounded-full border border-accent/25 bg-accent/10 px-[11px] py-[5px] text-xs font-semibold text-accent">
          {trim.badge}
        </span>
      )}
      <div className="relative">
        <h3 className="heading-5">{trim.name}</h3>
        <p className="mt-1.5 text-sm text-muted">{trim.subtitle}</p>
      </div>
      <div className="relative text-muted">
        <strong className="text-[32px] font-extrabold tracking-[-0.02em] text-ink">{trim.price}</strong>-өөс
        <span className="mt-1 block text-sm">{trim.lease}</span>
      </div>
      <ul className="relative flex flex-col gap-3 border-t border-line pt-5 text-[15px] text-muted">
        {trim.stats.map((s) => (
          <li key={s.label}>
            <strong className="text-ink">{s.value}</strong> {s.label}
          </li>
        ))}
      </ul>
      <Button href="#contact" className="relative mt-auto">
        Одоо захиалах
      </Button>
    </GlassCard>
  );
}
