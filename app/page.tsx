import Image from "next/image";
import { Fragment } from "react";
import { BankStrip } from "@/components/home/BankLogos";
import { LoanBox } from "@/components/home/LoanBox";
import { ModelCard } from "@/components/home/ModelCard";
import { ModelStepper } from "@/components/home/ModelStepper";
import { RobotaxiSlider } from "@/components/home/RobotaxiSlider";
import { Button } from "@/components/ui/Button";
import { FeatureShowcase } from "@/components/ui/FeatureShowcase";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackCard } from "@/components/ui/StackCard";
import { robotaxiSlides } from "@/data/models";
import { getModels } from "@/lib/models";

export default async function HomePage() {
  const models = await getModels();
  const total = String(models.length).padStart(2, "0");

  return (
    <>
      {/* Golden ratio hero: text 1 : photo φ (38.2% / 61.8%), the photo is a golden rectangle (φ:1),
          type steps by φ (19px → 31px → 50px), line height φ, spacing on Fibonacci numbers (13 · 21 · 34 · 55 · 89) */}
      <section className="px-4 py-[55px] sm:px-8 lg:px-16 lg:py-[89px]">
        <div className="mx-auto grid w-full max-w-site items-center gap-[34px] lg:grid-cols-[1fr_1.618fr] lg:gap-[55px]">
          <div className="flex flex-col gap-[21px]">
            <Reveal variant="grow" delay={60}>
              <h1 className="heading-1 text-[clamp(40px,3.9vw,50px)]!">Албан ёсны дистрибютер</h1>
            </Reveal>
            <Reveal variant="grow" delay={180}>
              <p className="text-[clamp(16px,1.6vw,19px)] leading-[1.618] text-muted">
                Хүчирхэг, хэмнэлттэй, байгальд ээлтэй ирээдүйн жолоодлогыг өнөөдөр эхлүүл.
              </p>
            </Reveal>
            <Reveal variant="grow" delay={300} className="mt-[13px] flex flex-wrap items-center gap-[13px] max-sm:[&>*]:flex-[1_1_100%]">
              <Button testDrive icon="arrow">
                Test drive
              </Button>
              <Button href="#contact" variant="secondary">
                Холбоо барих
              </Button>
            </Reveal>
          </div>
          <Reveal variant="grow" delay={180}>
            <div className="group relative aspect-[1.618] overflow-hidden rounded-panel border border-line">
              <Image
                src="/assets/images/hero.jpg"
                alt="Tesla-ийн загварууд салоны өмнө"
                fill
                priority
                sizes="(min-width: 992px) 62vw, 100vw"
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Section id="models" compact>
        <SectionHeading variant="grow" tagline="Загварууд" title="Өөрт тохирох Tesla-гаа сонго" spacing="compact" wide />
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
          {models.map((model, i) => (
            <Reveal key={model.slug} variant="grow" delay={i * 90}>
              <ModelCard model={model} />
            </Reveal>
          ))}
        </div>
      </Section>

      <BankStrip />

      {/* Uniform Connectedness: one sticky stepper links the four showcases */}
      <div className="relative mt-8 lg:mt-14">
        <ModelStepper steps={models.map((m) => ({ slug: m.slug, name: m.name }))} />
        {models.map((model, i) => (
          <Fragment key={model.slug}>
            {/* Anchor + scroll-spy target. Kept off the sticky section: a pinned section reports its stuck position,
                so jumping back to it would go nowhere. scroll-margin clears the navbar (72px) + stepper (~58px) */}
            <div id={model.slug} aria-hidden className="scroll-mt-[136px]" />
          {/* Pinned stack (desktop): each showcase sticks under the stepper and the next one slides over it */}
          <Section compact className="pin:sticky pin:top-[132px] pin:pt-4">
            <Reveal variant="grow">
              <StackCard>
              <FeatureShowcase
                media={model.showcase.media}
                tagline={`${String(i + 1).padStart(2, "0")} / ${total}`}
                title={model.name}
                paragraphs={model.showcase.paragraphs}
                reverse={i % 2 === 1}
              >
                {(model.loan || model.deposit) && <LoanBox loan={model.loan} deposit={model.deposit} />}
                {/* Similarity: one green action per section */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Same label ⇒ same action as the card: the model's order page */}
                  <Button href={`/order/${model.slug}`} magnetic>{model.showcase.primaryAction}</Button>
                  {model.detailHref && (
                    <Button href={model.detailHref} variant="link" icon="chevron">
                      Дэлгэрэнгүй
                    </Button>
                  )}
                </div>
              </FeatureShowcase>
              </StackCard>
            </Reveal>
          </Section>
          </Fragment>
        ))}
      </div>

      <Section id="robotaxi" compact>
        <div className="flex flex-col items-center gap-16 max-sm:gap-10">
          <SectionHeading
            variant="grow"
            tagline="Ирээдүйн тээвэр"
            title="Robotaxi үйлчилгээ"
            text="Tesla-гийн өөрөө жолооддог технологид суурилсан такси үйлчилгээ. Зургуудаас сонирхоорой."
            spacing="none"
          />
          <Reveal variant="grow" delay={180} className="w-full">
            <RobotaxiSlider slides={robotaxiSlides} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
