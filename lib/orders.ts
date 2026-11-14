import "server-only";
import { type BylCheckoutCompleted, getCheckout } from "@/lib/byl";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Marks a pending order as paid from a completed Byl checkout. Idempotent: an already-paid order is left as is,
 * so webhook retries and the success-page fallback can both call it safely.
 */
export async function markOrderPaid(orderId: string, checkout: BylCheckoutCompleted) {
  const name = checkout.custom_fields?.find((f) => f.key === "name")?.value ?? null;
  const { error } = await createSupabaseAdmin()
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      byl_checkout_id: checkout.id,
      customer_name: name,
      customer_phone: checkout.phone_number ?? null,
      customer_email: checkout.customer_email,
    })
    .eq("id", orderId)
    .eq("status", "pending");
  if (error) throw error;
}

/** Public order status for the success page — no customer details. */
export async function getOrderStatus(orderId: string) {
  if (!UUID.test(orderId)) return null;
  const { data: order } = await createSupabaseAdmin()
    .from("orders")
    .select("id, model_name, amount, status, byl_checkout_id")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return null;

  // Webhook not here yet (or can't reach localhost): ask Byl directly
  if (order.status === "pending" && order.byl_checkout_id) {
    const checkout = await getCheckout(order.byl_checkout_id).catch(() => null);
    if (checkout?.status === "complete" && checkout.client_reference_id === order.id) {
      await markOrderPaid(order.id, checkout);
      return { ...order, status: "paid" };
    }
  }
  return order;
}
