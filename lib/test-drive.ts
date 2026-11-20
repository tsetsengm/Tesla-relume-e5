import "server-only";
import { type BylCheckoutCompleted, getCheckout } from "@/lib/byl";
import { UUID } from "@/lib/orders";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Hours that can't be booked: paid ones, and unpaid ones still inside their payment hold.
 * Returned as ISO strings (UTC, "Z") so they compare directly with `allSlots()`.
 */
export async function takenSlots(): Promise<string[]> {
  const now = new Date().toISOString();
  const { data, error } = await createSupabaseAdmin()
    .from("test_drives")
    .select("slot_start")
    .gte("slot_start", now)
    .or(`status.eq.paid,and(status.eq.pending,hold_expires_at.gt.${now})`);
  if (error) throw error;
  return data.map((r) => new Date(r.slot_start).toISOString());
}

/**
 * Releases unpaid bookings whose hold has run out, so the one-per-hour index lets the hour be booked again.
 * Called right before a new booking (for its hour) — no cron needed.
 */
export async function expireStaleHolds(slotIso?: string) {
  let query = createSupabaseAdmin()
    .from("test_drives")
    .update({ status: "expired" })
    .eq("status", "pending")
    .lt("hold_expires_at", new Date().toISOString());
  if (slotIso) query = query.eq("slot_start", slotIso);
  const { error } = await query;
  if (error) throw error;
}

/**
 * Confirms a booking from a completed Byl checkout. Idempotent (webhook retries, success-page fallback).
 * A late payment (hold expired) still counts. If someone else booked the hour meanwhile, the one-per-hour
 * index refuses "paid", and the booking is kept as "conflict" so staff can call the customer — their money is never lost.
 * No-op when `id` isn't a test drive (the webhook tries orders and test drives alike).
 */
export async function markTestDrivePaid(id: string, checkout: BylCheckoutCompleted) {
  const db = createSupabaseAdmin();
  const paid = { paid_at: new Date().toISOString(), byl_checkout_id: checkout.id };

  const { error } = await db.from("test_drives").update({ status: "paid", ...paid }).eq("id", id).in("status", ["pending", "expired"]);
  if (error?.code === "23505") {
    const { error: conflictError } = await db.from("test_drives").update({ status: "conflict", ...paid }).eq("id", id).in("status", ["pending", "expired"]);
    if (conflictError) throw conflictError;
  } else if (error) {
    throw error;
  }
}

/** Public booking status for the success page — no customer details. */
export async function getTestDriveStatus(id: string) {
  if (!UUID.test(id)) return null;
  const db = createSupabaseAdmin();
  const read = () =>
    db.from("test_drives").select("id, model_slug, model_name, slot_start, amount, status, byl_checkout_id").eq("id", id).maybeSingle();

  const { data: booking } = await read();
  if (!booking) return null;

  // Webhook not here yet (or can't reach localhost): ask Byl directly
  if ((booking.status === "pending" || booking.status === "expired") && booking.byl_checkout_id) {
    const checkout = await getCheckout(booking.byl_checkout_id).catch(() => null);
    if (checkout?.status === "complete" && checkout.client_reference_id === booking.id) {
      await markTestDrivePaid(booking.id, checkout);
      return (await read()).data ?? booking;
    }
  }
  return booking;
}
