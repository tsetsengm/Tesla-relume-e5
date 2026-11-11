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

## Supabase

Нүүр хуудасны загварын карт, showcase-ийн мэдээлэл Supabase-ийн `models` хүснэгтээс ирнэ
(төсөл: *tsetsengm's test tesla*). Өгөгдөл татах код: `lib/models.ts` (`getModels`).

`.env.local` (git-д ордоггүй) болон Vercel → Settings → Environment Variables-д:

```
SUPABASE_URL=https://iiryufozcwslwneebiyl.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- Засах: Supabase dashboard → Table Editor → `models`. Сайт ~1 минутын дотор шинэчлэгдэнэ (`cacheLife("minutes")`).
- Нуух: `is_published`-ийг `false` болгоно. Дараалал: `sort_order`.
- Вэбсайт зөвхөн уншина; Row Level Security бичихийг хориглодог.

### Админ хэсэг — `/admin`

- `/admin/login` → Supabase Auth-д бүртгэлтэй, `public.admins` хүснэгтэд байгаа хэрэглэгчээр нэвтэрнэ.
- Загварын карт бүрийг засаж хадгалахад нүүр хуудас шууд шинэчлэгдэнэ (`updateTag("models")`).
- Шинэ админ нэмэх: Supabase → Authentication-д хэрэглэгч үүсгээд SQL Editor-д
  `insert into public.admins (user_id) select id from auth.users where email = '...';`
- Эрх: `models` дээр зөвхөн админ `update` хийнэ (RLS). Шинэ загвар нэмэх, устгахыг одоогоор dashboard-оос хийнэ.
- Код: `app/admin/`, `components/admin/`, `lib/auth.ts`, `lib/supabase-server.ts`; session-ийг `proxy.ts` сэргээнэ.
- Хүснэгтийн бүтэц өөрчлөгдвөл `types/supabase.ts`-ийг дахин үүсгэнэ.

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
  nav.ts, banks.ts, models.ts   Цэс, банк, Model төрөл (загварын өгөгдөл Supabase-д)
  model-details/                Загвар бүрийн дэлгэрэнгүй контент
proxy.ts                        Байхгүй загварын slug-д 404 буцаана
public/assets/                  Figma-аас татсан зураг, icon
legacy/                         Хуучин HTML/CSS/JS хувилбар (харьцуулахад)
```

## Шинэ загварын хуудас нэмэх

1. `data/model-details/model-y.ts` үүсгэж `ModelDetail` төрлөөр контентоо бичнэ.
2. `data/model-details/slugs.ts` дахь `modelSlugs`-д `"model-y"` нэмнэ.
3. `data/model-details/index.ts` дахь `details`-д бүртгэнэ.
4. Supabase-ийн `models` хүснэгтэд Model Y-ийн `detail_href`-ийг `/models/model-y` болгоно.
