"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Norman — feedback: while a payment is still being confirmed, re-check the server every few seconds
 * and say so, instead of leaving the buyer to guess whether to reload.
 */
export function AutoRefresh({ everyMs = 3000, maxTries = 20 }: { everyMs?: number; maxTries?: number }) {
  const router = useRouter();
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (tries >= maxTries) return;
    const id = setTimeout(() => {
      router.refresh();
      setTries((t) => t + 1);
    }, everyMs);
    return () => clearTimeout(id);
  }, [tries, everyMs, maxTries, router]);

  if (tries >= maxTries) {
    return <p className="text-sm text-muted-2">Удаан байна уу? «Шинэчлэх» дарах эсвэл бидэнтэй холбогдоно уу.</p>;
  }
  return (
    <p role="status" className="inline-flex items-center gap-2 text-sm text-muted">
      <Loader2 aria-hidden className="size-4 animate-spin text-accent" />
      Төлбөрийг автоматаар шалгаж байна…
    </p>
  );
}
