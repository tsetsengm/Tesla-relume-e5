import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type CtaCardProps = { tagline: string; title: string; text: string };

export function CtaCard({ tagline, title, text }: CtaCardProps) {
  return (
    <Reveal className="mx-auto max-w-[760px] rounded-panel border border-line-strong bg-glass-2 bg-[radial-gradient(120%_140%_at_50%_0%,rgb(93_240_168/0.12),transparent_55%)] px-[clamp(28px,5vw,64px)] py-[clamp(48px,7vw,80px)] text-center shadow-panel">
      <span className="tagline mb-3.5 block">{tagline}</span>
      <h2 className="heading-2">{title}</h2>
      <p className="mx-auto mt-[18px] mb-[34px] max-w-[520px] text-lg leading-[1.65] text-muted">{text}</p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Button href="#contact" icon="arrow">
          Test drive
        </Button>
        <Button href="/#model-3" variant="secondary">
          Зээл судлах
        </Button>
      </div>
    </Reveal>
  );
}
