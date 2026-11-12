import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ModelEditor } from "@/components/admin/ModelEditor";
import { requireAdmin } from "@/lib/auth";
import { supabaseEnv } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Админ — Загвар засах",
  robots: { index: false, follow: false },
};

export default function EditModelPage({ params }: PageProps<"/admin/models/[slug]">) {
  return (
    <section className="px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Params and the session are request-time data → stream behind Suspense */}
        <Suspense fallback={<p className="text-muted">Ачаалж байна…</p>}>
          <Editor params={params} />
        </Suspense>
      </div>
    </section>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/models/[slug]">["params"] }) {
  const [{ slug }] = await Promise.all([params, requireAdmin()]);
  const supabase = await createServerSupabase();

  const [{ data: model }, { data: all }] = await Promise.all([
    supabase.from("models").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("models").select("slug, name").order("sort_order"),
  ]);
  if (!model) notFound();

  const index = all?.findIndex((m) => m.slug === slug) ?? -1;
  const prev = index > 0 ? all![index - 1] : null;
  const next = index >= 0 && index < (all?.length ?? 0) - 1 ? all![index + 1] : null;
  const { url, key } = supabaseEnv();

  // key: reset the form state when moving to another model
  return <ModelEditor key={model.slug} model={model} prev={prev} next={next} supabaseUrl={url} supabaseKey={key} />;
}
