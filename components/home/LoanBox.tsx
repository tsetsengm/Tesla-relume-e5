import { Button } from "@/components/ui/Button";
import { partnerBanks } from "@/data/banks";
import type { Model } from "@/data/models";

/**
 * Common Region: every loan fact for a model (rate, lease, partner banks, the loan CTA)
 * in one bordered box, instead of spread across the paragraph, logos and button row.
 */
export function LoanBox({ loan = {}, deposit }: { loan?: Model["loan"]; deposit?: number }) {
  const facts = [
    deposit && { label: "Урьдчилгаа", value: `${deposit.toLocaleString("en-US")}₮` },
    loan.rate && { label: "Ногоон зээл", value: `жилийн ${loan.rate}` },
    loan.leaseFrom && { label: "Түрээс", value: `сард ${loan.leaseFrom}-өөс` },
    { label: "Банк", value: partnerBanks.map((b) => b.name).join(" · "), small: true },
  ].filter(Boolean) as { label: string; value: string; small?: boolean }[];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
      <dl className="flex flex-wrap gap-x-7 gap-y-3">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-2">{f.label}</dt>
            <dd className={f.small ? "mt-1 text-sm text-muted" : "mt-0.5 text-[17px] font-semibold text-ink"}>{f.value}</dd>
          </div>
        ))}
      </dl>
      <Button href="#contact" variant="secondary" size="sm" className="self-start sm:self-center">
        Зээл судлах
      </Button>
    </div>
  );
}
