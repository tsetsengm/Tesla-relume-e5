import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaCard } from "@/components/model/CtaCard";
import { CheckList, FeatureGrid, PowerBanner } from "@/components/model/FeatureGrid";
import { ModelHero } from "@/components/model/ModelHero";
import { SpecTable } from "@/components/model/SpecTable";
import { TrimCard } from "@/components/model/TrimCard";
import { FeatureShowcase } from "@/components/ui/FeatureShowcase";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getModelDetail, modelSlugs } from "@/data/model-details";

export function generateStaticParams() {
  return modelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const detail = getModelDetail((await params).slug);
  return detail ? detail.meta : {};
}

export default async function ModelPage({ params }: PageProps<"/models/[slug]">) {
  const detail = getModelDetail((await params).slug);
  // Unknown slugs are answered with a real 404 by proxy.ts; this is the fallback.
  if (!detail) notFound();

  const { hero, trims, highlights, app, safety, charging, performance, specs, cta } = detail;

  return (
    <>
      <ModelHero hero={hero} />

      <Section id="trims">
        <SectionHeading tagline={trims.tagline} title={trims.title} text={trims.text} />
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {trims.items.map((trim, i) => (
            <Reveal key={trim.name} delay={i * 90}>
              <TrimCard trim={trim} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading tagline={highlights.tagline} title={highlights.title} text={highlights.text} />
        <FeatureGrid items={highlights.items} />
      </Section>

      <Section>
        <Reveal>
          <FeatureShowcase media={{ type: "image", ...app.image }} tagline={app.tagline} title={app.title} paragraphs={[app.text]} reverse>
            <CheckList items={app.items} />
          </FeatureShowcase>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading tagline={safety.tagline} title={safety.title} text={safety.text} />
        <FeatureGrid items={safety.items} />
      </Section>

      <Section>
        <SectionHeading tagline={charging.tagline} title={charging.title} text={charging.text} />
        <FeatureGrid items={charging.items} />
        <PowerBanner feature={charging.banner} />
      </Section>

      <Section>
        <SectionHeading tagline={performance.tagline} title={performance.title} text={performance.text} />
        <FeatureGrid items={performance.items} />
      </Section>

      <Section id="specs">
        <SectionHeading tagline={specs.tagline} title={specs.title} />
        <SpecTable columns={specs.columns} groups={specs.groups} />
        <p className="mt-5 max-w-[860px] text-[13px] leading-[1.6] text-muted-2">{specs.footnote}</p>
      </Section>

      <Section>
        <CtaCard {...cta} />
      </Section>
    </>
  );
}
