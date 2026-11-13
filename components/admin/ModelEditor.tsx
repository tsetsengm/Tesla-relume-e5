"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { updateModel, type FormState } from "@/app/admin/actions";
import { ModelCard } from "@/components/home/ModelCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { isAllowedImageSrc } from "@/lib/images";
import { cn } from "@/lib/cn";
import type { Tables } from "@/types/supabase";
import { Field, FormMessage, TextArea, TextInput } from "./fields";
import { ImageUpload } from "./ImageUpload";

type Row = Tables<"models">;
type Neighbor = { slug: string; name: string } | null;

type Values = {
  name: string;
  sort_order: string;
  is_published: boolean;
  detail_href: string;
  card_image: string;
  card_alt: string;
  card_description: string;
  showcase_media_type: "image" | "video";
  showcase_image: string;
  showcase_image_alt: string;
  showcase_video_poster: string;
  showcase_video_label: string;
  showcase_paragraphs: string;
  showcase_primary_action: string;
  loan_rate: string;
  lease_from: string;
};

const fromRow = (m: Row): Values => ({
  name: m.name,
  sort_order: String(m.sort_order),
  is_published: m.is_published,
  detail_href: m.detail_href ?? "",
  card_image: m.card_image,
  card_alt: m.card_alt,
  card_description: m.card_description,
  showcase_media_type: m.showcase_media_type === "video" ? "video" : "image",
  showcase_image: m.showcase_image ?? "",
  showcase_image_alt: m.showcase_image_alt ?? "",
  showcase_video_poster: m.showcase_video_poster ?? "",
  showcase_video_label: m.showcase_video_label ?? "",
  showcase_paragraphs: m.showcase_paragraphs.join("\n\n"),
  showcase_primary_action: m.showcase_primary_action,
  loan_rate: m.loan_rate ?? "",
  lease_from: m.lease_from ?? "",
});

type ModelEditorProps = {
  model: Row;
  prev: Neighbor;
  next: Neighbor;
  supabaseUrl: string;
  supabaseKey: string;
};

export function ModelEditor({ model, prev, next, supabaseUrl, supabaseKey }: ModelEditorProps) {
  const saved = fromRow(model);
  const [values, setValues] = useState<Values>(saved);
  const [state, action, pending] = useActionState<FormState, FormData>(updateModel, {});
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));
  // After a save the page re-renders with the stored row, so this becomes false again
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  // ⌘S / Ctrl+S saves; warn before leaving with unsaved edits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty]);

  const imageProps = { slug: model.slug, supabaseUrl, supabaseKey };
  const previewImage = isAllowedImageSrc(values.card_image, supabaseUrl) ? values.card_image : model.card_image;

  return (
    <form ref={formRef} action={action} className="pb-28">
      <input type="hidden" name="slug" value={model.slug} />

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> Бүх загвар
          </Link>
          <h1 className="heading-2">{values.name || model.name}</h1>
          <p className="mt-2 font-mono text-xs text-muted-2">{model.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <NeighborLink neighbor={prev} dir="prev" />
          <NeighborLink neighbor={next} dir="next" />
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Panel title="Үндсэн">
            <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
              <Field label="Нэр">
                <TextInput name="name" value={values.name} onChange={(e) => set("name", e.target.value)} required />
              </Field>
              <Field label="Дараалал" hint="Бага нь эхэнд">
                <TextInput name="sort_order" type="number" step={1} value={values.sort_order} onChange={(e) => set("sort_order", e.target.value)} required />
              </Field>
            </div>
            <Field label="Дэлгэрэнгүй холбоос" hint="Жишээ: /models/model-3. Хоосон бол нүүр хуудасны хэсэг рүү үсэрнэ">
              <TextInput name="detail_href" value={values.detail_href} onChange={(e) => set("detail_href", e.target.value)} placeholder="/models/…" />
            </Field>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-white/[0.03] px-4 py-3">
              <span>
                <span className="block text-sm text-ink">Сайт дээр харуулах</span>
                <span className="text-xs text-muted-2">Унтраавал нүүр хуудаснаас нуугдана</span>
              </span>
              <input type="checkbox" name="is_published" checked={values.is_published} onChange={(e) => set("is_published", e.target.checked)} className="size-5 accent-[var(--color-accent)]" />
            </label>
          </Panel>

          <Panel title="Карт" description="Нүүр хуудасны 4 баганатай картууд">
            <div className="grid gap-5 sm:grid-cols-[260px_minmax(0,1fr)]">
              <ImageUpload name="card_image" label="Картын зураг" value={values.card_image} onChange={(src) => set("card_image", src)} {...imageProps} />
              <div className="flex flex-col gap-5">
                <Field label="Зургийн тайлбар (alt)" hint="Дэлгэц уншигч болон зураг ачаалагдаагүй үед">
                  <TextInput name="card_alt" value={values.card_alt} onChange={(e) => set("card_alt", e.target.value)} required />
                </Field>
                <Field label="Картын тайлбар">
                  <TextArea name="card_description" value={values.card_description} onChange={(e) => set("card_description", e.target.value)} rows={3} required />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Showcase" description="Нүүр хуудасны том зураг + бичвэртэй хэсэг">
            <input type="hidden" name="showcase_media_type" value={values.showcase_media_type} />
            <div className="inline-flex self-start rounded-full border border-line-strong p-1 text-sm" role="radiogroup" aria-label="Media төрөл">
              {(["image", "video"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={values.showcase_media_type === type}
                  onClick={() => set("showcase_media_type", type)}
                  className={cn(
                    "rounded-full px-4 py-1.5 transition-colors",
                    values.showcase_media_type === type ? "bg-white/10 text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {type === "image" ? "Зураг" : "Видео"}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-[260px_minmax(0,1fr)]">
              {values.showcase_media_type === "image" ? (
                <>
                  <ImageUpload name="showcase_image" label="Showcase зураг" aspect="4/3" value={values.showcase_image} onChange={(src) => set("showcase_image", src)} {...imageProps} />
                  <Field label="Зургийн тайлбар (alt)">
                    <TextInput name="showcase_image_alt" value={values.showcase_image_alt} onChange={(e) => set("showcase_image_alt", e.target.value)} />
                  </Field>
                </>
              ) : (
                <>
                  <ImageUpload name="showcase_video_poster" label="Видеоны poster зураг" aspect="4/3" value={values.showcase_video_poster} onChange={(src) => set("showcase_video_poster", src)} {...imageProps} />
                  <Field label="Play товчны тайлбар" hint="Дэлгэц уншигчид зориулсан">
                    <TextInput name="showcase_video_label" value={values.showcase_video_label} onChange={(e) => set("showcase_video_label", e.target.value)} />
                  </Field>
                </>
              )}
            </div>

            <Field label="Бичвэр" hint="Догол мөр бүрийн хооронд хоосон мөр үлдээнэ">
              <TextArea name="showcase_paragraphs" value={values.showcase_paragraphs} onChange={(e) => set("showcase_paragraphs", e.target.value)} rows={7} required />
            </Field>
            <Field label="Ногоон товчны текст" hint="Showcase-ийн гол үйлдэл, жишээ: Одоо захиалах">
              <TextInput name="showcase_primary_action" value={values.showcase_primary_action} onChange={(e) => set("showcase_primary_action", e.target.value)} required />
            </Field>
          </Panel>

          <Panel title="Зээл" description="Showcase доторх 'Ногоон зээл' хайрцаг. Хоёулаа хоосон бол хайрцаг харагдахгүй">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Жилийн хүү" hint="Жишээ: 1.99%">
                <TextInput name="loan_rate" value={values.loan_rate} onChange={(e) => set("loan_rate", e.target.value)} placeholder="1.99%" />
              </Field>
              <Field label="Сарын түрээс эхлэх үнэ" hint="Жишээ: $439">
                <TextInput name="lease_from" value={values.lease_from} onChange={(e) => set("lease_from", e.target.value)} placeholder="$439" />
              </Field>
            </div>
          </Panel>
        </div>

        {/* Live preview */}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-[96px]">
          <p className="text-[13px] font-medium text-muted">Урьдчилан харах</p>
          <div className={cn("transition-opacity", !values.is_published && "opacity-50")}>
            <ModelCard
              model={{
                slug: model.slug,
                name: values.name || "—",
                detailHref: values.detail_href || undefined,
                card: { image: previewImage, alt: values.card_alt, description: values.card_description || "—" },
                showcase: { media: { type: "image", src: previewImage, alt: "" }, paragraphs: [], primaryAction: "" },
              }}
            />
          </div>
          {!values.is_published && <p className="text-xs text-muted-2">Нуугдсан: нүүр хуудсан дээр харагдахгүй.</p>}
          <Link href={`/#${model.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
            Сайт дээр харах <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </aside>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/85 backdrop-blur-[16px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3 text-sm">
            <span className={cn("size-2 rounded-full", dirty ? "bg-amber-300" : "bg-accent")} aria-hidden />
            {dirty ? <span className="text-ink">Хадгалаагүй өөрчлөлт байна</span> : <span className="text-muted">Бүх өөрчлөлт хадгалагдсан</span>}
            {!dirty && <FormMessage ok={state.ok} message={state.message} />}
            {dirty && state.message && !state.ok && <FormMessage message={state.message} />}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValues(saved)}
              disabled={!dirty || pending}
              className="rounded-full border border-line-strong px-4 py-2 text-sm text-ink transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
            >
              Болих
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-linear-to-b from-accent to-accent-2 px-5 py-2 text-sm font-semibold text-accent-ink shadow-glow transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-glow-lg disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? "Хадгалж байна…" : "Хадгалах"} <kbd className="ml-1.5 hidden font-sans text-xs opacity-60 sm:inline">⌘S</kbd>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <GlassCard className="p-6 sm:p-7">
      <div className="relative flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
        </div>
        {children}
      </div>
    </GlassCard>
  );
}

function NeighborLink({ neighbor, dir }: { neighbor: Neighbor; dir: "prev" | "next" }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  const label = dir === "prev" ? "Өмнөх" : "Дараах";
  if (!neighbor) {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted-2 opacity-40" aria-hidden>
        <Icon className="size-4" />
      </span>
    );
  }
  return (
    <Link
      href={`/admin/models/${neighbor.slug}`}
      title={`${label}: ${neighbor.name}`}
      aria-label={`${label}: ${neighbor.name}`}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:bg-white/10"
    >
      <Icon className="size-4" />
    </Link>
  );
}
