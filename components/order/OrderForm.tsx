"use client";

import { useActionState } from "react";
import { type OrderState, type OrderValues, placeOrder } from "@/app/order/actions";
import { Field, TextArea, TextInput } from "@/components/admin/fields";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type OrderFormProps = {
  slug: string;
  modelName: string;
  /** Deposit in ₮ — when set, the form ends in the Byl payment step */
  deposit?: number;
  trims: { name: string; price: string }[];
  initialTrim?: string;
};

const invalidCls = "border-red-400/70 focus:border-red-400";

/** Step number + title — the form reads as 01 → 02 → 03 (Uniform Connectedness via the left rule). */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="relative flex flex-col gap-5 border-l border-line pl-6 sm:pl-8">
      <span className="absolute top-0 -left-[13px] grid size-[26px] place-items-center rounded-full border border-line-strong bg-bg text-[11px] font-semibold text-accent">
        {n}
      </span>
      {/* <legend> ignores the fieldset's flex gap — padding keeps it apart from the first field */}
      <legend className="heading-5 pb-4 text-[20px]">{title}</legend>
      {children}
    </fieldset>
  );
}

export function OrderForm({ slug, modelName, deposit, trims, initialTrim }: OrderFormProps) {
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, {});
  const v: Partial<OrderValues> = state.values ?? {};
  const bad = (k: keyof OrderValues) => state.invalid?.includes(k);
  const amount = deposit?.toLocaleString("en-US");

  return (
    <form action={action} className="flex flex-col gap-10" noValidate>
      <input type="hidden" name="slug" value={slug} />

      <Step n="01" title="Захиалагчийн мэдээлэл">
        <Field label="Овог нэр *">
          <TextInput name="name" autoComplete="name" defaultValue={v.name} required aria-invalid={bad("name")} className={cn(bad("name") && invalidCls)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Утасны дугаар *" hint={bad("phone") ? "8 оронтой дугаар оруулна уу" : undefined}>
            <TextInput
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="9911 2233"
              defaultValue={v.phone}
              required
              aria-invalid={bad("phone")}
              className={cn(bad("phone") && invalidCls)}
            />
          </Field>
          <Field label={deposit ? "Имэйл *" : "Имэйл"} hint={deposit ? "Төлбөрийн баримт энэ хаяг руу очно" : undefined}>
            <TextInput
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={v.email}
              required={!!deposit}
              aria-invalid={bad("email")}
              className={cn(bad("email") && invalidCls)}
            />
          </Field>
        </div>
      </Step>

      {trims.length > 0 && (
        <Step n="02" title="Хувилбар сонгох">
          <div className={cn("grid gap-3 sm:grid-cols-3", bad("trim") && "rounded-xl ring-1 ring-red-400/60")}>
            {trims.map((t, i) => (
              <label
                key={t.name}
                className="group relative flex cursor-pointer flex-col gap-1 rounded-xl border border-line-strong bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06] has-[:checked]:border-accent/60 has-[:checked]:bg-accent/[0.08]"
              >
                <input
                  type="radio"
                  name="trim"
                  value={t.name}
                  defaultChecked={(v.trim || initialTrim) ? (v.trim || initialTrim) === t.name : i === 0}
                  className="absolute top-4 right-4 accent-[var(--color-accent)]"
                />
                <span className="pr-6 text-[15px] font-semibold text-ink">{t.name}</span>
                <span className="text-sm text-muted">{t.price}</span>
              </label>
            ))}
          </div>
        </Step>
      )}

      <Step n={trims.length ? "03" : "02"} title={deposit ? "Төлбөр" : "Нэмэлт мэдээлэл"}>
        <Field label="Тайлбар" hint="Өнгө, хүргэлт, зээлийн талаар асуух зүйл гэх мэт">
          <TextArea name="note" rows={3} defaultValue={v.note} maxLength={500} />
        </Field>

        {deposit ? (
          // Common Region: everything about the payment in one box
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-white/[0.03] p-5">
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{modelName} — захиалгын урьдчилгаа</dt>
                <dd className="text-ink">{amount}₮</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2.5">
                <dt className="font-semibold text-ink">Одоо төлөх</dt>
                <dd className="text-gradient text-xl font-extrabold">{amount}₮</dd>
              </div>
            </dl>
            <p className="text-xs leading-relaxed text-muted-2">
              QPay · SocialPay · Голомт · Pocket — Byl-ийн аюулгүй төлбөрийн хуудас руу шилжиж төлнө. Үлдэгдлийг гэрээ байгуулахдаа бэлнээр эсвэл
              банкны зээлээр төлнө.
            </p>
          </div>
        ) : null}

        {state.message && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {state.message}
          </p>
        )}

        <Button type="submit" icon="arrow" className={cn("self-start max-sm:w-full", pending && "pointer-events-none opacity-70")}>
          {pending ? (deposit ? "Byl руу шилжиж байна…" : "Илгээж байна…") : deposit ? `Byl-ээр ${amount}₮ төлөх` : "Захиалга илгээх"}
        </Button>
      </Step>
    </form>
  );
}
