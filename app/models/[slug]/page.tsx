import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CtaCard } from "@/components/model/CtaCard";
import { CheckList, FeatureGrid, PowerBanner } from "@/components/model/FeatureGrid";
import { ModelHero } from "@/components/model/ModelHero";
import { SpecTable } from "@/components/model/SpecTable";
import { TrimCard } from "@/components/model/TrimCard";
import { FeatureShowcase } from "@/components/ui/FeatureShowcase";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionNav } from "@/components/model/SectionNav";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getModelDetail, modelSlugs } from "@/data/model-details";

/** Anchored chapters clear the navbar (72px) + sticky SectionNav (~54px) */
const CHAPTER_OFFSET = "scroll-mt-[132px]";

export function generateStaticParams() {
  return modelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const detail = getModelDetail((await params).slug);
  return detail ? detail.meta : {};
}

export default function ModelPage({ params }: PageProps<"/models/[slug]">) {
  // Reading params inside Suspense keeps navigation instant under Cache Components.
  // Listed slugs are still fully prerendered; unknown ones get a real 404 from proxy.ts.
  return (
    <Suspense fallback={null}>
      <ModelContent params={params} />
    </Suspense>
  );
}

async function ModelContent({ params }: { params: PageProps<"/models/[slug]">["params"] }) {
  const { slug } = await params;
  const detail = getModelDetail(slug);
  if (!detail) notFound();

  const { hero, trims, highlights, app, safety, charging, performance, specs, cta } = detail;
  const chapters = [
    { id: "trims", label: "Хувилбар" },
    { id: "highlights", label: "Онцлог" },
    { id: "app", label: "Апп" },
    { id: "safety", label: "Аюулгүй" },
    { id: "charging", label: "Цэнэглэлт" },
    { id: "performance", label: "Performance" },
    { id: "specs", label: "Үзүүлэлт" },
  ];

  return (
    <>
      <ModelHero hero={hero} />

      {/* Uniform Connectedness: one sticky bar links every chapter of the page */}
      <div className="relative">
      <SectionNav items={chapters} cta={{ href: `/order/${slug}`, label: "Захиалах" }} />

      <Section id="trims" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={trims.tagline} title={trims.title} text={trims.text} />
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {trims.items.map((trim, i) => (
            <Reveal key={trim.name} delay={i * 90}>
              <TrimCard trim={trim} orderHref={`/order/${slug}?trim=${encodeURIComponent(trim.name)}`} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="highlights" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={highlights.tagline} title={highlights.title} text={highlights.text} />
        <FeatureGrid items={highlights.items} />
      </Section>

      <Section id="app" className={CHAPTER_OFFSET}>
        <Reveal>
          <FeatureShowcase media={{ type: "image", ...app.image }} tagline={app.tagline} title={app.title} paragraphs={[app.text]} reverse>
            <CheckList items={app.items} />
          </FeatureShowcase>
        </Reveal>
      </Section>

      <Section id="safety" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={safety.tagline} title={safety.title} text={safety.text} />
        <FeatureGrid items={safety.items} />
      </Section>

      <Section id="charging" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={charging.tagline} title={charging.title} text={charging.text} />
        <FeatureGrid items={charging.items} />
        <PowerBanner feature={charging.banner} />
      </Section>

      <Section id="performance" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={performance.tagline} title={performance.title} text={performance.text} />
        <FeatureGrid items={performance.items} />
      </Section>

      <Section id="specs" className={CHAPTER_OFFSET}>
        <SectionHeading tagline={specs.tagline} title={specs.title} />
        <SpecTable columns={specs.columns} groups={specs.groups} />
        <p className="mt-5 max-w-[860px] text-[13px] leading-[1.6] text-muted-2">{specs.footnote}</p>
      </Section>

      <Section>
        <CtaCard {...cta} />
      </Section>
      </div>
    </>
  );
}
