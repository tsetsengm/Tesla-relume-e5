import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
import { Reveal } from "@/components/ui/Reveal";
import type { ModelDetail } from "@/data/model-details/types";

export function ModelHero({ hero }: { hero: ModelDetail["hero"] }) {
  return (
    <Hero image={hero.image}>
      <div className="flex max-w-[768px] flex-col gap-5">
        <Reveal>
          <p className="tagline">{hero.tagline}</p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display">
            {hero.title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-[560px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-muted">{hero.text}</p>
        </Reveal>
        <Reveal delay={260} className="mt-3.5 flex flex-wrap items-center gap-3.5 max-sm:[&>*]:flex-[1_1_100%]">
          <Button href="#contact" icon="arrow">
            Test drive
          </Button>
          <Button href="#specs" variant="secondary">
            Үзүүлэлт харах
          </Button>
        </Reveal>
        <Reveal delay={360}>
          <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-7 max-sm:gap-x-7">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-gradient text-[clamp(28px,3.2vw,40px)] font-extrabold tracking-[-0.02em]">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Hero>
  );
}
