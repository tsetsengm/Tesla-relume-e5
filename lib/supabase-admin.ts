import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Privileged client (Supabase secret key — bypasses Row Level Security).
 * Used only on the server to write `orders` from the checkout action and the Byl webhook.
 * Never import this from a Client Component.
 */
export function createSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Add them to .env.local (and to the Vercel project).");
  }
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
