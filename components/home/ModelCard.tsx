import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { OrderButton } from "./OrderButton";
import type { Model } from "@/data/models";

export function ModelCard({ model }: { model: Model }) {
  return (
    <GlassCard as="article" interactive className="flex h-full flex-col items-center gap-6 px-3.5 pt-3.5 pb-[26px] text-center">
      <Image
        src={model.card.image}
        alt={model.card.alt}
        width={592}
        height={320}
        sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 300px"
        className="aspect-[296/160] w-full rounded-xl object-cover"
      />
      <div className="relative flex flex-col gap-3.5 px-1.5">
        <h3 className="heading-5">{model.name}</h3>
        <p className="text-[15px] leading-[1.6] text-muted">{model.card.description}</p>
      </div>
      <div className="relative mt-auto flex items-center justify-center gap-3.5">
        {model.deposit ? (
          <OrderButton slug={model.slug} size="sm" />
        ) : (
          <Button href="#contact" size="sm">
            Одоо захиалах
          </Button>
        )}
        {/* Similarity: same look ⇒ same behaviour. "›" opens another page, "↓" jumps to this model's showcase below */}
        {model.detailHref ? (
          <Button href={model.detailHref} variant="link" size="sm" icon="chevron">
            Дэлгэрэнгүй
          </Button>
        ) : (
          <Button href={`#${model.slug}`} variant="link" size="sm" icon="down">
            Танилцах
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
