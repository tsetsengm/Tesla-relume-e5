import type { Metadata } from "next";
import { Suspense } from "react";
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

  if (order.status === "request") {
    return (
      <>
        <span className="tagline">Хүсэлт илгээгдлээ</span>
        <h1 className="heading-2">Захиалгын хүсэлт хүлээн авлаа</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {order.model_name}-ийн захиалгын хүсэлтийг хүлээн авлаа. Манай борлуулалтын менежер 24 цагийн дотор тантай холбогдож үнэ, хүргэлтийн
          нөхцөлийг танилцуулна.
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
        <span className="tagline">Төлбөр амжилттай</span>
        <h1 className="heading-2">Захиалга баталгаажлаа</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {order.model_name}-ийн {amount} урьдчилгаа хүлээн авлаа. Манай борлуулалтын менежер тантай удахгүй холбогдоно.
          Баримт таны имэйл рүү илгээгдсэн.
        </p>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  return (
    <>
      <span className="tagline">Хүлээгдэж байна</span>
      <h1 className="heading-2">Төлбөр баталгаажиж байна</h1>
      <p className="text-lg leading-[1.65] text-muted">
        {order.model_name} — {amount}. Төлбөрөө төлсөн бол хэдхэн секундын дараа шинэчилнэ үү.
      </p>
      <div className="flex flex-wrap justify-center gap-3.5">
        <Button href={`/order/success?ref=${order.id}`}>Шинэчлэх</Button>
        <Button href="/" variant="secondary">
          Нүүр хуудас
        </Button>
      </div>
    </>
  );
}
