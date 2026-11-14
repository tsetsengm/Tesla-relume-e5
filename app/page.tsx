import { BankStrip } from "@/components/home/BankLogos";
import { LoanBox } from "@/components/home/LoanBox";
import { ModelCard } from "@/components/home/ModelCard";
import { ModelStepper } from "@/components/home/ModelStepper";
import { RobotaxiSlider } from "@/components/home/RobotaxiSlider";
import { Button } from "@/components/ui/Button";
import { FeatureShowcase } from "@/components/ui/FeatureShowcase";
import { Hero } from "@/components/ui/Hero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { robotaxiSlides } from "@/data/models";
import { getModels } from "@/lib/models";

export default async function HomePage() {
  const models = await getModels();
  const total = String(models.length).padStart(2, "0");

  return (
    <>
      <Hero image="/assets/images/hero.jpg" compact>
        <div className="flex max-w-[768px] flex-col gap-6">
          <Reveal variant="grow" delay={60}>
            <h1 className="heading-1">Албан ёсны дистрибютер</h1>
          </Reveal>
          <Reveal variant="grow" delay={180}>
            <p className="max-w-[560px] text-[clamp(16px,2vw,19px)] leading-[1.6] text-muted">
              Хүчирхэг, хэмнэлттэй, байгальд ээлтэй ирээдүйн жолоодлогыг өнөөдөр эхлүүл.
            </p>
          </Reveal>
          <Reveal variant="grow" delay={300} className="mt-3.5 flex flex-wrap items-center gap-3.5 max-sm:[&>*]:flex-[1_1_100%]">
            <Button href="#contact" icon="arrow">
              Test drive
            </Button>
            <Button href="#contact" variant="secondary">
              Холбоо барих
            </Button>
          </Reveal>
        </div>
      </Hero>

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
          // scroll-margin clears the navbar (72px) + stepper (~58px)
          <Section key={model.slug} id={model.slug} compact className="scroll-mt-[136px]">
            <Reveal variant="grow">
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
                  <Button href={`/order/${model.slug}`}>{model.showcase.primaryAction}</Button>
                  {model.detailHref && (
                    <Button href={model.detailHref} variant="link" icon="chevron">
                      Дэлгэрэнгүй
                    </Button>
                  )}
                </div>
              </FeatureShowcase>
            </Reveal>
          </Section>
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
