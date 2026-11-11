"use client";

import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  return (
    <form className="flex w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
      <div className="flex gap-3">
        <label className="sr-only" htmlFor="email">
          Имэйл
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          className="min-w-0 flex-1 rounded-full border border-line-strong bg-white/[0.04] px-[18px] py-[11px] text-[15px] text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-accent/50 focus:bg-white/[0.07]"
        />
        <Button type="submit">Subscribe</Button>
      </div>
      <p className="text-xs text-muted-2">Та имэйл бүртгүүлж мэдээлэл аваарай.</p>
    </form>
  );
}
