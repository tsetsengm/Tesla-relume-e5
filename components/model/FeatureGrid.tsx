import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Feature } from "@/data/model-details/types";
import { cn } from "@/lib/cn";

export function IconBadge({ icon: Icon, className }: { icon: Feature["icon"]; className?: string }) {
  return (
    <div className={cn("grid size-[46px] shrink-0 place-items-center rounded-xl border border-accent/18 bg-accent/10 text-accent", className)}>
      <Icon size={22} strokeWidth={1.6} aria-hidden />
    </div>
  );
}

export function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <GlassCard as="article" interactive className="h-full p-[30px]">
      <IconBadge icon={feature.icon} className="mb-[22px]" />
      <h3 className="relative mb-2.5 text-[19px] font-bold">{feature.title}</h3>
      <p className="relative text-[15px] leading-[1.6] text-muted">{feature.text}</p>
    </GlassCard>
  );
}

/** 3-column grid of icon cards; stagger restarts every row. */
export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((feature, i) => (
        <Reveal key={feature.title} delay={(i % 3) * 90}>
          <FeatureItem feature={feature} />
        </Reveal>
      ))}
    </div>
  );
}

/** Full-width card with the icon beside the copy. */
export function PowerBanner({ feature }: { feature: Feature }) {
  return (
    <Reveal className="mt-[18px]">
      <GlassCard className="flex gap-[22px] p-[30px] max-sm:flex-col">
        <IconBadge icon={feature.icon} />
        <div>
          <h3 className="relative mb-2.5 text-[19px] font-bold">{feature.title}</h3>
          <p className="relative text-[15px] leading-[1.6] text-muted">{feature.text}</p>
        </div>
      </GlassCard>
    </Reveal>
  );
}

/** Icon + bold title + description list (Tesla app features). */
export function CheckList({ items }: { items: Feature[] }) {
  return (
    <ul className="flex flex-col gap-[18px]">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-3.5 text-[15px] leading-[1.55] text-muted">
          <Icon size={22} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <div>
            <strong className="block font-semibold text-ink">{title}</strong>
            {text}
          </div>
        </li>
      ))}
    </ul>
  );
}
