export type Bank = { name: string; logo: string };

export const banks = {
  golomt: { name: "Golomt Bank", logo: "/assets/images/bank-logo-1.png" },
  tdb: { name: "TDB", logo: "/assets/images/bank-logo-2.png" },
  mbank: { name: "M Bank", logo: "/assets/images/bank-logo-3.png" },
} satisfies Record<string, Bank>;

/** Green-loan partner banks: logos in the home BankStrip, names in each showcase's LoanBox */
export const partnerBanks: Bank[] = [banks.golomt, banks.tdb, banks.mbank];
