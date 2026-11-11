import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

/**
 * Cookie-aware Supabase client that acts as the signed-in user (admin area).
 * Reads the request cookies, so callers must sit behind <Suspense> or run in a Server Action.
 */
export async function createServerSupabase() {
  const { url, key } = supabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // proxy.ts refreshes the session on every /admin request, so this is safe to ignore.
        }
      },
    },
  });
}
