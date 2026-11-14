"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getModelDetail } from "@/data/model-details";
import { createCheckout } from "@/lib/byl";
import { createSupabaseClient } from "@/lib/supabase";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export type OrderValues = { name: string; phone: string; email: string; trim: string; note: string };
export type OrderState = {
  message?: string;
  /** Which fields failed, so the form can mark them */
  invalid?: (keyof OrderValues)[];
  /** Echoed back: React resets the form after a Server Action */
  values?: OrderValues;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Site origin of the current request, so Byl returns the buyer to the same deployment. */
async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Order form on /order/[slug].
 * - Model with a deposit: save a pending order, open a Byl checkout for the deposit, redirect to byl.mn.
 * - Model without one: save a free order request and show the confirmation.
 * The amount always comes from the database — never from the form.
 */
export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const slug = String(formData.get("slug") ?? "");
  const values: OrderValues = {
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    phone: String(formData.get("phone") ?? "").replace(/[\s-]/g, "").replace(/^\+?976/, ""),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    trim: String(formData.get("trim") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim().slice(0, 500),
  };

  const { data: model } = await createSupabaseClient()
    .from("models")
    .select("slug, name, deposit_amount")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!model) return { message: "Загвар олдсонгүй.", values };

  const trims = getModelDetail(model.slug)?.trims.items.map((t) => t.name) ?? [];
  const deposit = model.deposit_amount;

  const invalid: (keyof OrderValues)[] = [];
  if (values.name.length < 2) invalid.push("name");
  if (!/^\d{8}$/.test(values.phone)) invalid.push("phone");
  // Byl emails the payment receipt, so a deposit order needs an email
  if (deposit ? !EMAIL.test(values.email) : values.email && !EMAIL.test(values.email)) invalid.push("email");
  if (trims.length && !trims.includes(values.trim)) invalid.push("trim");
  if (invalid.length) return { message: "Тэмдэглэсэн талбаруудыг зөв бөглөнө үү.", invalid, values };

  let next: string;
  try {
    const db = createSupabaseAdmin();
    const { data: order, error } = await db
      .from("orders")
      .insert({
        model_slug: model.slug,
        model_name: model.name,
        amount: deposit,
        status: deposit ? "pending" : "request",
        customer_name: values.name,
        customer_phone: values.phone,
        customer_email: values.email || null,
        trim: values.trim || null,
        note: values.note || null,
      })
      .select("id")
      .single();
    if (error) throw error;

    const origin = await requestOrigin();
    if (deposit) {
      const checkout = await createCheckout({
        amount: deposit,
        productName: `${values.trim || model.name} — захиалгын урьдчилгаа`,
        productRef: model.slug,
        orderRef: order.id,
        customerEmail: values.email,
        successUrl: `${origin}/order/success?ref=${order.id}`,
        cancelUrl: `${origin}/order/${model.slug}`,
      });
      await db.from("orders").update({ byl_checkout_id: checkout.id }).eq("id", order.id);
      next = checkout.url;
    } else {
      next = `/order/success?ref=${order.id}`;
    }
  } catch (err) {
    console.error("placeOrder:", err);
    return {
      message: deposit ? "Төлбөрийн хуудас нээж чадсангүй. Түр хүлээгээд дахин оролдоно уу." : "Захиалга илгээж чадсангүй. Дахин оролдоно уу.",
      values,
    };
  }

  // Outside try/catch: redirect() works by throwing
  redirect(next);
}
