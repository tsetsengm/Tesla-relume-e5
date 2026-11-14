"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, MODEL_IMAGES_BUCKET, isAllowedImageSrc } from "@/lib/images";
import { supabaseEnv } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

/** `email` is echoed back so the login form can refill it after React resets the form. */
export type FormState = { ok?: boolean; message?: string; email?: string };

const NOT_ALLOWED = "Нэвтрэх эрх дууссан байна. Дахин нэвтэрнэ үү.";

/* ---------------- Auth ---------------- */

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { message: "Имэйл болон нууц үгээ оруулна уу.", email };

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { message: "Имэйл эсвэл нууц үг буруу байна.", email };

  if (!(await getAdmin())) {
    await supabase.auth.signOut();
    return { message: "Энэ хэрэглэгчид админ эрх байхгүй байна.", email };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- Models ---------------- */

type ModelUpdate = Database["public"]["Tables"]["models"]["Update"];

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function updateModel(_prev: FormState, formData: FormData): Promise<FormState> {
  // Server Actions are reachable by direct POST — always re-check authorization.
  if (!(await getAdmin())) return { message: NOT_ALLOWED };

  const { url } = supabaseEnv();
  const slug = text(formData, "slug");
  const sortOrder = Number(text(formData, "sort_order"));
  const detailHref = text(formData, "detail_href");
  const mediaType = text(formData, "showcase_media_type") === "video" ? "video" : "image";

  const update: ModelUpdate = {
    name: text(formData, "name"),
    sort_order: sortOrder,
    is_published: formData.get("is_published") === "on",
    detail_href: detailHref || null,
    card_image: text(formData, "card_image"),
    card_alt: text(formData, "card_alt"),
    card_description: text(formData, "card_description"),
    showcase_media_type: mediaType,
    showcase_image: mediaType === "image" ? text(formData, "showcase_image") : null,
    showcase_image_alt: mediaType === "image" ? text(formData, "showcase_image_alt") : null,
    showcase_video_poster: mediaType === "video" ? text(formData, "showcase_video_poster") : null,
    showcase_video_label: mediaType === "video" ? text(formData, "showcase_video_label") : null,
    showcase_primary_action: text(formData, "showcase_primary_action"),
    loan_rate: text(formData, "loan_rate") || null,
    lease_from: text(formData, "lease_from") || null,
    deposit_amount: text(formData, "deposit_amount") ? Number(text(formData, "deposit_amount")) : null,
    // Paragraphs are separated by a blank line in the textarea
    showcase_paragraphs: text(formData, "showcase_paragraphs")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };

  const showcaseImage = mediaType === "image" ? update.showcase_image : update.showcase_video_poster;
  const missing = [
    !update.name && "Нэр",
    !update.card_image && "Картын зураг",
    !update.card_alt && "Картын зургийн тайлбар",
    !update.card_description && "Картын тайлбар",
    !showcaseImage && (mediaType === "image" ? "Showcase зураг" : "Видеоны poster"),
    mediaType === "image" ? !update.showcase_image_alt && "Showcase зургийн тайлбар" : !update.showcase_video_label && "Видеоны тайлбар",
    !update.showcase_primary_action && "Товчны текст",
    !update.showcase_paragraphs?.length && "Showcase бичвэр",
  ].filter(Boolean);
  if (missing.length) return { message: `Хоосон байж болохгүй: ${missing.join(", ")}.` };
  if (!Number.isInteger(sortOrder)) return { message: "Дараалал бүхэл тоо байх ёстой." };
  if (update.deposit_amount != null && !(Number.isInteger(update.deposit_amount) && update.deposit_amount >= 10)) {
    return { message: "Урьдчилгаа 10₮-өөс багагүй бүхэл тоо байх ёстой." };
  }
  for (const src of [update.card_image!, showcaseImage!]) {
    if (!isAllowedImageSrc(src, url)) return { message: "Зураг upload хийсэн эсвэл /assets/ гэж эхэлсэн зам байх ёстой." };
  }
  if (detailHref && !detailHref.startsWith("/")) return { message: "Дэлгэрэнгүй холбоос / гэж эхлэх ёстой." };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("models").update(update).eq("slug", slug).select("slug");
  if (error) return { message: `Хадгалж чадсангүй: ${error.message}` };
  if (!data?.length) return { message: "Загвар олдсонгүй эсвэл засах эрх алга." };

  // Home page reads models through getModels() (cacheTag "models") — refresh it now
  updateTag("models");
  return { ok: true, message: "Хадгаллаа. Нүүр хуудас шинэчлэгдсэн." };
}

/** Quick show/hide from the model list. */
export async function setPublished(slug: string, isPublished: boolean): Promise<FormState> {
  if (!(await getAdmin())) return { message: NOT_ALLOWED };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("models").update({ is_published: isPublished }).eq("slug", slug).select("slug");
  if (error || !data?.length) return { message: error?.message ?? "Загвар олдсонгүй." };

  updateTag("models");
  return { ok: true };
}

/* ---------------- Image upload ---------------- */

export type UploadTicket = { ok: true; path: string; token: string; publicUrl: string } | { ok: false; message: string };

/**
 * Issues a one-time signed upload URL. The browser then sends the file straight to Supabase Storage,
 * so large images never pass through (or hit the body limit of) a Server Action.
 */
export async function createImageUpload(slug: string, fileName: string, contentType: string, size: number): Promise<UploadTicket> {
  if (!(await getAdmin())) return { ok: false, message: NOT_ALLOWED };
  if (!(IMAGE_TYPES as readonly string[]).includes(contentType)) return { ok: false, message: "Зөвхөн JPG, PNG, WebP, AVIF зураг оруулна." };
  if (size > IMAGE_MAX_BYTES) return { ok: false, message: "Зураг 5MB-аас ихгүй байх ёстой." };
  if (!/^[a-z0-9-]+$/.test(slug)) return { ok: false, message: "Буруу загвар." };

  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${slug}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const supabase = await createServerSupabase();
  const bucket = supabase.storage.from(MODEL_IMAGES_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) return { ok: false, message: `Upload бэлдэж чадсангүй: ${error?.message ?? "алдаа"}` };

  return { ok: true, path: data.path, token: data.token, publicUrl: bucket.getPublicUrl(data.path).data.publicUrl };
}
