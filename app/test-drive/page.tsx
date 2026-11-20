import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { TestDriveBooking } from "@/components/test-drive/TestDriveBooking";
import { Section } from "@/components/ui/Section";
import { getModels } from "@/lib/models";
import { takenSlots } from "@/lib/test-drive";
import { allSlots } from "@/lib/test-drive-slots";

export const metadata: Metadata = {
  title: "Туршилтын жолоодлого — Tesla",
  description: "Машинаа сонгоод, өөрт тохирох цагаа захиалж туршилтын жолоодлого хийгээрэй.",
};

export default function TestDrivePage({ searchParams }: PageProps<"/test-drive">) {
  return (
    <Section className="pt-10 sm:pt-12 lg:pt-16">
      <Suspense fallback={<p className="py-20 text-center text-muted">Сул цагуудыг ачаалж байна…</p>}>
        <Booking searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}

async function Booking({ searchParams }: { searchParams: PageProps<"/test-drive">["searchParams"] }) {
  // ?model=… from a model page preselects the car · ?canceled=1 when the customer left Byl without paying
  const { model, canceled } = await searchParams;
  // Free hours depend on the current time and live bookings: always render per request
  await connection();
  const [models, taken] = await Promise.all([getModels(), takenSlots()]);
  const cars = models.map((m) => ({ slug: m.slug, name: m.name, image: m.card.image, alt: m.card.alt }));

  return (
    <>
      {canceled === "1" && (
        <p role="status" className="mb-8 rounded-xl border border-amber-300/30 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
          Төлбөр хийгдээгүй тул цаг баталгаажаагүй байна. Цагаа дахин сонгоод төлбөрөө хийнэ үү.
        </p>
      )}
      <TestDriveBooking
        cars={cars}
        slots={allSlots(new Date())}
        taken={taken}
        initialCar={cars.find((c) => c.slug === model)?.slug}
      />
    </>
  );
}
