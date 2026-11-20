"use server";

import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/byl";
import { requestOrigin } from "@/lib/request-origin";
import { createSupabaseClient } from "@/lib/supabase";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { expireStaleHolds } from "@/lib/test-drive";
import { allSlots, formatSlot, HOLD_MINUTES, sameSlot, TEST_DRIVE_DEPOSIT } from "@/lib/test-drive-slots";

export type TestDriveValues = { model: string; slot: string; name: string; phone: string; email: string; note: string };
export type TestDriveState = {
  message?: string;
  /** Which fields failed, so the form can mark them */
  invalid?: (keyof TestDriveValues)[];
  /** The hour was taken by someone else just now — the form drops it from the list */
  takenSlot?: string;
  /** Echoed back: React resets the form after a Server Action */
  values?: TestDriveValues;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Test-drive form on /test-drive: car → hour → details → 20,000₮ Byl deposit.
 * The hour is held for HOLD_MINUTES while the customer pays; the database allows one live booking per hour.
 * The amount always comes from the server — never from the form.
 */
export async function bookTestDrive(_prev: TestDriveState, formData: FormData): Promise<TestDriveState> {
  const values: TestDriveValues = {
    model: String(formData.get("model") ?? ""),
    slot: String(formData.get("slot") ?? ""),
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    phone: String(formData.get("phone") ?? "").replace(/[\s-]/g, "").replace(/^\+?976/, ""),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    note: String(formData.get("note") ?? "").trim().slice(0, 500),
  };

  const { data: model } = await createSupabaseClient()
    .from("models")
    .select("slug, name")
    .eq("slug", values.model)
    .eq("is_published", true)
    .maybeSingle();

  // The hour must be one the schedule offers right now (open hours, working day, not too soon, not too far)
  const slot = allSlots(new Date()).find((s) => values.slot && sameSlot(s, values.slot));

  const invalid: (keyof TestDriveValues)[] = [];
  if (!model) invalid.push("model");
  if (!slot) invalid.push("slot");
  if (values.name.length < 2) invalid.push("name");
  if (!/^\d{8}$/.test(values.phone)) invalid.push("phone");
  if (!EMAIL.test(values.email)) invalid.push("email");
  if (invalid.length || !model || !slot) {
    const message = invalid.includes("slot") && values.slot ? "Сонгосон цаг захиалах боломжгүй болсон. Өөр цаг сонгоно уу." : "Тэмдэглэсэн талбаруудыг зөв бөглөнө үү.";
    return { message, invalid, values };
  }

  const db = createSupabaseAdmin();
  let next: string;
  try {
    await expireStaleHolds(slot);
    const { data: booking, error } = await db
      .from("test_drives")
      .insert({
        model_slug: model.slug,
        model_name: model.name,
        slot_start: slot,
        amount: TEST_DRIVE_DEPOSIT,
        status: "pending",
        customer_name: values.name,
        customer_phone: values.phone,
        customer_email: values.email,
        note: values.note || null,
        hold_expires_at: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
      })
      .select("id")
      .single();

    // One person per hour: someone else holds or paid for this hour
    if (error?.code === "23505") {
      return { message: "Энэ цагийг өөр хүн дөнгөж захиаллаа. Өөр цаг сонгоно уу.", invalid: ["slot"], takenSlot: slot, values: { ...values, slot: "" } };
    }
    if (error) throw error;

    const origin = await requestOrigin();
    try {
      const checkout = await createCheckout({
        amount: TEST_DRIVE_DEPOSIT,
        productName: `${model.name} — туршилтын жолоодлого, ${formatSlot(slot)}`,
        productRef: `test-drive:${model.slug}`,
        orderRef: booking.id,
        customerEmail: values.email,
        successUrl: `${origin}/test-drive/success?ref=${booking.id}`,
        cancelUrl: `${origin}/test-drive?model=${model.slug}&canceled=1`,
      });
      await db.from("test_drives").update({ byl_checkout_id: checkout.id }).eq("id", booking.id);
      next = checkout.url;
    } catch (err) {
      // No payment page: free the hour again right away
      await db.from("test_drives").update({ status: "expired" }).eq("id", booking.id);
      throw err;
    }
  } catch (err) {
    console.error("bookTestDrive:", err);
    return { message: "Төлбөрийн хуудас нээж чадсангүй. Түр хүлээгээд дахин оролдоно уу.", values };
  }

  // Outside try/catch: redirect() works by throwing
  redirect(next);
}
