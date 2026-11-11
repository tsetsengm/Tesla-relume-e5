export type Bank = { name: string; logo: string };

export const banks = {
  golomt: { name: "Golomt Bank", logo: "/assets/images/bank-logo-1.png" },
  tdb: { name: "TDB", logo: "/assets/images/bank-logo-2.png" },
  mbank: { name: "M Bank", logo: "/assets/images/bank-logo-3.png" },
} satisfies Record<string, Bank>;

/** "Ногоон зээлээр авах боломж" strip */
export const bankStrip: Bank[] = [
  banks.golomt,
  banks.tdb,
  banks.mbank,
  banks.golomt,
  banks.tdb,
  banks.mbank,
  banks.golomt,
];

/** Small logos shown under each model showcase */
export const partnerBanks: Bank[] = [banks.mbank, banks.golomt, banks.tdb];
