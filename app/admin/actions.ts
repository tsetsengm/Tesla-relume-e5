"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

/** `email` is echoed back so the login form can refill it after React resets the form. */
export type FormState = { ok?: boolean; message?: string; email?: string };

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

type ModelUpdate = Database["public"]["Tables"]["models"]["Update"];

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function updateModel(_prev: FormState, formData: FormData): Promise<FormState> {
  // Server Actions are reachable by direct POST — always re-check authorization.
  if (!(await getAdmin())) return { message: "Нэвтрэх эрх дууссан байна. Дахин нэвтэрнэ үү." };

  const slug = text(formData, "slug");
  const sortOrder = Number(text(formData, "sort_order"));
  const detailHref = text(formData, "detail_href");

  const update: ModelUpdate = {
    name: text(formData, "name"),
    sort_order: sortOrder,
    is_published: formData.get("is_published") === "on",
    detail_href: detailHref || null,
    card_image: text(formData, "card_image"),
    card_alt: text(formData, "card_alt"),
    card_description: text(formData, "card_description"),
    showcase_primary_action: text(formData, "showcase_primary_action"),
    // Paragraphs are separated by a blank line in the textarea
    showcase_paragraphs: text(formData, "showcase_paragraphs")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };

  const missing = [
    !update.name && "Нэр",
    !update.card_image && "Картын зураг",
    !update.card_alt && "Зургийн тайлбар (alt)",
    !update.card_description && "Картын тайлбар",
    !update.showcase_primary_action && "Товчны текст",
    !update.showcase_paragraphs?.length && "Showcase бичвэр",
  ].filter(Boolean);
  if (missing.length) return { message: `Хоосон байж болохгүй: ${missing.join(", ")}.` };
  if (!Number.isInteger(sortOrder)) return { message: "Дараалал бүхэл тоо байх ёстой." };
  // Card images are rendered with next/image, which only serves local files here
  if (!update.card_image!.startsWith("/assets/")) return { message: "Картын зураг /assets/ гэж эхэлсэн зам байх ёстой." };
  if (detailHref && !detailHref.startsWith("/")) return { message: "Дэлгэрэнгүй холбоос / гэж эхлэх ёстой." };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("models").update(update).eq("slug", slug).select("slug");
  if (error) return { message: `Хадгалж чадсангүй: ${error.message}` };
  if (!data?.length) return { message: "Загвар олдсонгүй эсвэл засах эрх алга." };

  // Home page reads models through getModels() (cacheTag "models") — refresh it now
  updateTag("models");
  return { ok: true, message: "Хадгаллаа. Нүүр хуудас шинэчлэгдсэн." };
}
