import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Steps of each kind of order — the same words are used on the order page and the confirmation page. */
export const orderSteps = {
  deposit: ["Мэдээлэл", "Төлбөр", "Баталгаажуулалт"],
  request: ["Мэдээлэл", "Илгээх", "Холбогдоно"],
} as const;

type OrderProgressProps = {
  kind: keyof typeof orderSteps;
  /** Index of the step the buyer is on now */
  current: number;
  /** Every step done (order confirmed) */
  complete?: boolean;
  className?: string;
};

/**
 * Norman — conceptual model + feedback: the whole purchase is visible up front (3 steps),
 * with the current one highlighted and finished ones ticked.
 */
export function OrderProgress({ kind, current, complete = false, className }: OrderProgressProps) {
  const steps = orderSteps[kind];
  return (
    <ol aria-label="Захиалгын алхам" className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {steps.map((label, i) => {
        const done = complete || i < current;
        const active = !complete && i === current;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                done && "border-accent bg-accent text-accent-ink",
                active && "border-accent text-accent shadow-[0_0_0_4px_rgb(93_240_168/0.12)]",
                !done && !active && "border-line-strong text-muted-2",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            <span className={cn("text-sm whitespace-nowrap", active || done ? "text-ink" : "text-muted-2", !active && "max-sm:sr-only")}>{label}</span>
            {i < steps.length - 1 && <span aria-hidden className={cn("h-px min-w-4 flex-1", done ? "bg-accent/60" : "bg-line-strong")} />}
          </li>
        );
      })}
    </ol>
  );
}
