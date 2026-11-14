import type { Metadata } from "next";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/order/AutoRefresh";
import { OrderProgress } from "@/components/order/OrderProgress";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getOrderStatus } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Захиалга — Tesla",
  robots: { index: false },
};

/** Byl sends the buyer here after paying (`success_url`). The webhook is what confirms the order. */
export default function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  return (
    <Section className="min-h-[60vh]">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-6 py-16 text-center">
        <Suspense fallback={<p className="text-muted">Төлбөрийг шалгаж байна…</p>}>
          <OrderStatus searchParams={searchParams} />
        </Suspense>
      </div>
    </Section>
  );
}

async function OrderStatus({ searchParams }: { searchParams: PageProps<"/order/success">["searchParams"] }) {
  const ref = (await searchParams).ref;
  const order = typeof ref === "string" ? await getOrderStatus(ref) : null;

  if (!order) {
    return (
      <>
        <span className="tagline">Захиалга</span>
        <h1 className="heading-2">Захиалга олдсонгүй</h1>
        <p className="text-lg leading-[1.65] text-muted">Холбоос буруу байна. Асуудал гарвал бидэнтэй холбогдоно уу.</p>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  const amount = `${(order.amount ?? 0).toLocaleString("en-US")}₮`;
  const item = order.trim ?? order.model_name;

  if (order.status === "request") {
    return (
      <>
        <OrderProgress kind="request" current={2} complete className="mb-4 w-full max-w-[420px]" />
        <span className="tagline">Хүсэлт илгээгдлээ</span>
        <h1 className="heading-2">Захиалгын хүсэлт хүлээн авлаа</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {item}-ийн захиалгын хүсэлтийг хүлээн авлаа. Манай борлуулалтын менежер 24 цагийн дотор тантай холбогдож үнэ, хүргэлтийн нөхцөлийг
          танилцуулна.
        </p>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  if (order.status === "paid") {
    return (
      <>
        <OrderProgress kind="deposit" current={2} complete className="mb-4 w-full max-w-[420px]" />
        <span className="tagline">Төлбөр амжилттай</span>
        <h1 className="heading-2">Захиалга баталгаажлаа</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {item}-ийн {amount} урьдчилгаа хүлээн авлаа. Төлбөрийн баримт таны имэйл рүү илгээгдсэн.
        </p>
        {/* Conceptual model: what happens after paying */}
        <ol className="flex w-full flex-col gap-3 rounded-xl border border-line bg-white/[0.03] p-5 text-left text-sm text-muted">
          {["Менежер 24 цагийн дотор утсаар холбогдоно", "Гэрээ байгуулж, үлдэгдлийн төлбөрөө (бэлэн эсвэл зээл) тохирно", "Машинаа хүлээн авна"].map(
            (s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">{i + 1}</span>
                {s}
              </li>
            ),
          )}
        </ol>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  return (
    <>
      <OrderProgress kind="deposit" current={1} className="mb-4 w-full max-w-[420px]" />
      <span className="tagline">Хүлээгдэж байна</span>
      <h1 className="heading-2">Төлбөр баталгаажиж байна</h1>
      <p className="text-lg leading-[1.65] text-muted">
        {item} — {amount}. Төлбөр Byl-ээс ирэнгүүт энэ хуудас өөрөө шинэчлэгдэнэ.
      </p>
      <AutoRefresh />
      <div className="flex flex-wrap justify-center gap-3.5">
        <Button href={`/order/success?ref=${order.id}`} variant="secondary">
          Шинэчлэх
        </Button>
        <Button href={`/order/${order.model_slug}?canceled=1`} variant="link" icon="chevron">
          Төлбөрөө дахин хийх
        </Button>
      </div>
    </>
  );
}
