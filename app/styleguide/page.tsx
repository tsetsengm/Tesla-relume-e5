import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoanBox } from "@/components/home/LoanBox";
import { ModelCard } from "@/components/home/ModelCard";
import { CheckList, FeatureItem, IconBadge } from "@/components/model/FeatureGrid";
import { SpecTable } from "@/components/model/SpecTable";
import { TrimCard } from "@/components/model/TrimCard";
import { ColorSwatch } from "@/components/styleguide/ColorSwatch";
import { MotionReplay } from "@/components/styleguide/MotionReplay";
import { Code, Demo, SgSection, SubHeading } from "@/components/styleguide/Primitives";
import { Toc } from "@/components/styleguide/Toc";
import { TypeSpecimen } from "@/components/styleguide/TypeSpecimen";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { model3 } from "@/data/model-details/model-3";
import type { Feature } from "@/data/model-details/types";
import { getModels } from "@/lib/models";
import {
  breakpoints,
  colorGroups,
  layoutTokens,
  motions,
  pageSections,
  principles,
  radii,
  sgSections,
  spacingScale,
  typeStyles,
} from "@/data/styleguide";

export const metadata: Metadata = {
  title: "Styleguide — Дизайн систем",
  description: "Сайтын өнгө, үсэг, зай, компонент, хөдөлгөөний сан.",
};

const sectionIndex = (id: (typeof sgSections)[number]["id"]) => sgSections.findIndex((s) => s.id === id) + 1;
const sectionLabel = (id: (typeof sgSections)[number]["id"]) => sgSections.find((s) => s.id === id)!.label;

/** Figma icons shipped in public/assets/icons — listed from disk so new files show up automatically. */
function figmaIcons() {
  return fs
    .readdirSync(path.join(process.cwd(), "public/assets/icons"))
    .filter((f) => f.endsWith(".svg") && !f.startsWith("tesla-wordmark"))
    .sort();
}

/** Every Lucide icon the model pages use, de-duplicated. */
function lucideIcons() {
  const all: Feature[] = [
    ...model3.highlights.items,
    ...model3.app.items,
    ...model3.safety.items,
    ...model3.charging.items,
    model3.charging.banner,
    ...model3.performance.items,
  ];
  return [...new Map(all.map((f) => [f.icon.displayName ?? f.title, f.icon])).entries()];
}

export default async function StyleguidePage() {
  const [featuredModel] = await getModels();

  return (
    <div className="px-4 py-16 sm:px-8 lg:px-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-site gap-16 lg:grid-cols-[200px_minmax(0,1fr)]">
        <Toc />

        <div className="min-w-0">
          {/* Intro */}
          <header className="mb-20 lg:mb-28">
            <p className="tagline mb-4">Design system · Styleguide</p>
            <h1 className="heading-1">Tesla дизайн систем</h1>
            <p className="lead mt-6 max-w-[680px]">
              Сайтын бодит token, компонент, хөдөлгөөний сан. Өнгө, үсгийн утгыг browser дотроос <Code>app/globals.css</Code>-ээс шууд уншдаг тул
              token өөрчлөгдөхөд энэ хуудас автоматаар шинэчлэгдэнэ. Доорх компонентууд нь сайт дээр ашиглагдаж буй яг тэр компонентууд.
            </p>
          </header>

          {/* 01 Principles */}
          <SgSection id="principles" index={sectionIndex("principles")} title={sectionLabel("principles")}>
            <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
              {principles.map((p) => (
                <GlassCard key={p.title} className="p-6">
                  <p className="tagline relative mb-3 text-[10px]">{p.law}</p>
                  <h3 className="relative mb-3 text-[17px] font-semibold leading-snug">{p.title}</h3>
                  <p className="relative text-sm leading-[1.6] text-muted">{p.text}</p>
                </GlassCard>
              ))}
            </div>
          </SgSection>

          {/* 02 Brand */}
          <SgSection id="brand" index={sectionIndex("brand")} title={sectionLabel("brand")}>
            {/* Only the two backgrounds the wordmark really sits on */}
            <div className="grid gap-[18px] sm:grid-cols-2">
              {[
                { label: "Footer дээр", note: "--color-bg", className: "bg-bg border border-line" },
                { label: "Navbar дээр", note: "bg 55% + blur 16px", photo: true, className: "border border-line" },
              ].map((tile) => (
                <div key={tile.label} className={`relative flex aspect-[16/9] flex-col items-center justify-center overflow-hidden rounded-card ${tile.className}`}>
                  {tile.photo && (
                    <>
                      <Image src="/assets/images/hero.jpg" alt="" fill sizes="600px" className="object-cover" />
                      <div className="absolute inset-0 bg-bg/55 backdrop-blur-[16px]" />
                    </>
                  )}
                  <Image src="/assets/icons/tesla-wordmark.svg" width={160} height={16} alt="Tesla" unoptimized className="relative" />
                  <p className="absolute bottom-5 text-[13px] text-muted">
                    {tile.label} · <Code className="text-[11px]">{tile.note}</Code>
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[680px] text-sm leading-[1.6] text-muted">
              <Code>public/assets/icons/tesla-wordmark.svg</Code> — цагаан fill, харьцаа ≈10:1. Navbar болон footer дээр 140px өргөнтэй.
            </p>
          </SgSection>

          {/* 03 Color */}
          <SgSection
            id="color"
            index={sectionIndex("color")}
            title={sectionLabel("color")}
            intro={
              <>
                Утга, тунгалаг байдал, <Code>--color-bg</Code>-тэй харьцуулсан contrast-ыг browser-оос шууд уншина. Tailwind-д <Code>bg-accent</Code>,{" "}
                <Code>text-muted</Code>, <Code>border-line</Code> гэх мэтээр хэрэглэнэ.
              </>
            }
          >
            {colorGroups.map((group, i) => (
              <div key={group.title}>
                <SubHeading first={i === 0}>{group.title}</SubHeading>
                <GlassCard className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-3 sm:p-8">
                  {group.tokens.map((t) => (
                    <ColorSwatch key={t.name} name={t.name} usage={t.usage} />
                  ))}
                </GlassCard>
              </div>
            ))}

            <SubHeading>Градиент</SubHeading>
            <div className="grid gap-[18px] sm:grid-cols-3">
              {[
                { name: "Primary товч", code: "from-accent to-accent-2", el: <div className="h-16 rounded-xl bg-linear-to-b from-accent to-accent-2" /> },
                { name: "Статистик бичвэр", code: ".text-gradient", el: <p className="text-gradient text-4xl font-extrabold">584 км</p> },
                { name: "Featured карт", code: "tone=\"accent\"", el: <GlassCard tone="accent" className="h-16">{null}</GlassCard> },
              ].map((g) => (
                <div key={g.name}>
                  {g.el}
                  <p className="mt-3 text-[13px] text-ink">{g.name}</p>
                  <Code className="text-[11px] text-muted">{g.code}</Code>
                </div>
              ))}
            </div>
          </SgSection>

          {/* 04 Type */}
          <SgSection
            id="type"
            index={sectionIndex("type")}
            title={sectionLabel("type")}
            intro={
              <>
                Нэг үсгийн гэр бүл — <strong className="text-ink">Inter</strong> (latin + кирилл), <Code>next/font</Code>-оор ачаална. Хэмжээ, мөрийн өндрийг
                browser-оос хэмжиж харуулна; цонхны өргөнийг өөрчлөхөд <Code>clamp()</Code> утгууд дагаж солигдоно.
              </>
            }
          >
            <GlassCard className="mb-10 flex flex-wrap items-end gap-x-10 gap-y-4 p-6 sm:p-8">
              <p className="relative text-6xl font-extrabold tracking-[-0.03em]">Аа Өө Үү</p>
              <p className="relative font-mono text-sm text-muted">Inter · 400 · 500 · 600 · 700 · 800</p>
            </GlassCard>
            <div>
              {typeStyles.map((t) => (
                <TypeSpecimen key={t.name} {...t} />
              ))}
            </div>
          </SgSection>

          {/* 05 Spacing */}
          <SgSection
            id="spacing"
            index={sectionIndex("spacing")}
            title={sectionLabel("spacing")}
            intro={<>Tailwind-ийн 4px шатлал. Түүхий px-ийн оронд <Code>p-4</Code>, <Code>gap-6</Code> гэх мэт утга хэрэглэнэ.</>}
          >
            <GlassCard className="flex flex-col gap-3 p-6 sm:p-8">
              {spacingScale.map((px) => (
                <div key={px} className="relative flex items-center gap-4">
                  <span className="w-14 shrink-0 font-mono text-[12px] text-muted-2">{px}px</span>
                  <span className="h-3 rounded-sm bg-accent/70" style={{ width: px * 2 }} />
                  <Code className="text-[11px] text-muted">{px / 4}</Code>
                </div>
              ))}
            </GlassCard>

            <SubHeading>Байршил</SubHeading>
            <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
              {layoutTokens.map((l) => (
                <GlassCard key={l.name} className="p-5">
                  <p className="relative text-[13px] text-muted">{l.name}</p>
                  <p className="relative mt-1 text-xl font-bold">{l.value}</p>
                  <Code className="relative mt-2 inline-block text-[11px] text-muted">{l.note}</Code>
                </GlassCard>
              ))}
            </div>

            <SubHeading>Breakpoint</SubHeading>
            <div className="grid gap-[18px] sm:grid-cols-3">
              {breakpoints.map((b) => (
                <GlassCard key={b.name} className="p-5">
                  <p className="relative font-mono text-sm text-accent">{b.name}:</p>
                  <p className="relative mt-1 text-xl font-bold">≥ {b.value}</p>
                  <p className="relative mt-1 text-[13px] text-muted">{b.note}</p>
                </GlassCard>
              ))}
            </div>
          </SgSection>

          {/* 06 Shape */}
          <SgSection id="shape" index={sectionIndex("shape")} title={sectionLabel("shape")}>
            <div className="grid grid-cols-2 gap-[18px] sm:grid-cols-4">
              {radii.map((r) => (
                <div key={r.name}>
                  <div className={`aspect-square border border-line-strong bg-glass-2 ${r.className}`} />
                  <Code className="mt-3 inline-block text-[12px]">{r.name}</Code>
                  <p className="mt-1 font-mono text-[12px] text-muted-2">{r.value}</p>
                  <p className="mt-1 text-[13px] text-muted">{r.usage}</p>
                </div>
              ))}
            </div>
          </SgSection>

          {/* 07 Stroke */}
          <SgSection id="stroke" index={sectionIndex("stroke")} title={sectionLabel("stroke")}>
            <div className="grid gap-[18px] sm:grid-cols-2">
              {[
                { name: "Hairline", code: "border-line", note: "Карт, navbar, footer, хүснэгт", box: "border border-line" },
                { name: "Strong", code: "border-line-strong", note: "Самбар, secondary товч, input", box: "border border-line-strong" },
                { name: "Accent", code: "border-accent/40", note: "Featured trim карт (slider сумны hover дээр /50)", box: "border border-accent/40" },
                { name: "Gradient hairline", code: ".hairline", note: "FeatureShowcase-ийн ногоон гэрэлт хүрээ", box: "hairline relative border border-line-strong" },
              ].map((s) => (
                <div key={s.name} className={`rounded-card bg-glass p-6 ${s.box}`}>
                  <p className="text-[15px] font-semibold">{s.name}</p>
                  <Code className="mt-2 inline-block text-[11px] text-muted">{s.code}</Code>
                  <p className="mt-2 text-[13px] text-muted">{s.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-[18px] rounded-card border border-line bg-glass p-6">
              <p className="text-[15px] font-semibold">Divider</p>
              <div className="my-4 border-t border-line" />
              <p className="text-[13px] text-muted">
                <Code className="text-[11px]">border-t border-line</Code> — hero статистик, trim картын үзүүлэлт, footer.
              </p>
            </div>
          </SgSection>

          {/* 08 Shade */}
          <SgSection id="shade" index={sectionIndex("shade")} title={sectionLabel("shade")}>
            <SubHeading first>Сүүдэр</SubHeading>
            <div className="grid gap-[18px] sm:grid-cols-3">
              <div>
                <div className="h-28 rounded-panel border border-line-strong bg-glass-2 shadow-panel" />
                <Code className="mt-3 inline-block text-[12px]">shadow-panel</Code>
                <p className="mt-1 text-[13px] text-muted">Showcase, CTA, slider-ийн зураг</p>
              </div>
              <div className="flex flex-col">
                <div className="flex h-28 items-center justify-center">
                  <span className="rounded-full bg-linear-to-b from-accent to-accent-2 px-6 py-3 font-semibold text-accent-ink shadow-glow">shadow-glow</span>
                </div>
                <Code className="mt-3 inline-block self-start text-[12px]">shadow-glow</Code>
                <p className="mt-1 text-[13px] text-muted">Primary товч</p>
              </div>
              <div className="flex flex-col">
                <div className="flex h-28 items-center justify-center">
                  <span className="rounded-full bg-linear-to-b from-accent to-accent-2 px-6 py-3 font-semibold text-accent-ink shadow-glow-lg">shadow-glow-lg</span>
                </div>
                <Code className="mt-3 inline-block self-start text-[12px]">shadow-glow-lg</Code>
                <p className="mt-1 text-[13px] text-muted">Primary товчны hover</p>
              </div>
            </div>

            <SubHeading>Бүрхүүл ба blur</SubHeading>
            <div className="grid gap-[18px] sm:grid-cols-3">
              {[
                {
                  name: "Hero overlay",
                  code: "radial + linear gradient",
                  note: "Hero зургийн дээд, зүүн талыг бараан болгоно",
                  layer: (
                    <div className="absolute inset-0 bg-[radial-gradient(125%_62%_at_50%_-10%,rgb(4_6_15/0.82)_0%,rgb(4_6_15/0.28)_44%,transparent_68%),linear-gradient(90deg,rgb(4_6_15/0.75)_0%,transparent_70%)]" />
                  ),
                },
                { name: "Видео overlay", code: "bg-bg/62", note: "Видео poster дээр, play товч тод харагдана", layer: <div className="absolute inset-0 bg-bg/62" /> },
                {
                  name: "Glass blur",
                  code: "bg-glass backdrop-blur-[14px]",
                  note: "Карт, navbar (16px), самбар (18px)",
                  layer: <div className="absolute inset-x-6 inset-y-8 rounded-card border border-line bg-glass backdrop-blur-[14px]" />,
                },
              ].map((o) => (
                <div key={o.name}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line">
                    <Image src="/assets/images/hero.jpg" alt="" fill sizes="400px" className="object-cover" />
                    {o.layer}
                  </div>
                  <p className="mt-3 text-[13px] text-ink">{o.name}</p>
                  <Code className="text-[11px] text-muted">{o.code}</Code>
                  <p className="mt-1 text-[13px] text-muted">{o.note}</p>
                </div>
              ))}
            </div>
          </SgSection>

          {/* 09 Icons */}
          <SgSection
            id="icons"
            index={sectionIndex("icons")}
            title={sectionLabel("icons")}
            intro={
              <>
                Хоёр эх сурвалжтай: Figma-аас татсан SVG (<Code>public/assets/icons</Code>, хар өнгөтэй тул <Code>invert</Code> хийнэ) ба загварын хуудасны
                line icon-ууд (<Code>lucide-react</Code>, stroke 1.6, <Code>text-accent</Code>).
              </>
            }
          >
            <SubHeading first>Figma SVG</SubHeading>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 xl:grid-cols-7">
              {figmaIcons().map((file) => (
                <GlassCard key={file} className="flex flex-col items-center gap-3 px-2 py-5">
                  <Image src={`/assets/icons/${file}`} width={28} height={28} alt="" unoptimized className={`relative h-7 w-auto ${file === "play.svg" ? "" : "invert"}`} />
                  <span className="relative max-w-full truncate font-mono text-[10px] text-muted-2">{file.replace(".svg", "")}</span>
                </GlassCard>
              ))}
            </div>

            <SubHeading>Lucide</SubHeading>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 xl:grid-cols-7">
              {lucideIcons().map(([name, Icon]) => (
                <GlassCard key={name} className="flex flex-col items-center gap-3 px-2 py-5">
                  <IconBadge icon={Icon} className="relative" />
                  <span className="relative max-w-full truncate font-mono text-[10px] text-muted-2">{name}</span>
                </GlassCard>
              ))}
            </div>
          </SgSection>

          {/* 10 Components */}
          <SgSection id="components" index={sectionIndex("components")} title={sectionLabel("components")}>
            <div className="flex flex-col gap-[18px]">
              <Demo
                name="Button"
                file="components/ui/Button.tsx"
                description={
                  <>
                    Pill хэлбэр, 600 жин. <Code>variant</Code>: primary · secondary · link, <Code>size</Code>: md · sm, <Code>icon</Code>: arrow · chevron. Hover
                    дээр 2px дээш. <Code>#</Code>-ээр эхэлсэн href нь Lenis-ээр зөөлөн scroll хийнэ.
                  </>
                }
                className="flex flex-col gap-6"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <Button href="#components" icon="arrow">
                    Test drive
                  </Button>
                  <Button href="#components">Одоо захиалах</Button>
                  <Button href="#components" variant="secondary">
                    Холбоо барих
                  </Button>
                  <Button href="#components" variant="link" icon="chevron">
                    Дэлгэрэнгүй
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button href="#components" size="sm">
                    Test drive
                  </Button>
                  <Button href="#components" variant="secondary" size="sm">
                    Холбоо барих
                  </Button>
                  <Button href="#components" variant="link" size="sm" icon="chevron">
                    Дэлгэрэнгүй
                  </Button>
                </div>
              </Demo>

              <Demo
                name="GlassCard"
                file="components/ui/GlassCard.tsx"
                description={
                  <>
                    <Code>tone</Code>: default · strong · accent. <Code>interactive</Code> үед hover дээр өргөгдөж, ногоон гэрэл тусна.
                  </>
                }
                className="grid gap-[18px] sm:grid-cols-3"
              >
                {(["default", "strong", "accent"] as const).map((tone) => (
                  <GlassCard key={tone} tone={tone} interactive className="p-6">
                    <p className="relative font-mono text-[13px]">tone=&quot;{tone}&quot;</p>
                    <p className="relative mt-2 text-[13px] text-muted">Hover хийж үзээрэй</p>
                  </GlassCard>
                ))}
              </Demo>

              <Demo name="SectionHeading" file="components/ui/SectionHeading.tsx" description="Tagline + гарчиг + lead, гурвуулаа дараалан гарч ирнэ.">
                <SectionHeading tagline="Цэнэглэлт" title="Хялбар, хурдан цэнэглэлт" text="Цахилгаан байгаа хаана ч цэнэглэнэ." spacing="none" />
              </Demo>

              <div className="grid gap-[18px] lg:grid-cols-2">
                <Demo name="ModelCard" file="components/home/ModelCard.tsx" description="Нүүр хуудасны загварын карт.">
                  <div className="max-w-[320px]">
                    {featuredModel && <ModelCard model={featuredModel} />}
                  </div>
                </Demo>
                <Demo name="TrimCard" file="components/model/TrimCard.tsx" description="featured үед accent tone болон badge.">
                  <div className="max-w-[360px]">
                    <TrimCard trim={model3.trims.items[2]} orderHref="/order/model-3" />
                  </div>
                </Demo>
              </div>

              <div className="grid gap-[18px] lg:grid-cols-2">
                <Demo name="FeatureItem · IconBadge" file="components/model/FeatureGrid.tsx" description="FeatureGrid-ийн нэг нүд.">
                  <FeatureItem feature={model3.highlights.items[1]} />
                </Demo>
                <Demo name="CheckList" file="components/model/FeatureGrid.tsx" description="Icon + тод гарчиг + тайлбар.">
                  <CheckList items={model3.app.items.slice(0, 3)} />
                </Demo>
              </div>

              <Demo
                name="LoanBox"
                file="components/home/LoanBox.tsx"
                description="Common Region: зээлийн бүх мэдээлэл (хүү, түрээс, банк, товч) нэг хүрээтэй хайрцагт. Өгөгдөл нь Supabase-ийн loan_rate, lease_from."
              >
                <LoanBox loan={featuredModel?.loan ?? { rate: "1.99%", leaseFrom: "$439" }} />
              </Demo>

              <Demo name="SpecTable" file="components/model/SpecTable.tsx" description="Бүлэглэсэн үзүүлэлт, утсан дээр хажуу тийш гүйнэ.">
                <SpecTable columns={model3.specs.columns} groups={model3.specs.groups.slice(0, 1)} />
              </Demo>
            </div>
          </SgSection>

          {/* 11 Sections */}
          <SgSection
            id="sections"
            index={sectionIndex("sections")}
            title={sectionLabel("sections")}
            intro="Хуудсуудыг бүрдүүлэгч том хэсгүүд. Нэр дээр дарж сайт дээр нь шууд харна."
          >
            <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
              {pageSections.map((s) => (
                <Link key={s.name} href={s.href} className="group">
                  <GlassCard interactive className="h-full p-6">
                    <div className="relative flex items-center justify-between gap-3">
                      <p className="text-[17px] font-semibold">{s.name}</p>
                      <span className="text-muted transition-[translate,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">↗</span>
                    </div>
                    <p className="relative mt-2 text-[13px] text-muted">{s.note}</p>
                    <Code className="relative mt-3 inline-block text-[11px] text-muted-2">{s.file}</Code>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </SgSection>

          {/* 12 Motion */}
          <SgSection
            id="motion"
            index={sectionIndex("motion")}
            title={sectionLabel("motion")}
            intro={
              <>
                Easing: <Code>ease-soft</Code> = <Code>cubic-bezier(.22, .7, .2, 1)</Code>. <Code>prefers-reduced-motion</Code> асаалттай үед reveal шууд
                харагдаж, Lenis болон slider-ийн transition унтарна.
              </>
            }
          >
            <div className="mb-10 grid gap-[18px] sm:grid-cols-2">
              <Demo name="Reveal · rise" file="variant=&quot;rise&quot;">
                <MotionReplay variant="rise">
                  <span className="rounded-full bg-linear-to-b from-accent to-accent-2 px-5 py-2.5 font-semibold text-accent-ink">Model 3</span>
                </MotionReplay>
              </Demo>
              <Demo name="Reveal · grow" file="variant=&quot;grow&quot;">
                <MotionReplay variant="grow">
                  <span className="rounded-full bg-linear-to-b from-accent to-accent-2 px-5 py-2.5 font-semibold text-accent-ink">Model 3</span>
                </MotionReplay>
              </Demo>
            </div>

            <div className="overflow-x-auto rounded-card border border-line">
              <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
                <thead className="bg-glass-2 text-ink">
                  <tr>
                    {["Хөдөлгөөн", "Үүсгэгч", "Тохиргоо", "Reduced motion", "Файл"].map((h) => (
                      <th key={h} scope="col" className="border-b border-line px-5 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-muted [&_tr:last-child>*]:border-b-0">
                  {motions.map((m) => (
                    <tr key={m.slug} className="align-top">
                      <th scope="row" className="border-b border-line px-5 py-3.5 font-medium text-ink">
                        {m.name}
                        <span className="mt-1 block font-mono text-[11px] font-normal text-muted-2">{m.slug}</span>
                      </th>
                      <td className="border-b border-line px-5 py-3.5">{m.trigger}</td>
                      <td className="border-b border-line px-5 py-3.5">{m.spec}</td>
                      <td className="border-b border-line px-5 py-3.5">{m.reduced}</td>
                      <td className="border-b border-line px-5 py-3.5 font-mono text-[11px] text-muted-2">{m.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SgSection>
        </div>
      </div>
    </div>
  );
}
