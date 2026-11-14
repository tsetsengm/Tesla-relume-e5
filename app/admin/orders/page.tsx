import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AccountBar } from "@/components/admin/AccountBar";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Админ — Захиалгууд",
  robots: { index: false, follow: false },
};

const filters = [
  { key: "all", label: "Бүгд" },
  { key: "paid", label: "Төлсөн" },
  { key: "pending", label: "Төлбөр хүлээж буй" },
  { key: "request", label: "Хүсэлт" },
] as const;

const statusBadge: Record<string, { label: string; cls: string }> = {
  paid: { label: "Төлсөн", cls: "bg-accent/15 text-accent" },
  pending: { label: "Төлбөр хүлээж буй", cls: "bg-amber-300/10 text-amber-200" },
  request: { label: "Хүсэлт", cls: "bg-sky-300/10 text-sky-200" },
};

const dateFmt = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <section className="px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="tagline mb-3">Админ</p>
        <h1 className="heading-2 mb-3">Захиалгууд</h1>
        <p className="lead mb-10 max-w-[640px]">Захиалгын хуудаснаас ирсэн захиалгууд. Урьдчилгааны төлөв Byl-ийн webhook-оор автоматаар шинэчлэгдэнэ.</p>

        <Suspense fallback={<p className="text-muted">Ачаалж байна…</p>}>
          <OrdersTable searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function OrdersTable({ searchParams }: { searchParams: PageProps<"/admin/orders">["searchParams"] }) {
  const admin = await requireAdmin();
  const { status } = await searchParams;
  const active = status === "paid" || status === "pending" || status === "request" ? status : "all";

  const supabase = await createServerSupabase();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (active !== "all") query = query.eq("status", active);
  const { data: orders, error } = await query;

  return (
    <>
      <AccountBar admin={admin} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <nav className="flex gap-2" aria-label="Шүүлтүүр">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/orders" : `/admin/orders?status=${f.key}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active === f.key ? "border-accent/50 bg-accent/10 text-ink" : "border-line-strong text-muted hover:text-ink",
              )}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        <Link href="/admin" className="text-sm text-muted transition-colors hover:text-ink">
          ← Загварууд
        </Link>
      </div>

      {error ? (
        <p className="text-red-300">Захиалгуудыг уншиж чадсангүй: {error.message}</p>
      ) : !orders.length ? (
        <p className="rounded-card border border-line bg-glass px-5 py-10 text-center text-muted">Захиалга алга.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-glass">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-2">
              <tr>
                {["Огноо", "Загвар", "Дүн", "Төлөв", "Нэр", "Утас", "Имэйл"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{dateFmt.format(new Date(o.paid_at ?? o.created_at))}</td>
                  <td className="px-4 py-3">
                    <span className="text-ink">{o.trim ?? o.model_name}</span>
                    {o.note && (
                      <span className="mt-1 block max-w-[240px] text-xs leading-snug text-muted-2" title={o.note}>
                        {o.note.length > 80 ? `${o.note.slice(0, 80)}…` : o.note}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink">{o.amount != null ? `${o.amount.toLocaleString("en-US")}₮` : "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap",
                        (statusBadge[o.status] ?? statusBadge.pending).cls,
                      )}
                    >
                      {(statusBadge[o.status] ?? statusBadge.pending).label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{o.customer_name ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink">
                    {o.customer_phone ? <a href={`tel:${o.customer_phone}`} className="hover:text-accent">{o.customer_phone}</a> : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {o.customer_email ? <a href={`mailto:${o.customer_email}`} className="hover:text-accent">{o.customer_email}</a> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
