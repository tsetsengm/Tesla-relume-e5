import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderCheckout } from "@/components/order/OrderCheckout";
import { OrderProgress } from "@/components/order/OrderProgress";
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
  // ?trim=… from a trim card preselects it · ?canceled=1 when the buyer left the Byl page without paying
  const { trim: wanted, canceled } = await searchParams;
  const model = (await getModels()).find((m) => m.slug === slug);
  if (!model) notFound();

  const trims = getModelDetail(slug)?.trims.items.map((t) => ({ name: t.name, price: t.price })) ?? [];
  const backHref = model.detailHref ?? `/#${model.slug}`;

  return (
    <>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
          ← {model.name} руу буцах
        </Link>
        <OrderProgress kind={model.deposit ? "deposit" : "request"} current={0} className="sm:w-[440px]" />
      </div>

      {canceled === "1" && (
        <p role="status" className="mb-8 rounded-xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
          Төлбөр хийгдээгүй байна. Мэдээллээ шалгаад дахин оролдоно уу — захиалга төлбөр төлөгдөх хүртэл баталгаажихгүй.
        </p>
      )}

      <OrderCheckout
        slug={model.slug}
        model={{ name: model.name, image: model.card.image, alt: model.card.alt, description: model.card.description }}
        deposit={model.deposit}
        loanRate={model.loan?.rate}
        trims={trims}
        initialTrim={trims.find((t) => t.name === wanted)?.name}
      />
    </>
  );
}
