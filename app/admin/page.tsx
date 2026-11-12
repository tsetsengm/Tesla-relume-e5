import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountBar } from "@/components/admin/AccountBar";
import { ModelList } from "@/components/admin/ModelList";
import { requireAdmin } from "@/lib/auth";
import { supabaseEnv } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Админ — Загварууд",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[960px]">
        <p className="tagline mb-3">Админ</p>
        <h1 className="heading-2 mb-3">Загварууд</h1>
        <p className="lead mb-10 max-w-[640px]">Засах загвараа сонгоно уу. Нүд дээр дарж нүүр хуудаснаас шууд нууж, харуулна.</p>

        {/* Reads the session cookie → must stream behind a Suspense boundary */}
        <Suspense fallback={<p className="text-muted">Ачаалж байна…</p>}>
          <AdminHome />
        </Suspense>
      </div>
    </section>
  );
}

async function AdminHome() {
  const admin = await requireAdmin();
  const supabase = await createServerSupabase();
  // As an admin, RLS returns unpublished rows too
  const { data: models, error } = await supabase
    .from("models")
    .select("slug, name, sort_order, is_published, card_image, updated_at")
    .order("sort_order");

  return (
    <>
      <AccountBar admin={admin} />
      {error ? <p className="text-red-300">Загваруудыг уншиж чадсангүй: {error.message}</p> : <ModelList models={models} supabaseUrl={supabaseEnv().url} />}
    </>
  );
}
