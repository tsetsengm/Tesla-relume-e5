# Tesla — Албан ёсны дистрибютер

Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript.

## Ажиллуулах

Node.js 20.9+ (LTS) хэрэгтэй.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Бүтэц

```
app/
  layout.tsx              Navbar, Footer, Lenis, Inter фонт
  page.tsx                Нүүр хуудас
  models/[slug]/page.tsx  Загварын танилцуулга (/models/model-3)
  not-found.tsx           404
  globals.css             Tailwind @theme — өнгө, radius, сүүдэр, breakpoint
components/
  layout/     Navbar, Footer, NewsletterForm
  ui/         Button, GlassCard, Reveal, Section, SectionHeading, Hero, FeatureShowcase
  home/       ModelCard, BankStrip / BankChips, RobotaxiSlider
  model/      ModelHero, TrimCard, FeatureGrid, SpecTable, CtaCard
  providers/  SmoothScroll (Lenis)
data/
  nav.ts, banks.ts, models.ts   Нүүр хуудасны контент
  model-details/                Загвар бүрийн дэлгэрэнгүй контент
proxy.ts                        Байхгүй загварын slug-д 404 буцаана
public/assets/                  Figma-аас татсан зураг, icon
legacy/                         Хуучин HTML/CSS/JS хувилбар (харьцуулахад)
```

## Шинэ загварын хуудас нэмэх

1. `data/model-details/model-y.ts` үүсгэж `ModelDetail` төрлөөр контентоо бичнэ.
2. `data/model-details/slugs.ts` дахь `modelSlugs`-д `"model-y"` нэмнэ.
3. `data/model-details/index.ts` дахь `details`-д бүртгэнэ.
4. `data/models.ts` дотор Model Y-д `detailHref: "/models/model-y"` нэмнэ.
