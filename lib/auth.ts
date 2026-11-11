import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export type Admin = { id: string; email: string };

/**
 * The signed-in user if they are listed in public.admins, otherwise null.
 * `getUser()` validates the session with Supabase Auth (unlike `getSession()`, which trusts the cookie).
 */
export async function getAdmin(): Promise<Admin | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS only lets a user read their own admin row.
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { id: user.id, email: user.email ?? "" } : null;
}

/** For admin pages and Server Actions: the current admin, or a redirect to the login page. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
