import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Админ нэвтрэх",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <GlassCard tone="strong" className="w-full max-w-[420px] p-8 sm:p-10">
        <div className="relative">
          <p className="tagline mb-3">Админ</p>
          <h1 className="heading-5 mb-2">Нэвтрэх</h1>
          <p className="mb-8 text-sm text-muted">Supabase-д бүртгэлтэй админ хэрэглэгчээр нэвтэрнэ.</p>
          <LoginForm />
        </div>
      </GlassCard>
    </section>
  );
}
