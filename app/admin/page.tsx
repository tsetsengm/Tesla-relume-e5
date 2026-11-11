import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModelEditForm } from "@/components/admin/ModelEditForm";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase-server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Админ — Загварууд",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[960px]">
        <p className="tagline mb-3">Админ</p>
        <h1 className="heading-2 mb-3">Загварын картууд</h1>
        <p className="lead mb-10 max-w-[640px]">
          Энд хадгалсан өөрчлөлт нүүр хуудсан дээр шууд гарна. Мэдээлэл Supabase-ийн <code className="font-mono text-[0.85em] text-ink">models</code>{" "}
          хүснэгтэд хадгалагдана.
        </p>

        {/* Reads the session cookie → must stream behind a Suspense boundary */}
        <Suspense fallback={<p className="text-muted">Ачаалж байна…</p>}>
          <AdminDashboard />
        </Suspense>
      </div>
    </section>
  );
}

async function AdminDashboard() {
  const admin = await requireAdmin();
  const supabase = await createServerSupabase();
  // As an admin, RLS returns unpublished rows too
  const { data: models, error } = await supabase.from("models").select("*").order("sort_order");

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-glass px-5 py-4 text-sm">
        <span className="text-muted">
          Нэвтэрсэн: <span className="text-ink">{admin.email}</span>
        </span>
        <div className="flex items-center gap-5">
          <Link href="/" target="_blank" className="text-muted transition-colors hover:text-ink">
            Сайтыг харах ↗
          </Link>
          <form action={signOut}>
            <button type="submit" className="rounded-full border border-line-strong px-4 py-1.5 text-ink transition-colors hover:bg-white/10">
              Гарах
            </button>
          </form>
        </div>
      </div>

      {error ? (
        <p className="text-red-300">Загваруудыг уншиж чадсангүй: {error.message}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {models.map((model) => (
            <ModelEditForm key={model.slug} model={model} />
          ))}
        </div>
      )}
    </>
  );
}
