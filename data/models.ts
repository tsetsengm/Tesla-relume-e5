// Model content lives in the Supabase `models` table — see lib/models.ts (getModels).

export type ShowcaseMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; poster: string; label: string };

export type Model = {
  slug: string;
  name: string;
  /** Detail page, when one exists */
  detailHref?: string;
  card: { image: string; alt: string; description: string };
  /** Green-loan terms; shown in the showcase loan box when present */
  loan?: { rate?: string; leaseFrom?: string };
  /** Order deposit in ₮. When set, "Одоо захиалах" starts a Byl checkout instead of jumping to #contact */
  deposit?: number;
  showcase: {
    media: ShowcaseMedia;
    paragraphs: string[];
    primaryAction: string;
  };
};

export const robotaxiSlides = [
  { src: "/assets/images/hero.jpg", alt: "Robotaxi зураг 1" },
  { src: "/assets/images/gallery-2.jpg", alt: "Robotaxi зураг 2" },
  { src: "/assets/images/gallery-3.jpg", alt: "Robotaxi зураг 3" },
];
