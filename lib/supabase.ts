import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Supabase URL + publishable key. Server-only env vars (no NEXT_PUBLIC_ prefix),
 * so they never reach the browser bundle.
 */
export function supabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY. Add them to .env.local (and to the Vercel project).");
  }
  return { url, key };
}

/**
 * Anonymous client for public, read-only content (no session, no cookies),
 * so it can run inside `use cache`. Row Level Security limits it to published rows.
 */
export function createSupabaseClient() {
  const { url, key } = supabaseEnv();
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}
