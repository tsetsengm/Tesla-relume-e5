import type { LucideIcon } from "lucide-react";

export type Heading = { tagline: string; title: string; text?: string };

export type Feature = { icon: LucideIcon; title: string; text: string };

export type Trim = {
  name: string;
  subtitle: string;
  price: string;
  lease: string;
  stats: { value: string; label: string }[];
  badge?: string;
  featured?: boolean;
};

export type SpecGroup = {
  title: string;
  rows: { label: string; values: string[] }[];
};

export type ModelDetail = {
  slug: string;
  meta: { title: string; description: string };
  hero: {
    tagline: string;
    title: string;
    text: string;
    image: string;
    stats: { value: string; label: string }[];
  };
  trims: Heading & { items: Trim[] };
  highlights: Heading & { items: Feature[] };
  app: {
    tagline: string;
    title: string;
    text: string;
    image: { src: string; alt: string };
    items: Feature[];
  };
  safety: Heading & { items: Feature[] };
  charging: Heading & { items: Feature[]; banner: Feature };
  performance: Heading & { items: Feature[] };
  specs: Heading & { columns: string[]; groups: SpecGroup[]; footnote: string };
  cta: { tagline: string; title: string; text: string };
};
