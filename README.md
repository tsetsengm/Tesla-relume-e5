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
- `/admin` — бүх загварын жагсаалт: хайлт, шүүлтүүр (Бүгд / Харагдаж буй / Нуусан), нүд дарж шууд нуух/харуулах.
- `/admin/models/<slug>` — нэг загвар засах: картын урьдчилсан харагдац, ⌘S хадгалах, өмнөх/дараах загвар руу шилжих,
  хадгалаагүй өөрчлөлттэй гарахад анхааруулна.
- Зураг: чирж оруулах эсвэл дарж сонгоно (JPG/PNG/WebP/AVIF, 5MB хүртэл) → Supabase Storage `model-images` bucket.
  Browser нь server-ийн өгсөн нэг удаагийн signed URL-аар шууд upload хийнэ (`createImageUpload`).
- "Зээл" панел: `loan_rate` (жишээ 1.99%), `lease_from` (жишээ $439) → showcase доторх "Ногоон зээл" хайрцаг. Хоёулаа хоосон бол хайрцаг нуугдана.
- Хадгалахад нүүр хуудас шууд шинэчлэгдэнэ (`updateTag("models")`).

### Byl төлбөр — "Одоо захиалах"

Бүх "Одоо захиалах" товч (карт, showcase, Model 3-ын trim карт `?trim=…`) захиалгын хуудас `/order/<slug>` руу орно:
01 нэр, утас, имэйл → 02 хувилбар (model-details-д trim байвал) → 03 төлбөр.
Загварт `deposit_amount` (урьдчилгаа, ₮) байвал "Byl-ээр төлөх" → byl.mn; хоосон бол "Захиалга илгээх" (төлбөргүй хүсэлт, status `request`).
Урьдчилгааг: Админ → загвар → "Зээл" панел → "Захиалгын урьдчилгаа".

```
Захиалгын хуудас → placeOrder (app/order/actions.ts): orders-д pending мөр (нэр, утас, хувилбар) → POST /v1/projects/:id/checkouts → byl.mn руу redirect
Byl → POST /api/byl/webhook (checkout.completed, Byl-Signature HMAC-SHA256) → orders.status = paid
Byl → /order/success?ref=<order id> (webhook ирээгүй бол Byl-ээс checkout-ийг шууд шалгана)
```

- Дүнг үргэлж DB-ээс авна, form-оос хэзээ ч авахгүй. Захиалгууд: `/admin/orders` (нэр, утас, имэйл, төлөв).
- `orders` хүснэгтэд RLS: зөвхөн админ уншина; бичихийг зөвхөн server `SUPABASE_SECRET_KEY`-ээр хийнэ.
- Env (`.env.local` + Vercel, бүгд server-only):
  - `BYL_PROJECT_ID`, `BYL_TOKEN` — Byl → төсөл → Тохиргоо → API токэн
  - `BYL_WEBHOOK_SECRET` — Byl → Webhooks → endpoint `https://<домэйн>/api/byl/webhook` → Signing secret
  - `SUPABASE_SECRET_KEY` — Supabase → Settings → API Keys → Secret key
- Test горимд гүйлгээ бүр 100₮. Бодит төлбөр: бизнес баталгаажуулалт + Byl багц + төслийн данс → Live горим.
- Webhook `localhost` руу ирэхгүй — локалд success хуудас Byl-ээс төлөвийг өөрөө шалгана.
- Код: `app/order/[slug]/page.tsx`, `components/order/OrderForm.tsx`, `lib/byl.ts`, `lib/orders.ts`, `lib/supabase-admin.ts`.

### Дизайны дүрэм (Gestalt)

- **Similarity:** хэсэг/карт бүрт нэг ногоон (primary) товч; хоёрдогч нь `secondary`; `›` = өөр хуудас, `↓` = доорх хэсэг.
- **Common Region · Proximity:** зээлийн мэдээлэл `LoanBox`-д; банкны лого зөвхөн `BankStrip`-д.
- **Uniform Connectedness:** нүүрт `ModelStepper`, загварын хуудсанд `SectionNav` (scroll-spy: `lib/useActiveSection.ts`).
- Sticky дэд цэстэй хэсгүүдэд `scroll-mt-[132–136px]` — Lenis `scroll-margin-top`-ийг өөрөө тооцдог.
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
