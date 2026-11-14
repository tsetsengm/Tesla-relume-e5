import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import type { Admin } from "@/lib/auth";

export function AccountBar({ admin }: { admin: Admin }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-glass px-5 py-3.5 text-sm">
      <span className="text-muted">
        Нэвтэрсэн: <span className="text-ink">{admin.email}</span>
      </span>
      <div className="flex items-center gap-5">
        <Link href="/admin/orders" className="text-muted transition-colors hover:text-ink">
          Захиалгууд
        </Link>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink">
          Сайтыг харах <ExternalLink className="size-3.5" aria-hidden />
        </Link>
        <form action={signOut}>
          <button type="submit" className="rounded-full border border-line-strong px-4 py-1.5 text-ink transition-colors hover:bg-white/10">
            Гарах
          </button>
        </form>
      </div>
    </div>
  );
}
