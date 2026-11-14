import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderForm } from "@/components/order/OrderForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Section } from "@/components/ui/Section";
import { getModelDetail } from "@/data/model-details";
import { getModels } from "@/lib/models";

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/order/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const model = (await getModels()).find((m) => m.slug === slug);
  return { title: model ? `${model.name} захиалах — Tesla` : "Захиалга — Tesla", robots: { index: false } };
}

export default function OrderPage({ params, searchParams }: PageProps<"/order/[slug]">) {
  return (
    <Section className="pt-10 sm:pt-12 lg:pt-16">
      <Suspense fallback={null}>
        <OrderContent params={params} searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}

type OrderContentProps = Pick<PageProps<"/order/[slug]">, "params" | "searchParams">;

async function OrderContent({ params, searchParams }: OrderContentProps) {
  const { slug } = await params;
  // ?trim=… from a trim card on the model page preselects that trim
  const { trim: wanted } = await searchParams;
  const model = (await getModels()).find((m) => m.slug === slug);
  if (!model) notFound();

  const trims = getModelDetail(slug)?.trims.items.map((t) => ({ name: t.name, price: t.price })) ?? [];
  const facts = [
    model.deposit && { label: "Урьдчилгаа", value: `${model.deposit.toLocaleString("en-US")}₮` },
    model.loan?.rate && { label: "Ногоон зээл", value: `жилийн ${model.loan.rate}` },
    model.loan?.leaseFrom && { label: "Түрээс", value: `сард ${model.loan.leaseFrom}-өөс` },
  ].filter(Boolean) as { label: string; value: string }[];

  const steps = model.deposit
    ? ["Мэдээллээ бөглөнө", "Урьдчилгаагаа Byl-ээр төлнө", "Менежер 24 цагийн дотор холбогдож гэрээ байгуулна"]
    : ["Мэдээллээ бөглөнө", "Менежер 24 цагийн дотор холбогдоно", "Үнэ, хүргэлтийн нөхцөлөө тохирно"];

  return (
    <>
      <Link href={`/#${model.slug}`} className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        ← Буцах
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* Order summary — sticks beside the form on desktop */}
        <GlassCard className="overflow-hidden lg:sticky lg:top-[96px]">
          <div className="relative aspect-[16/9]">
            <Image src={model.card.image} alt={model.card.alt} fill priority sizes="(max-width: 991px) 100vw, 480px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <p className="tagline mb-2.5">Захиалга</p>
              <h1 className="heading-2">{model.name}</h1>
              <p className="mt-3 text-[15px] leading-[1.6] text-muted">{model.card.description}</p>
            </div>

            {facts.length > 0 && (
              <dl className="flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-5">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-2">{f.label}</dt>
                    <dd className="mt-0.5 text-[17px] font-semibold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ol className="flex flex-col gap-3 border-t border-line pt-5 text-sm text-muted">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </GlassCard>

        <GlassCard tone="strong" className="p-6 sm:p-10">
          <OrderForm
            slug={model.slug}
            modelName={model.name}
            deposit={model.deposit}
            trims={trims}
            initialTrim={trims.find((t) => t.name === wanted)?.name}
          />
        </GlassCard>
      </div>
    </>
  );
}
