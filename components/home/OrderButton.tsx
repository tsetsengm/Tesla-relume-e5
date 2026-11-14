"use client";

import { useActionState } from "react";
import { type OrderState, startCheckout } from "@/app/order/actions";
import { Button } from "@/components/ui/Button";

type OrderButtonProps = {
  slug: string;
  label?: string;
  size?: "md" | "sm";
};

/** "Одоо захиалах" for models with a deposit: opens the Byl checkout for that model. Looks like the green Button. */
export function OrderButton({ slug, label = "Одоо захиалах", size = "md" }: OrderButtonProps) {
  const [state, action, pending] = useActionState<OrderState, FormData>(startCheckout, {});

  return (
    <form action={action} className="flex flex-col items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" size={size} className={pending ? "pointer-events-none opacity-70" : undefined}>
        {pending ? "Шилжиж байна…" : label}
      </Button>
      {state.message && (
        <p role="alert" className="max-w-[200px] text-center text-xs leading-snug text-red-300">
          {state.message}
        </p>
      )}
    </form>
  );
}
