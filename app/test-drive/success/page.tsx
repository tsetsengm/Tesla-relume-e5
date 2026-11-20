import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/order/AutoRefresh";
import { OrderProgress } from "@/components/order/OrderProgress";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getTestDriveStatus } from "@/lib/test-drive";
import { formatSlot } from "@/lib/test-drive-slots";

export const metadata: Metadata = {
  title: "Туршилтын жолоодлого — Tesla",
  robots: { index: false },
};

/** Byl sends the customer here after paying (`success_url`). The webhook (or the Byl check below) confirms the hour. */
export default function TestDriveSuccessPage({ searchParams }: PageProps<"/test-drive/success">) {
  return (
    <Section className="min-h-[60vh]">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-6 py-16 text-center">
        <Suspense fallback={<p className="text-muted">Төлбөрийг шалгаж байна…</p>}>
          <BookingStatus searchParams={searchParams} />
        </Suspense>
      </div>
    </Section>
  );
}

async function BookingStatus({ searchParams }: { searchParams: PageProps<"/test-drive/success">["searchParams"] }) {
  const ref = (await searchParams).ref;
  await connection(); // live payment status, per request
  const booking = typeof ref === "string" ? await getTestDriveStatus(ref) : null;

  if (!booking) {
    return (
      <>
        <span className="tagline">Туршилтын жолоодлого</span>
        <h1 className="heading-2">Захиалга олдсонгүй</h1>
        <p className="text-lg leading-[1.65] text-muted">Холбоос буруу байна. Асуудал гарвал бидэнтэй холбогдоно уу.</p>
        <Button href="/test-drive" icon="arrow">
          Цаг захиалах
        </Button>
      </>
    );
  }

  const amount = `${booking.amount.toLocaleString("en-US")}₮`;
  const when = formatSlot(booking.slot_start);

  if (booking.status === "paid") {
    return (
      <>
        <OrderProgress kind="testDrive" current={2} complete className="mb-4 w-full max-w-[420px]" />
        <span className="tagline">Төлбөр амжилттай</span>
        <h1 className="heading-2">Туршилтын жолоодлого баталгаажлаа</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {booking.model_name} · <span className="text-ink">{when}</span>. {amount} урьдчилгаа хүлээн авлаа, баримт таны имэйл рүү илгээгдсэн.
        </p>
        <ol className="flex w-full flex-col gap-3 rounded-xl border border-line bg-white/[0.03] p-5 text-left text-sm text-muted">
          {["Менежер өмнөх өдөр нь утсаар сануулна", "Жолооны үнэмлэхээ авчирна уу", "Цагаасаа 10 минутын өмнө ирээрэй"].map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  if (booking.status === "conflict") {
    return (
      <>
        <span className="tagline">Төлбөр хүлээн авлаа</span>
        <h1 className="heading-2">Цагийг тань тохируулна</h1>
        <p className="text-lg leading-[1.65] text-muted">
          {amount} урьдчилгаа хүлээн авсан ч таныг төлбөр хийх хооронд {when} цагийг өөр хүн захиалчихсан байна. Менежер удахгүй утсаар холбогдож
          өөр цаг тохирно.
        </p>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </>
    );
  }

  return (
    <>
      <OrderProgress kind="testDrive" current={2} className="mb-4 w-full max-w-[420px]" />
      <span className="tagline">Хүлээгдэж байна</span>
      <h1 className="heading-2">Төлбөр баталгаажиж байна</h1>
      <p className="text-lg leading-[1.65] text-muted">
        {booking.model_name} · {when} — {amount}. Төлбөр Byl-ээс ирэнгүүт энэ хуудас өөрөө шинэчлэгдэнэ.
      </p>
      <AutoRefresh />
      <div className="flex flex-wrap justify-center gap-3.5">
        <Button href={`/test-drive/success?ref=${booking.id}`} variant="secondary">
          Шинэчлэх
        </Button>
        <Button href={`/test-drive?model=${booking.model_slug}&canceled=1`} variant="link" icon="chevron">
          Дахин цаг сонгох
        </Button>
      </div>
    </>
  );
}
