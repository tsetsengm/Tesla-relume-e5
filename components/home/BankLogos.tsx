import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { partnerBanks } from "@/data/banks";

/**
 * "Ногоон зээлээр авах боломж" — the only place bank logos appear on the site (Prägnanz).
 * Label and logos share one bordered band (Common Region), each bank shown once.
 */
export function BankStrip() {
  return (
    <Reveal as="section" variant="grow" className="border-y border-line bg-glass px-4 py-7 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-site flex-col items-center gap-5 md:flex-row md:justify-between md:gap-10">
        <div className="text-center md:text-left">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-2">Ногоон зээлээр авах боломж</h2>
          <p className="mt-1.5 text-sm text-muted">Түнш банкуудаар хөнгөлөлттэй хүүтэй зээл</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-4">
          {partnerBanks.map((bank) => (
            <li
              key={bank.name}
              className="flex h-[60px] w-[168px] items-center justify-center rounded-[14px] bg-white/92 px-3 py-2 opacity-90 transition-[opacity,translate] duration-200 hover:-translate-y-0.5 hover:opacity-100"
            >
              <Image src={bank.logo} alt={bank.name} width={152} height={44} className="h-full w-full object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
