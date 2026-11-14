"use client";

import { Check, ExternalLink, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useActionState, useRef, useState } from "react";
import { type OrderState, type OrderValues, placeOrder } from "@/app/order/actions";
import { Field, TextArea, TextInput } from "@/components/admin/fields";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

type Trim = { name: string; price: string };

export type OrderCheckoutProps = {
  slug: string;
  model: { name: string; image: string; alt: string; description: string };
  /** Deposit in ₮ — when set, the form ends in the Byl payment step */
  deposit?: number;
  loanRate?: string;
  trims: Trim[];
  initialTrim?: string;
};

type Key = keyof OrderValues;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAY_METHODS = ["QPay", "SocialPay", "Голомт", "Pocket"];

/** "99112233" → "9911 2233" */
const formatPhone = (digits: string) => (digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits);

/** Same rules as the Server Action — checked here first so mistakes show up while typing. */
function validate(v: OrderValues, needEmail: boolean, trims: Trim[]): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {};
  if (v.name.trim().length < 2) e.name = "Овог нэрээ бичнэ үү";
  if (v.phone.length !== 8) e.phone = "8 оронтой утасны дугаар оруулна уу";
  if (needEmail ? !EMAIL.test(v.email) : v.email && !EMAIL.test(v.email)) e.email = "Имэйл хаяг буруу байна";
  if (trims.length && !trims.some((t) => t.name === v.trim)) e.trim = "Хувилбараа сонгоно уу";
  return e;
}

/**
 * Order page body: summary (left) + 3-step form (right), built on Don Norman's interaction principles —
 * discoverability, feedback, conceptual model, affordances, signifiers, mapping, constraints.
 */
export function OrderCheckout({ slug, model, deposit, loanRate, trims, initialTrim }: OrderCheckoutProps) {
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, {});
  const [values, setValues] = useState<OrderValues>({
    name: "",
    phone: "",
    email: "",
    trim: initialTrim ?? trims[0]?.name ?? "",
    note: "",
  });
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validate(values, !!deposit, trims);
  // Feedback: show an error once the field was left (or the form was submitted); the server's verdict counts too
  const errorFor = (k: Key) => (touched[k] || state.invalid?.includes(k) ? errors[k] : undefined);
  const okFor = (k: Key) => touched[k] && !errors[k] && !!values[k];
  const set = (k: Key, value: string) => setValues((v) => ({ ...v, [k]: value }));
  const blur = (k: Key) => setTouched((t) => ({ ...t, [k]: true }));

  const selectedTrim = trims.find((t) => t.name === values.trim);
  const amount = deposit?.toLocaleString("en-US");

  // Constraints: never send a form we already know is wrong — mark every field and jump to the first mistake
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const keys = Object.keys(errors) as Key[];
    if (!keys.length) return;
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, trim: true });
    formRef.current?.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus();
  }

  const inputState = (k: Key) => cn("pr-10", errorFor(k) && "border-red-400/70 focus:border-red-400", okFor(k) && "border-accent/40");
  // Feedback: a tick inside a correct field…
  const okMark = (k: Key) =>
    okFor(k) ? <Check aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-accent" /> : null;
  // …and the reason under a wrong one (otherwise the field's hint)
  const hint = (k: Key, text?: string) =>
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
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      {/* ---------- Summary — Mapping: follows the trim chosen on the right ---------- */}
      <GlassCard className="overflow-hidden lg:sticky lg:top-[96px]">
        <div className="relative aspect-[16/9]">
          <Image src={model.image} alt={model.alt} fill priority sizes="(max-width: 991px) 100vw, 480px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="tagline mb-2.5">Таны захиалга</p>
            <h1 className="heading-2">{selectedTrim?.name ?? model.name}</h1>
            <p className="mt-3 text-[15px] leading-[1.6] text-muted">{model.description}</p>
          </div>

          <dl className="flex flex-col gap-3 border-t border-line pt-5 text-sm">
            {selectedTrim && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Машины үнэ</dt>
                <dd key={selectedTrim.name} className="font-semibold text-ink">
                  {selectedTrim.price}
                </dd>
              </div>
            )}
            {deposit ? (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Одоо төлөх урьдчилгаа</dt>
                  <dd className="text-gradient text-lg font-extrabold">{amount}₮</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Үлдэгдэл</dt>
                  <dd className="text-right text-ink">
                    Гэрээ байгуулахад
                    <span className="block text-xs text-muted-2">бэлнээр эсвэл {loanRate ? `ногоон зээл ${loanRate}` : "банкны зээлээр"}</span>
                  </dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Төлбөр</dt>
                <dd className="text-ink">Одоо төлөхгүй</dd>
              </div>
            )}
          </dl>
        </div>
      </GlassCard>

      {/* ---------- Form ---------- */}
      <GlassCard tone="strong" className="p-6 sm:p-10">
        <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
          <input type="hidden" name="slug" value={slug} />
          <p className="-mb-4 text-xs text-muted-2">
            <span className="text-accent">*</span> — заавал бөглөх
          </p>

          {/* Disabled while sending — the inputs can't change under a request in flight */}
          <fieldset disabled={pending} className="contents">
            <Step n="01" title="Захиалагчийн мэдээлэл">
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
                    {/* Constraints: digits only, at most 8, grouped as 9911 2233 */}
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
                <Field label={deposit ? "Имэйл *" : "Имэйл"}>
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
                  {hint("email", deposit ? "Төлбөрийн баримт энэ хаяг руу очно" : undefined)}
                </Field>
              </div>
            </Step>

            {trims.length > 0 && (
              <Step n="02" title="Хувилбар сонгох">
                {/* Affordance: the whole card is the click target; the checked one lights up */}
                <div role="radiogroup" aria-label="Хувилбар" className="grid gap-3 sm:grid-cols-3">
                  {trims.map((t) => (
                    <label
                      key={t.name}
                      className="relative flex cursor-pointer flex-col gap-1 rounded-xl border border-line-strong bg-white/[0.03] p-4 transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-white/[0.06] has-[:checked]:border-accent/60 has-[:checked]:bg-accent/[0.08] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/50"
                    >
                      <input
                        type="radio"
                        name="trim"
                        value={t.name}
                        checked={values.trim === t.name}
                        onChange={() => set("trim", t.name)}
                        className="absolute top-4 right-4 accent-[var(--color-accent)]"
                      />
                      <span className="pr-6 text-[15px] font-semibold text-ink">{t.name}</span>
                      <span className="text-sm text-muted">{t.price}</span>
                    </label>
                  ))}
                </div>
                {hint("trim")}
              </Step>
            )}

            <Step n={trims.length ? "03" : "02"} title={deposit ? "Төлбөр" : "Нэмэлт мэдээлэл"}>
              <Field label="Тайлбар">
                <TextArea name="note" rows={3} maxLength={500} value={values.note} onChange={(e) => set("note", e.target.value)} />
                <span className="text-xs text-muted-2">Өнгө, хүргэлт, зээлийн талаар асуух зүйл гэх мэт · {values.note.length}/500</span>
              </Field>

              {deposit ? (
                // Common Region + signifiers: amount, methods and where the buyer goes next, in one box
                <div className="flex flex-col gap-4 rounded-xl border border-line bg-white/[0.03] p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-ink">Одоо төлөх</span>
                    <span className="text-gradient text-xl font-extrabold">{amount}₮</span>
                  </div>
                  <ul aria-label="Төлбөрийн хэлбэр" className="flex flex-wrap gap-2">
                    {PAY_METHODS.map((m) => (
                      <li key={m} className="rounded-full border border-line-strong bg-white/[0.04] px-3 py-1 text-xs text-muted">
                        {m}
                      </li>
                    ))}
                  </ul>
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-2">
                    <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    Төлбөрийг Byl-ийн аюулгүй хуудсанд хийнэ. Таны картын мэдээлэл манай сайтад хадгалагдахгүй.
                  </p>
                </div>
              ) : null}
            </Step>
          </fieldset>

          <div className="-mt-4 flex flex-col gap-3 border-l border-transparent pl-6 sm:pl-8">
            {state.message && !state.invalid && (
              <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {state.message}
              </p>
            )}
            <Button type="submit" disabled={pending} className="self-start max-sm:w-full">
              {pending ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                  {deposit ? "Byl руу шилжиж байна…" : "Илгээж байна…"}
                </>
              ) : deposit ? (
                <>
                  <Lock aria-hidden className="size-4" />
                  {amount}₮ төлөх
                </>
              ) : (
                "Захиалга илгээх"
              )}
            </Button>
            {deposit && !pending && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-2">
                Дараагийн алхамд byl.mn төлбөрийн хуудас нээгдэнэ <ExternalLink aria-hidden className="size-3" />
              </span>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

/** Step number + title on a left rule — the form reads 01 → 02 → 03. */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative flex flex-col gap-5 border-l border-line pl-6 sm:pl-8">
      <span className="absolute top-0 -left-[13px] grid size-[26px] place-items-center rounded-full border border-line-strong bg-bg text-[11px] font-semibold text-accent">
        {n}
      </span>
      <h2 className="heading-5 text-[20px]">{title}</h2>
      {children}
    </section>
  );
}
