/** Content for /styleguide. Token values themselves are read live from app/globals.css. */

export const sgSections = [
  { id: "principles", label: "Зарчим" },
  { id: "brand", label: "Брэнд" },
  { id: "color", label: "Өнгө" },
  { id: "type", label: "Үсэг" },
  { id: "spacing", label: "Зай" },
  { id: "shape", label: "Хэлбэр" },
  { id: "stroke", label: "Шугам" },
  { id: "shade", label: "Сүүдэр, бүрхүүл" },
  { id: "icons", label: "Дүрс" },
  { id: "components", label: "Компонент" },
  { id: "sections", label: "Хэсгүүд" },
  { id: "motion", label: "Хөдөлгөөн" },
] as const;

export const principles = [
  { title: "Харанхуй, нам гүм дэвсгэр", text: "Хуудас бүр гүн хөх-хар --color-bg дээр. Машины зураг гэрэл, бичвэр тод харагдана." },
  { title: "Шилэн гадаргуу", text: "Карт, самбар бүр тунгалаг glass + backdrop blur + 1px hairline. Цул саарал хайрцаг хэрэглэхгүй." },
  { title: "Ногоон зөвхөн үйлдэлд", text: "--color-accent нь товч, tagline, идэвхтэй төлөвт л. Чимэглэлд ногоон хэрэглэхгүй." },
  { title: "Тайван хөдөлгөөн", text: "700ms ease-soft reveal, Lenis зөөлөн scroll. prefers-reduced-motion үед бүгд зогсоно." },
];

export type ColorToken = { name: string; usage: string };

export const colorGroups: { title: string; tokens: ColorToken[] }[] = [
  {
    title: "Гадаргуу",
    tokens: [
      { name: "bg", usage: "Хуудасны дэвсгэр, navbar (55%)" },
      { name: "glass", usage: "Карт · blur 14px" },
      { name: "glass-2", usage: "Том самбар, hover, хүснэгтийн толгой" },
    ],
  },
  {
    title: "Бичвэр",
    tokens: [
      { name: "ink", usage: "Гарчиг, үндсэн бичвэр" },
      { name: "muted", usage: "Тайлбар, lead, nav холбоос" },
      { name: "muted-2", usage: "Footnote, label, placeholder" },
    ],
  },
  {
    title: "Шугам",
    tokens: [
      { name: "line", usage: "Hairline, картын хүрээ" },
      { name: "line-strong", usage: "Самбар, secondary товч, input" },
    ],
  },
  {
    title: "Үйлдэл",
    tokens: [
      { name: "accent", usage: "Товч, tagline, идэвхтэй цэг" },
      { name: "accent-2", usage: "Товчны градиентын доод өнгө" },
      { name: "accent-ink", usage: "Ногоон товч дээрх бичвэр" },
    ],
  },
];

/** Text styles shown in the type specimen. `className` must match what the site uses. */
export const typeStyles = [
  { name: ".display", usage: "Загварын hero (ModelHero)", sample: "Model 3", className: "display" },
  { name: ".heading-1", usage: "Нүүр хуудасны hero", sample: "Албан ёсны дистрибютер", className: "heading-1" },
  { name: ".heading-2", usage: "Хэсгийн гарчиг, showcase", sample: "Өөрт тохирох Model 3-аа сонго", className: "heading-2" },
  { name: ".heading-5", usage: "Картын гарчиг", sample: "Model 3 Performance", className: "heading-5" },
  { name: ".text-gradient", usage: "Hero статистик", sample: "584 км", className: "text-gradient text-[clamp(28px,3.2vw,40px)] font-extrabold tracking-[-0.02em]" },
  { name: ".lead", usage: "Гарчгийн доорх тайлбар", sample: "Хэмнэлттэйгээс эхлээд хамгийн хүчирхэг хүртэл — гурван хувилбар.", className: "lead" },
  { name: "body", usage: "Showcase бичвэр", sample: "Model 3 нь Tesla-гийн спорт седан маягийн цахилгаан машин.", className: "text-[17px] leading-[1.65] text-muted" },
  { name: "card text", usage: "Карт доторх бичвэр", sample: "Цэнэглэх нь шатахуун хийхээс ихэвчлэн хямд.", className: "text-[15px] leading-[1.6] text-muted" },
  { name: ".tagline", usage: "Гарчгийн дээрх label", sample: "Спорт седан", className: "tagline" },
  { name: "label", usage: "Footer баганын гарчиг", sample: "Загварууд", className: "text-xs font-semibold uppercase tracking-[0.14em] text-muted-2" },
  { name: "footnote", usage: "Эх сурвалж, тайлбар", sample: "Үнэд хүргэлт, татвар ороогүй.", className: "text-[13px] leading-[1.6] text-muted-2" },
];

export const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 80, 112];

export const layoutTokens = [
  { name: "Хажуугийн зай", value: "16 / 32 / 64px", note: "px-4 sm:px-8 lg:px-16" },
  { name: "Container", value: "1280px", note: "max-w-site (--container-site)" },
  { name: "Navbar өндөр", value: "72px", note: "h-[72px], scroll-margin-top" },
  { name: "Хэсгийн зай", value: "64 / 80 / 112px", note: "<Section>" },
  { name: "Нүүр хуудасны хэсэг", value: "32 / 40 / 56px", note: "<Section compact>" },
  { name: "Торны завсар", value: "18px", note: "gap-[18px]" },
];

export const breakpoints = [
  { name: "sm", value: "601px", note: "2 багана, том gutter" },
  { name: "lg", value: "992px", note: "Desktop navbar, split самбар" },
  { name: "xl", value: "1101px", note: "4 баганатай загварын карт" },
];

export const radii = [
  { name: "rounded-xl", value: "12px", usage: "Зураг, chip, icon badge", className: "rounded-xl" },
  { name: "rounded-card", value: "18px", usage: "GlassCard", className: "rounded-card" },
  { name: "rounded-panel", value: "26px", usage: "Showcase, CTA, slider", className: "rounded-panel" },
  { name: "rounded-full", value: "9999px", usage: "Товч, badge, input, цэг", className: "rounded-full" },
];

export const motions = [
  { name: "Reveal · rise", slug: "reveal-rise", trigger: "Scroll", where: "components/ui/Reveal.tsx", spec: "opacity 0 → 1, translateY 26px → 0 · 700ms ease-soft · stagger 80–90ms", reduced: "Шууд харагдана" },
  { name: "Reveal · grow", slug: "reveal-grow", trigger: "Scroll (нүүр хуудас)", where: "components/ui/Reveal.tsx", spec: "opacity 0 → 1, translateY 48px + scale .94 → 1 · 700ms ease-soft", reduced: "Шууд харагдана" },
  { name: "Card lift", slug: "card-lift", trigger: "Hover", where: "components/ui/GlassCard.tsx", spec: "translateY -4px, border → line-strong, bg → glass-2 · 200ms", reduced: "Хэвээр" },
  { name: "Button lift", slug: "button-lift", trigger: "Hover", where: "components/ui/Button.tsx", spec: "translateY -2px + shadow-glow-lg · 200ms", reduced: "Хэвээр" },
  { name: "Chevron nudge", slug: "chevron-nudge", trigger: "Hover", where: "components/ui/Button.tsx", spec: "Сум translateX 3px · 200ms", reduced: "Хэвээр" },
  { name: "Image zoom", slug: "image-zoom", trigger: "Hover", where: "components/ui/FeatureShowcase.tsx", spec: "scale 1 → 1.04 · 1200ms ease-soft", reduced: "Хэвээр" },
  { name: "Slider", slug: "slider", trigger: "Дарах", where: "components/home/RobotaxiSlider.tsx", spec: "translateX · 600ms ease-soft; идэвхтэй цэг 8 → 24px · 300ms", reduced: "Шууд солигдоно" },
  { name: "Smooth scroll", slug: "smooth-scroll", trigger: "Wheel, # холбоос", where: "components/providers/SmoothScroll.tsx", spec: "Lenis duration 1.15s, anchor offset -72px", reduced: "Унтарна, native scroll" },
  { name: "Mobile menu", slug: "mobile-menu", trigger: "Дарах (<992px)", where: "components/layout/Navbar.tsx", spec: "Hamburger → X (rotate 45°), цэс display toggle", reduced: "Хэвээр" },
];

export const pageSections = [
  { name: "Navbar", file: "components/layout/Navbar.tsx", href: "/", note: "Sticky, glass blur, утсан дээр унждаг цэс" },
  { name: "Hero", file: "components/ui/Hero.tsx", href: "/", note: "compact (нүүр) эсвэл бүтэн өндөр (загвар)" },
  { name: "ModelCard grid", file: "components/home/ModelCard.tsx", href: "/#models", note: "4 → 2 → 1 багана" },
  { name: "BankStrip", file: "components/home/BankLogos.tsx", href: "/", note: "Ногоон зээлийн банкууд" },
  { name: "FeatureShowcase", file: "components/ui/FeatureShowcase.tsx", href: "/#model-3", note: "Зураг/видео + бичвэр, reverse" },
  { name: "RobotaxiSlider", file: "components/home/RobotaxiSlider.tsx", href: "/#robotaxi", note: "Сум, цэг, wrap-around" },
  { name: "ModelHero", file: "components/model/ModelHero.tsx", href: "/models/model-3", note: "Display гарчиг + 3 статистик" },
  { name: "TrimCard grid", file: "components/model/TrimCard.tsx", href: "/models/model-3#trims", note: "Featured хувилбар accent tone-той" },
  { name: "FeatureGrid", file: "components/model/FeatureGrid.tsx", href: "/models/model-3", note: "Icon карт, 3 → 2 → 1 багана" },
  { name: "SpecTable", file: "components/model/SpecTable.tsx", href: "/models/model-3#specs", note: "Бүлэглэсэн харьцуулалт" },
  { name: "CtaCard", file: "components/model/CtaCard.tsx", href: "/models/model-3", note: "Хуудасны төгсгөлийн урилга" },
  { name: "Footer", file: "components/layout/Footer.tsx", href: "/#contact", note: "Newsletter, холбоос, social" },
];
