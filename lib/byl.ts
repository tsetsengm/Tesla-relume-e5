import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** Byl payments API — https://byl.mn/docs/api */
const BYL_API = "https://byl.mn/api/v1";

function bylEnv() {
  const projectId = process.env.BYL_PROJECT_ID;
  const token = process.env.BYL_TOKEN;
  if (!projectId || !token) {
    throw new Error("Missing BYL_PROJECT_ID or BYL_TOKEN. Add them to .env.local (and to the Vercel project).");
  }
  return { projectId, token };
}

export type CheckoutInput = {
  /** Amount in ₮ (Byl test mode always charges 100₮) */
  amount: number;
  productName: string;
  productRef: string;
  /** Our order id — echoed back in the checkout.completed webhook */
  orderRef: string;
  successUrl: string;
  cancelUrl: string;
};

/** POST /v1/projects/:id/checkouts → the hosted payment page URL. */
export async function createCheckout(input: CheckoutInput): Promise<{ id: number; url: string }> {
  const { projectId, token } = bylEnv();
  const res = await fetch(`${BYL_API}/projects/${projectId}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          price_data: {
            unit_amount: input.amount,
            product_data: { name: input.productName, client_reference_id: input.productRef },
          },
          quantity: 1,
        },
      ],
      client_reference_id: input.orderRef,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      phone_number_collection: true,
      email_collection: true,
      custom_fields: [{ key: "name", label: "Овог нэр", type: "text" }],
    }),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as { data?: { id: number; url: string }; message?: string } | null;
  if (!res.ok || !body?.data?.url) {
    throw new Error(`Byl checkout failed (${res.status}): ${body?.message ?? "unknown error"}`);
  }
  return body.data;
}

/** GET /v1/projects/:id/checkouts/:checkout_id — fallback check when the webhook hasn't arrived yet. */
export async function getCheckout(checkoutId: number): Promise<BylCheckoutCompleted | null> {
  const { projectId, token } = bylEnv();
  const res = await fetch(`${BYL_API}/projects/${projectId}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = (await res.json().catch(() => null)) as { data?: BylCheckoutCompleted } | null;
  return body?.data ?? null;
}

/**
 * Checks the `Byl-Signature` header: HMAC-SHA256 of the raw request body with the endpoint's signing secret,
 * compared in constant time. https://byl.mn/docs/webhook
 */
export function verifyBylSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.BYL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(signature.trim());
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** The parts of a checkout.completed payload we use. */
export type BylCheckoutCompleted = {
  id: number;
  status: string;
  client_reference_id: string | null;
  amount_total: string | number;
  customer_email: string | null;
  phone_number?: string | null;
  custom_fields?: { key: string; value: string | null }[];
};
