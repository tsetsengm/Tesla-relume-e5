"use client";

import { ChevronRight, Eye, EyeOff, ImageOff, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { setPublished } from "@/app/admin/actions";
import { isAllowedImageSrc } from "@/lib/images";
import { cn } from "@/lib/cn";
import type { Tables } from "@/types/supabase";

type Row = Pick<Tables<"models">, "slug" | "name" | "sort_order" | "is_published" | "card_image" | "updated_at">;
type Filter = "all" | "published" | "hidden";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Бүгд" },
  { id: "published", label: "Харагдаж буй" },
  { id: "hidden", label: "Нуусан" },
];

function formatUlaanbaatar(iso: string) {
  const utc8 = new Date(new Date(iso).getTime() + 8 * 60 * 60 * 1000);
  return utc8.toISOString().slice(0, 16).replace("T", " ");
}

export function ModelList({ models, supabaseUrl }: { models: Row[]; supabaseUrl: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // Flip the badge instantly; the server action confirms (or the list snaps back on error)
  const [rows, setOptimistic] = useOptimistic(models, (current, change: { slug: string; is_published: boolean }) =>
    current.map((m) => (m.slug === change.slug ? { ...m, is_published: change.is_published } : m)),
  );

  const counts = {
    all: rows.length,
    published: rows.filter((m) => m.is_published).length,
    hidden: rows.filter((m) => !m.is_published).length,
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (m) =>
        (filter === "all" || (filter === "published") === m.is_published) &&
        (!q || m.name.toLowerCase().includes(q) || m.slug.includes(q)),
    );
  }, [rows, query, filter]);

  function toggle(slug: string, next: boolean) {
    setError(null);
    startTransition(async () => {
      setOptimistic({ slug, is_published: next });
      const result = await setPublished(slug, next);
      if (!result.ok) setError(result.message ?? "Өөрчилж чадсангүй.");
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Загвар хайх…"
            aria-label="Загвар хайх"
            className="w-full rounded-full border border-line-strong bg-white/[0.04] py-2.5 pr-4 pl-10 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-accent/50"
          />
        </label>
        <div className="inline-flex rounded-full border border-line-strong p-1 text-sm" role="tablist" aria-label="Шүүлтүүр">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn("rounded-full px-3.5 py-1.5 transition-colors", filter === f.id ? "bg-white/10 text-ink" : "text-muted hover:text-ink")}
            >
              {f.label} <span className="ml-1 text-xs text-muted-2">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {/* Rows */}
      <ul className="overflow-hidden rounded-card border border-line bg-glass">
        {visible.map((m) => (
          <li key={m.slug} className="group flex items-center gap-4 border-b border-line px-4 py-3 last:border-b-0 sm:gap-5 sm:px-5">
            <Link href={`/admin/models/${m.slug}`} className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
              <span className={cn("relative aspect-[296/160] w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-white/[0.04] sm:w-28", !m.is_published && "opacity-50")}>
                {isAllowedImageSrc(m.card_image, supabaseUrl) ? (
                  <Image src={m.card_image} alt="" fill sizes="112px" className="object-cover" />
                ) : (
                  <ImageOff className="absolute inset-0 m-auto size-5 text-muted-2" aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold text-ink group-hover:text-accent">{m.name}</span>
                <span className="block truncate font-mono text-[11px] text-muted-2">
                  #{m.sort_order} · {m.slug} · {formatUlaanbaatar(m.updated_at)}
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => toggle(m.slug, !m.is_published)}
              title={m.is_published ? "Нүүр хуудаснаас нуух" : "Нүүр хуудсан дээр харуулах"}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                m.is_published ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15" : "border-line-strong text-muted hover:text-ink",
              )}
            >
              {m.is_published ? <Eye className="size-3.5" aria-hidden /> : <EyeOff className="size-3.5" aria-hidden />}
              <span className="hidden sm:inline">{m.is_published ? "Харагдаж байна" : "Нуусан"}</span>
            </button>

            <Link href={`/admin/models/${m.slug}`} aria-label={`${m.name} засах`} className="hidden shrink-0 text-muted transition-colors hover:text-ink sm:block">
              <ChevronRight className="size-5" aria-hidden />
            </Link>
          </li>
        ))}
        {visible.length === 0 && <li className="px-5 py-10 text-center text-sm text-muted">Илэрц олдсонгүй.</li>}
      </ul>
    </div>
  );
}
