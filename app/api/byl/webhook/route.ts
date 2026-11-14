import { type BylCheckoutCompleted, verifyBylSignature } from "@/lib/byl";
import { markOrderPaid, UUID } from "@/lib/orders";

type BylEvent = { id: number; type: string; data: { object: unknown } };

/**
 * Byl webhook endpoint — register https://<domain>/api/byl/webhook in the Byl dashboard (Webhooks).
 * Byl expects a 2xx within 5 seconds and retries failures up to 8 times, so this handler is idempotent.
 */
export async function POST(request: Request) {
  // The signature covers the exact raw body — read it before parsing
  const raw = await request.text();
  if (!verifyBylSignature(raw, request.headers.get("byl-signature"))) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: BylEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  if (event.type === "checkout.completed") {
    const checkout = event.data.object as BylCheckoutCompleted;
    const orderId = checkout.client_reference_id;
    // Checkouts made elsewhere (e.g. Byl payment links) carry no order id of ours — just acknowledge them
    if (orderId && UUID.test(orderId)) {
      try {
        await markOrderPaid(orderId, checkout);
      } catch (err) {
        console.error("Byl webhook: order update failed", err);
        return Response.json({ error: "db" }, { status: 500 }); // Byl will retry
      }
    }
  }

  // Unknown or unused event types are acknowledged so Byl stops retrying
  return Response.json({ received: true });
}
