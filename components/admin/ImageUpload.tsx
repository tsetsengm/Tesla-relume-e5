"use client";

import { createClient } from "@supabase/supabase-js";
import { ImageUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { createImageUpload } from "@/app/admin/actions";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, MODEL_IMAGES_BUCKET, isAllowedImageSrc } from "@/lib/images";
import { cn } from "@/lib/cn";

type ImageUploadProps = {
  /** Form field the image URL is submitted as */
  name: string;
  label: string;
  slug: string;
  value: string;
  onChange: (src: string) => void;
  supabaseUrl: string;
  supabaseKey: string;
  /** CSS aspect-ratio of the preview, e.g. "296/160" */
  aspect?: string;
};

// One browser client for every uploader on the page (avoids "Multiple GoTrueClient instances").
let storageClient: ReturnType<typeof createClient>["storage"] | null = null;
function getStorage(url: string, key: string) {
  storageClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }).storage;
  return storageClient;
}

/** Drop or pick an image → uploads to Supabase Storage via a signed URL → reports the public URL. */
export function ImageUpload({ name, label, slug, value, onChange, supabaseUrl, supabaseKey, aspect = "296/160" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) return setError("Зөвхөн JPG, PNG, WebP, AVIF зураг.");
    if (file.size > IMAGE_MAX_BYTES) return setError("Зураг 5MB-аас ихгүй байх ёстой.");

    setBusy(true);
    try {
      const ticket = await createImageUpload(slug, file.name, file.type, file.size);
      if (!ticket.ok) return setError(ticket.message);
      const { error: uploadError } = await getStorage(supabaseUrl, supabaseKey).from(MODEL_IMAGES_BUCKET).uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
      if (uploadError) return setError(`Upload амжилтгүй: ${uploadError.message}`);
      onChange(ticket.publicUrl);
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  const showPreview = value && isAllowedImageSrc(value, supabaseUrl);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        disabled={busy}
        style={{ aspectRatio: aspect }}
        className={cn(
          "group relative w-full overflow-hidden rounded-xl border border-dashed bg-white/[0.03] text-left transition-colors",
          dragging ? "border-accent bg-accent/10" : "border-line-strong hover:border-accent/50",
        )}
      >
        {showPreview && <Image src={value} alt="" fill sizes="(max-width: 600px) 100vw, 260px" className="object-cover" />}
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/70 text-sm text-ink transition-opacity",
            showPreview && !busy && !dragging ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" : "opacity-100",
          )}
        >
          {busy ? <Loader2 className="size-6 animate-spin text-accent" aria-hidden /> : <ImageUp className="size-6 text-accent" aria-hidden />}
          {busy ? "Upload хийж байна…" : showPreview ? "Солих: зураг чирж оруулах эсвэл дарах" : "Зураг чирж оруулах эсвэл дарах"}
          <span className="text-xs text-muted-2">JPG, PNG, WebP, AVIF · 5MB хүртэл</span>
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />

      {error && <span className="text-xs text-red-300">{error}</span>}
      <details className="text-xs text-muted-2">
        <summary className="cursor-pointer select-none hover:text-muted">Зургийн зам</summary>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          className="mt-2 w-full rounded-lg border border-line bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-muted outline-none focus:border-accent/50"
          aria-label={`${label} — зам`}
        />
      </details>
    </div>
  );
}
