import { BankChips, BankStrip } from "@/components/home/BankLogos";
import { ModelCard } from "@/components/home/ModelCard";
import { RobotaxiSlider } from "@/components/home/RobotaxiSlider";
import { Button } from "@/components/ui/Button";
import { FeatureShowcase } from "@/components/ui/FeatureShowcase";
import { Hero } from "@/components/ui/Hero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { models, robotaxiSlides } from "@/data/models";

export default function HomePage() {
  return (
    <>
      <Hero image="/assets/images/hero.jpg" compact>
        <div className="flex max-w-[768px] flex-col gap-6">
          <Reveal variant="grow" delay={60}>
            <h1 className="heading-1">
              Албан ёсны дистрибютер
            </h1>
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
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
          {models.map((model, i) => (
            <Reveal key={model.slug} variant="grow" delay={i * 90}>
              <ModelCard model={model} />
            </Reveal>
          ))}
        </div>
      </Section>

      <BankStrip />

      {models.map((model, i) => (
        <Section key={model.slug} id={model.slug} compact>
          <Reveal variant="grow">
            <FeatureShowcase media={model.showcase.media} title={model.name} paragraphs={model.showcase.paragraphs} reverse={i % 2 === 1}>
              <BankChips />
              <div className="flex flex-wrap items-center gap-6">
                <Button href="#">
                  {model.showcase.primaryAction}
                </Button>
                <Button href={model.detailHref ?? "#"} variant="link" icon="chevron">
                  Дэлгэрэнгүй
                </Button>
              </div>
            </FeatureShowcase>
          </Reveal>
        </Section>
      ))}

      <Section id="robotaxi" compact>
        <div className="flex flex-col items-center gap-16 max-sm:gap-10">
          <div className="flex max-w-[680px] flex-col gap-[18px] text-center">
            <Reveal variant="grow">
              <h2 className="heading-2">Robotaxi үйлчилгээ</h2>
            </Reveal>
            <Reveal variant="grow" delay={90}>
              <p className="lead">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </Reveal>
          </div>
          <Reveal variant="grow" delay={180} className="w-full">
            <RobotaxiSlider slides={robotaxiSlides} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
