"use client";

import { CalendarClock, Check, ExternalLink, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useActionState, useMemo, useRef, useState } from "react";
import { bookTestDrive, type TestDriveState, type TestDriveValues } from "@/app/test-drive/actions";
import { Field, TextArea, TextInput } from "@/components/admin/fields";
import { Step } from "@/components/order/OrderCheckout";
import { OrderProgress } from "@/components/order/OrderProgress";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";
import { formatSlot, HOLD_MINUTES, sameSlot, slotParts, TEST_DRIVE_DEPOSIT } from "@/lib/test-drive-slots";

type CarOption = { slug: string; name: string; image: string; alt: string };

export type TestDriveBookingProps = {
  cars: CarOption[];
  /** Every bookable hour from now on (ISO), including taken ones */
  slots: string[];
  /** Hours already booked or held */
  taken: string[];
  initialCar?: string;
};

type DetailKey = "name" | "phone" | "email";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const amount = `${TEST_DRIVE_DEPOSIT.toLocaleString("en-US")}₮`;
const formatPhone = (digits: string) => (digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits);

function validate(v: TestDriveValues): Partial<Record<DetailKey, string>> {
  const e: Partial<Record<DetailKey, string>> = {};
  if (v.name.trim().length < 2) e.name = "Овог нэрээ бичнэ үү";
  if (v.phone.length !== 8) e.phone = "8 оронтой утасны дугаар оруулна уу";
  if (!EMAIL.test(v.email)) e.email = "Имэйл хаяг буруу байна";
  return e;
}

/**
 * Test-drive booking: 01 car → 02 day + hour → 03 details, then the 20,000₮ deposit on Byl.
 * The summary on the left follows every choice; steps unlock in order, so the hour is always picked for a car.
 */
export function TestDriveBooking({ cars, slots, taken, initialCar }: TestDriveBookingProps) {
  const [state, action, pending] = useActionState<TestDriveState, FormData>(bookTestDrive, {});
  const [values, setValues] = useState<TestDriveValues>({
    model: initialCar ?? "",
    slot: "",
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [touched, setTouched] = useState<Partial<Record<DetailKey, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof TestDriveValues, value: string) => setValues((v) => ({ ...v, [k]: value }));
  const blur = (k: DetailKey) => setTouched((t) => ({ ...t, [k]: true }));

  // Hours booked meanwhile (reported by the server) count as taken too
  const takenAll = useMemo(() => (state.takenSlot ? [...taken, state.takenSlot] : taken), [taken, state.takenSlot]);
  const isTaken = (iso: string) => takenAll.some((t) => sameSlot(t, iso));

  // Slots grouped by Ulaanbaatar day, in order
  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots) {
      const key = slotParts(s).dayKey;
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()].map(([key, list]) => ({ key, list, parts: slotParts(list[0]) }));
  }, [slots]);
  const firstOpenDay = days.find((d) => d.list.some((s) => !takenAll.some((t) => sameSlot(t, s))))?.key ?? days[0]?.key;
  const [day, setDay] = useState(firstOpenDay);
  const activeDay = days.find((d) => d.key === day) ?? days[0];

  const car = cars.find((c) => c.slug === values.model);
  // A chosen hour that turned out to be taken is dropped
  const slot = values.slot && !isTaken(values.slot) ? values.slot : "";
  const errors = validate(values);
  const errorFor = (k: DetailKey) => (touched[k] || state.invalid?.includes(k) ? errors[k] : undefined);
  const okFor = (k: DetailKey) => touched[k] && !errors[k] && !!values[k];
  const step = !car ? 0 : !slot ? 1 : 2;

  // Constraints: never send a form we already know is incomplete — jump to the first gap instead
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const missing = !car ? "model" : !slot ? "slot-choice" : (Object.keys(errors)[0] as DetailKey | undefined);
    if (!missing) return;
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    formRef.current?.querySelector<HTMLElement>(`[name="${missing}"]`)?.focus();
  }

  const inputState = (k: DetailKey) => cn("pr-10", errorFor(k) && "border-red-400/70 focus:border-red-400", okFor(k) && "border-accent/40");
  const okMark = (k: DetailKey) =>
    okFor(k) ? <Check aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-accent" /> : null;
  const hint = (k: DetailKey, text?: string) =>
    errorFor(k) ? (
      <span id={`${k}-msg`} role="alert" className="text-xs text-red-300">
        {errorFor(k)}
      </span>
    ) : text ? (
      <span id={`${k}-msg`} className="text-xs text-muted-2">
        {text}
      </span>
    ) : null;

  return (
    <>
      <OrderProgress kind="testDrive" current={step} className="mb-8 sm:ml-auto sm:w-[440px]" />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* ---------- Summary — follows every choice on the right ---------- */}
        <GlassCard className="overflow-hidden lg:sticky lg:top-[96px]">
          <div className="relative aspect-[16/9] bg-white/[0.03]">
            {car ? (
              <Image key={car.slug} src={car.image} alt={car.alt} fill priority sizes="(max-width: 991px) 100vw, 480px" className="object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-2">Машинаа сонгоно уу</div>
            )}
          </div>
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <p className="tagline mb-2.5">Туршилтын жолоодлого</p>
              <h1 className="heading-2">{car?.name ?? "Test drive"}</h1>
            </div>
            <dl className="flex flex-col gap-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Цаг</dt>
                <dd className="text-right font-semibold text-ink">{slot ? formatSlot(slot) : "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Үргэлжлэх хугацаа</dt>
                <dd className="text-ink">1 цаг</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Урьдчилгаа</dt>
                <dd className="text-gradient text-lg font-extrabold">{amount}</dd>
              </div>
            </dl>
          </div>
        </GlassCard>

        {/* ---------- Form ---------- */}
        <GlassCard tone="strong" className="p-6 sm:p-10">
          <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
            <input type="hidden" name="slot" value={slot} />

            <fieldset disabled={pending} className="contents">
              <Step n="01" title="Машинаа сонгоно уу">
                <div role="radiogroup" aria-label="Машин" className="grid gap-3 sm:grid-cols-2">
                  {cars.map((c) => (
                    <label
                      key={c.slug}
                      className="relative flex cursor-pointer items-center gap-4 rounded-xl border border-line-strong bg-white/[0.03] p-3 pr-10 transition-[background-color,border-color,translate] hover:-translate-y-0.5 hover:bg-white/[0.06] has-[:checked]:border-accent/60 has-[:checked]:bg-accent/[0.08] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50"
                    >
                      <input
                        type="radio"
                        name="model"
                        value={c.slug}
                        checked={values.model === c.slug}
                        onChange={() => set("model", c.slug)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 accent-[var(--color-accent)]"
                      />
                      <Image src={c.image} alt="" width={96} height={54} className="aspect-[16/9] w-24 shrink-0 rounded-lg object-cover" />
                      <span className="text-[15px] font-semibold text-ink">{c.name}</span>
                    </label>
                  ))}
                </div>
                {state.invalid?.includes("model") && !car && (
                  <span role="alert" className="text-xs text-red-300">
                    Машинаа сонгоно уу
                  </span>
                )}
              </Step>

              {/* Constraint: the hour is picked for a car, so this step opens once a car is chosen */}
              <fieldset disabled={!car || pending} className="contents">
                <Step n="02" title="Өдөр, цагаа сонгоно уу">
                  {!car && <p className="-mt-2 text-sm text-muted-2">Эхлээд машинаа сонгоно уу.</p>}
                  <div className={cn("flex flex-col gap-5 transition-opacity", !car && "pointer-events-none opacity-40")}>
                    {/* Days */}
                    <div role="tablist" aria-label="Өдөр" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                      {days.map((d) => {
                        const open = d.list.filter((s) => !isTaken(s)).length;
                        const active = d.key === activeDay?.key;
                        return (
                          <button
                            key={d.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setDay(d.key)}
                            className={cn(
                              "flex min-w-[64px] shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 transition-colors",
                              active ? "border-accent/60 bg-accent/[0.08] text-ink" : "border-line-strong bg-white/[0.03] text-muted hover:bg-white/[0.06]",
                              open === 0 && "opacity-50",
                            )}
                          >
                            <span className="text-xs">{d.parts.weekdayShort}</span>
                            <span className="text-lg font-bold leading-tight">{d.parts.date}</span>
                            <span className="text-[11px] text-muted-2">{d.parts.month}-р сар</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Hours of the chosen day */}
                    <div role="radiogroup" aria-label="Цаг" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {activeDay?.list.map((s) => {
                        const busy = isTaken(s);
                        return (
                          <label
                            key={s}
                            className={cn(
                              "relative flex flex-col items-center rounded-xl border px-3 py-2.5 text-center transition-colors",
                              busy
                                ? "cursor-not-allowed border-line bg-transparent text-muted-2 line-through decoration-muted-2/60"
                                : "cursor-pointer border-line-strong bg-white/[0.03] text-ink hover:bg-white/[0.06] has-[:checked]:border-accent/60 has-[:checked]:bg-accent/[0.08] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50",
                            )}
                          >
                            <input
                              type="radio"
                              name="slot-choice"
                              value={s}
                              disabled={busy}
                              checked={!!slot && sameSlot(slot, s)}
                              onChange={() => set("slot", s)}
                              className="sr-only"
                            />
                            <span className="text-[15px] font-semibold">{slotParts(s).time}</span>
                            <span className={cn("text-[11px]", busy ? "no-underline" : "text-muted-2")}>{busy ? "Захиалагдсан" : "Сул"}</span>
                          </label>
                        );
                      })}
                    </div>
                    {state.invalid?.includes("slot") && !slot && (
                      <span role="alert" className="text-xs text-red-300">
                        Цагаа сонгоно уу
                      </span>
                    )}
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-2">
                      <CalendarClock aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      Нэг цагт зөвхөн нэг хүн. Сонгосон цаг тань төлбөр хийх хүртэл {HOLD_MINUTES} минут хадгалагдана.
                    </p>
                  </div>
                </Step>
              </fieldset>

              <Step n="03" title="Таны мэдээлэл">
                <Field label="Овог нэр *">
                  <div className="relative">
                    <TextInput
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => blur("name")}
                      aria-invalid={!!errorFor("name")}
                      aria-describedby="name-msg"
                      className={inputState("name")}
                    />
                    {okMark("name")}
                  </div>
                  {hint("name")}
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Утасны дугаар *">
                    <div className="relative">
                      <TextInput
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="9911 2233"
                        maxLength={9}
                        value={formatPhone(values.phone)}
                        onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 8))}
                        onBlur={() => blur("phone")}
                        aria-invalid={!!errorFor("phone")}
                        aria-describedby="phone-msg"
                        className={inputState("phone")}
                      />
                      {okMark("phone")}
                    </div>
                    {hint("phone", "Менежер энэ дугаараар холбогдоно")}
                  </Field>
                  <Field label="Имэйл *">
                    <div className="relative">
                      <TextInput
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value.trim())}
                        onBlur={() => blur("email")}
                        aria-invalid={!!errorFor("email")}
                        aria-describedby="email-msg"
                        className={inputState("email")}
                      />
                      {okMark("email")}
                    </div>
                    {hint("email", "Төлбөрийн баримт энэ хаяг руу очно")}
                  </Field>
                </div>
                <Field label="Тайлбар">
                  <TextArea name="note" rows={2} maxLength={500} value={values.note} onChange={(e) => set("note", e.target.value)} />
                  <span className="text-xs text-muted-2">Жолооны үнэмлэхний ангилал, асуух зүйл гэх мэт · {values.note.length}/500</span>
                </Field>

                <div className="flex flex-col gap-3 rounded-xl border border-line bg-white/[0.03] p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-ink">Одоо төлөх урьдчилгаа</span>
                    <span className="text-gradient text-xl font-extrabold">{amount}</span>
                  </div>
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-2">
                    <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    Төлбөрийг Byl-ийн аюулгүй хуудсанд хийнэ. Урьдчилгаа төлөгдсөнөөр таны цаг баталгаажна.
                  </p>
                </div>
              </Step>
            </fieldset>

            <div className="-mt-4 flex flex-col gap-3 pl-6 sm:pl-8">
              {state.message && (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {state.message}
                </p>
              )}
              <Button type="submit" disabled={pending} className="self-start max-sm:w-full">
                {pending ? (
                  <>
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    Byl руу шилжиж байна…
                  </>
                ) : (
                  <>
                    <Lock aria-hidden className="size-4" />
                    {amount} төлөөд цаг баталгаажуулах
                  </>
                )}
              </Button>
              {!pending && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-2">
                  Дараагийн алхамд byl.mn төлбөрийн хуудас нээгдэнэ <ExternalLink aria-hidden className="size-3" />
                </span>
              )}
            </div>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
