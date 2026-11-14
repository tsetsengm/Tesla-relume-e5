"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/byl";
import { createSupabaseClient } from "@/lib/supabase";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export type OrderState = { message?: string };

const FAILED = "Төлбөрийн хуудас нээж чадсангүй. Түр хүлээгээд дахин оролдоно уу.";

/** Site origin of the current request, so Byl returns the buyer to the same deployment. */
async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * "Одоо захиалах": create a pending order, open a Byl checkout for the model's deposit, redirect to it.
 * The amount always comes from the database — never from the form.
 */
export async function startCheckout(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const slug = String(formData.get("slug") ?? "");

  const { data: model } = await createSupabaseClient()
    .from("models")
    .select("slug, name, deposit_amount")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!model?.deposit_amount) return { message: "Энэ загварыг одоогоор онлайнаар захиалах боломжгүй." };

  let checkoutUrl: string;
  try {
    const db = createSupabaseAdmin();
    const { data: order, error } = await db
      .from("orders")
      .insert({ model_slug: model.slug, model_name: model.name, amount: model.deposit_amount })
      .select("id")
      .single();
    if (error) throw error;

    const origin = await requestOrigin();
    const checkout = await createCheckout({
      amount: model.deposit_amount,
      productName: `${model.name} — захиалгын урьдчилгаа`,
      productRef: model.slug,
      orderRef: order.id,
      successUrl: `${origin}/order/success?ref=${order.id}`,
      cancelUrl: `${origin}/#${model.slug}`,
    });

    await db.from("orders").update({ byl_checkout_id: checkout.id }).eq("id", order.id);
    checkoutUrl = checkout.url;
  } catch (err) {
    console.error("startCheckout:", err);
    return { message: FAILED };
  }

  // Outside try/catch: redirect() works by throwing
  redirect(checkoutUrl);
}
