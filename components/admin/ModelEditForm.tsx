"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { updateModel, type FormState } from "@/app/admin/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Tables } from "@/types/supabase";
import { Field, FormMessage, TextArea, TextInput } from "./fields";

/** Same output on server and client (no locale/timezone dependency): "2026-11-11 19:44". */
function formatUlaanbaatar(iso: string) {
  const utc8 = new Date(new Date(iso).getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().slice(0, 16).replace("T", " ");
}

export function ModelEditForm({ model }: { model: Tables<"models"> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateModel, {});
  const [image, setImage] = useState(model.card_image);

  return (
    <GlassCard as="article" className="p-6 sm:p-8">
      <form action={action} className="relative flex flex-col gap-6">
        <input type="hidden" name="slug" value={model.slug} />

        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="heading-5">{model.name}</h2>
            <p className="mt-1 font-mono text-xs text-muted-2">
              {model.slug} · засагдсан {formatUlaanbaatar(model.updated_at)}
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input type="checkbox" name="is_published" defaultChecked={model.is_published} className="size-4 accent-[var(--color-accent)]" />
            Сайт дээр харуулах
          </label>
        </header>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="relative aspect-[296/160] overflow-hidden rounded-xl border border-line bg-white/[0.03]">
            {image.startsWith("/assets/") && <Image src={image} alt="" fill sizes="220px" className="object-cover" />}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Нэр">
              <TextInput name="name" defaultValue={model.name} required />
            </Field>
            <Field label="Дараалал" hint="Бага тоо эхэнд гарна">
              <TextInput name="sort_order" type="number" step={1} defaultValue={model.sort_order} required />
            </Field>
            <Field label="Картын зураг" hint="/assets/images/… зам">
              <TextInput name="card_image" defaultValue={model.card_image} onChange={(e) => setImage(e.target.value)} required />
            </Field>
            <Field label="Зургийн тайлбар (alt)">
              <TextInput name="card_alt" defaultValue={model.card_alt} required />
            </Field>
          </div>
        </div>

        <Field label="Картын тайлбар">
          <TextArea name="card_description" defaultValue={model.card_description} rows={2} required />
        </Field>

        <Field label="Showcase бичвэр" hint="Догол мөр бүрийн хооронд хоосон мөр үлдээнэ">
          <TextArea name="showcase_paragraphs" defaultValue={model.showcase_paragraphs.join("\n\n")} rows={6} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Showcase товчны текст">
            <TextInput name="showcase_primary_action" defaultValue={model.showcase_primary_action} required />
          </Field>
          <Field label="Дэлгэрэнгүй холбоос" hint="Жишээ: /models/model-3. Хоосон бол хуудсан доторх хэсэг рүү үсэрнэ">
            <TextInput name="detail_href" defaultValue={model.detail_href ?? ""} />
          </Field>
        </div>

        <footer className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-linear-to-b from-accent to-accent-2 px-5 py-[11px] text-[15px] font-semibold text-accent-ink shadow-glow transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-glow-lg disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "Хадгалж байна…" : "Хадгалах"}
          </button>
          <FormMessage {...state} />
        </footer>
      </form>
    </GlassCard>
  );
}
