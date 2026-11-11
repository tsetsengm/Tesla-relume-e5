import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { bankStrip, partnerBanks } from "@/data/banks";

/** "Ногоон зээлээр авах боломж" — full-width row of bank logos. */
export function BankStrip() {
  return (
    <Reveal as="section" variant="grow" className="flex flex-col items-center gap-7 overflow-hidden py-8 lg:py-10">
      <h2 className="px-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-2 sm:px-8 lg:px-16">
        Ногоон зээлээр авах боломж
      </h2>
      <div className="flex gap-6 max-sm:justify-start sm:justify-center">
        {bankStrip.map((bank, i) => (
          <span
            key={i}
            className="flex h-[72px] w-[200px] shrink-0 items-center justify-center rounded-[14px] bg-white/92 p-2 opacity-85 transition-[opacity,translate] duration-200 hover:-translate-y-0.5 hover:opacity-100"
          >
            <Image src={bank.logo} alt={bank.name} width={184} height={56} className="h-14 w-full object-cover" />
          </span>
        ))}
      </div>
    </Reveal>
  );
}

/** Three small bank logos shown under each model showcase. */
export function BankChips() {
  return (
    <div className="flex flex-wrap gap-3 py-1">
      {partnerBanks.map((bank) => (
        <span
          key={bank.name}
          className="flex h-12 w-[120px] items-center justify-center rounded-xl bg-white/92 px-2.5 py-1.5 opacity-90 transition-[opacity,translate] duration-200 hover:-translate-y-0.5 hover:opacity-100"
        >
          <Image src={bank.logo} alt={bank.name} width={100} height={36} className="h-full w-full object-contain" />
        </span>
      ))}
    </div>
  );
}
