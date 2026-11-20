import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AccountBar } from "@/components/admin/AccountBar";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { createServerSupabase } from "@/lib/supabase-server";
import { formatSlot } from "@/lib/test-drive-slots";

export const metadata: Metadata = {
  title: "Админ — Туршилтын жолоодлого",
  robots: { index: false, follow: false },
};

const filters = [
  { key: "upcoming", label: "Ирэх" },
  { key: "conflict", label: "Давхацсан" },
  { key: "all", label: "Бүгд" },
] as const;

const statusBadge: Record<string, { label: string; cls: string }> = {
  paid: { label: "Төлсөн", cls: "bg-accent/15 text-accent" },
  pending: { label: "Төлбөр хүлээж буй", cls: "bg-amber-300/10 text-amber-200" },
  expired: { label: "Хугацаа дууссан", cls: "bg-white/5 text-muted-2" },
  conflict: { label: "Давхацсан — холбогдох", cls: "bg-red-400/15 text-red-200" },
};

export default function AdminTestDrivesPage({ searchParams }: PageProps<"/admin/test-drives">) {
  return (
    <section className="px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="tagline mb-3">Админ</p>
        <h1 className="heading-2 mb-3">Туршилтын жолоодлого</h1>
        <p className="lead mb-10 max-w-[640px]">
          /test-drive хуудаснаас ирсэн цагууд. Урьдчилгаа төлөгдмөгц Byl-ийн webhook-оор баталгаажна. &quot;Давхацсан&quot; нь хугацаа дууссаны дараа
          төлсөн, хооронд нь цаг нь өөр хүнд очсон захиалга: захиалагчтай холбогдож өөр цаг тохирно уу.
        </p>

        <Suspense fallback={<p className="text-muted">Ачаалж байна…</p>}>
          <BookingsTable searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function BookingsTable({ searchParams }: { searchParams: PageProps<"/admin/test-drives">["searchParams"] }) {
  const admin = await requireAdmin();
  const { view } = await searchParams;
  const active = filters.find((f) => f.key === view)?.key ?? "upcoming";
  const now = new Date();

  const supabase = await createServerSupabase();
  let query = supabase.from("test_drives").select("*").limit(300);
  if (active === "upcoming") {
    // Live bookings still ahead, soonest first
    query = query.gte("slot_start", new Date(now.getTime() - 60 * 60 * 1000).toISOString()).in("status", ["paid", "conflict", "pending"]).order("slot_start");
  } else if (active === "conflict") {
    query = query.eq("status", "conflict").order("slot_start");
  } else {
    query = query.order("created_at", { ascending: false });
  }
  const { data: bookings, error } = await query;

  return (
    <>
      <AccountBar admin={admin} />

      <nav className="mb-5 flex gap-2" aria-label="Шүүлтүүр">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "upcoming" ? "/admin/test-drives" : `/admin/test-drives?view=${f.key}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === f.key ? "border-accent/50 bg-accent/10 text-ink" : "border-line-strong text-muted hover:text-ink",
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {error ? (
        <p className="text-red-300">Захиалгуудыг уншиж чадсангүй: {error.message}</p>
      ) : !bookings.length ? (
        <p className="rounded-card border border-line bg-glass px-5 py-10 text-center text-muted">Захиалга алга.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-glass">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted-2">
              <tr>
                {["Цаг", "Машин", "Төлөв", "Нэр", "Утас", "Имэйл", "Дүн"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                // An unpaid hold that ran out reads as expired even before the next booking marks it so
                const status = b.status === "pending" && new Date(b.hold_expires_at) < now ? "expired" : b.status;
                const badge = statusBadge[status] ?? statusBadge.pending;
                return (
                  <tr key={b.id} className={cn("border-b border-line last:border-0", status === "expired" && "opacity-60")}>
                    <td className="px-4 py-3 whitespace-nowrap text-ink">{formatSlot(b.slot_start)}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink">{b.model_name}</span>
                      {b.note && (
                        <span className="mt-1 block max-w-[240px] text-xs leading-snug text-muted-2" title={b.note}>
                          {b.note.length > 80 ? `${b.note.slice(0, 80)}…` : b.note}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap", badge.cls)}>{badge.label}</span>
                    </td>
                    <td className="px-4 py-3 text-ink">{b.customer_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink">
                      <a href={`tel:${b.customer_phone}`} className="hover:text-accent">
                        {b.customer_phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <a href={`mailto:${b.customer_email}`} className="hover:text-accent">
                        {b.customer_email}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink">{b.amount.toLocaleString("en-US")}₮</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
