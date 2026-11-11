export type ShowcaseMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; poster: string; label: string };

export type Model = {
  slug: string;
  name: string;
  /** Detail page, when one exists */
  detailHref?: string;
  card: { image: string; alt: string; description: string };
  showcase: {
    media: ShowcaseMedia;
    paragraphs: string[];
    primaryAction: string;
  };
};

export const models: Model[] = [
  {
    slug: "model-3",
    name: "Model 3",
    detailHref: "/models/model-3",
    card: {
      image: "/assets/images/model-3.jpg",
      alt: "Tesla Model 3",
      description: "Model 3 нь спорт седан маягийн цахилгаан машин. Жилийн 1.99% хүүтэй зээлээр авах боломжтой",
    },
    showcase: {
      media: { type: "image", src: "/assets/images/feature-model-3.jpg", alt: "Tesla Model 3" },
      paragraphs: [
        "Model 3 нь Tesla-гийн спорт седан маягийн цахилгаан машин. Tesla-гийн хамгийн хямд загваруудын нэг бөгөөд хурдан, хэмнэлттэй.",
        "Tа сард $439-өөс эхлэн түрээслэх, эсвэл жилийн 1.99% хүүтэй зээлээр авах боломжтой.",
      ],
      primaryAction: "Зээл судлах",
    },
  },
  {
    slug: "model-y",
    name: "Model Y",
    card: {
      image: "/assets/images/model-y.jpg",
      alt: "Tesla Model Y",
      description: "SUV цахилгаан машин. Ачаа тээш, зорчигчдод илүү зайтай тул гэр бүлд тохиромжтой.",
    },
    showcase: {
      media: { type: "video", poster: "/assets/images/lightbox.png", label: "Model Y видео тоглуулах" },
      paragraphs: [
        "Model Y нь Tesla-гийн дунд оврын SUV цахилгаан машин. Model 3-аас илүү өндөр, ачаа тээш, зорчигчдод илүү зайтай тул гэр бүлд тохиромжтой.",
        "Tа сард $499-өөс эхлэн түрээслэх, эсвэл жилийн 2.49% хүүтэй зээлээр авах боломжтой. Мөн урт тэнхлэгтэй, илүү том Model Y L Premium хувилбар $61,990-аас эхэлдэг.",
      ],
      primaryAction: "Зээл судлах",
    },
  },
  {
    slug: "cybertruck",
    name: "Cybertruck",
    card: {
      image: "/assets/images/cybertruck.jpg",
      alt: "Tesla Cybertruck",
      description: "Зэвэрдэггүй гангаар хийсэн футурист дизайнтай, бат бөх бөгөөд замгүй газар явахад зориулагдсан.",
    },
    showcase: {
      media: { type: "image", src: "/assets/images/feature-cybertruck.jpg", alt: "Tesla Cybertruck" },
      paragraphs: [
        "Cybertruck нь Tesla-гийн цахилгаан пикап буюу ачааны машин. Зэвэрдэггүй гангаар хийсэн хурц өнцөгтэй футурист дизайнтай, бат бөх бөгөөд замгүй газар явахад зориулагдсан.",
        "Tа сард $1,129-өөс эхлэн түрээслэх боломжтой.",
      ],
      primaryAction: "Зээл судлах",
    },
  },
  {
    slug: "roadster",
    name: "Roadster",
    card: {
      image: "/assets/images/roadster.jpg",
      alt: "Tesla Roadster",
      description: "Цахилгаан спорт машин. Маш хурдан хурдатгалтай, хоёр хаалгатай, задгай дээвэртэй загвар юм.",
    },
    showcase: {
      media: { type: "video", poster: "/assets/images/lightbox.png", label: "Roadster видео тоглуулах" },
      paragraphs: [
        "Roadster нь Tesla-гийн цахилгаан спорт машин. Маш хурдан хурдатгалтай, хоёр хаалгатай, задгай дээвэртэй загвар юм.",
        "Tesla Roadster-н “Reserve Now” буюу урьдчилан захиалах боломжтой. Тиймээс одоогоор худалдаанд гараагүй, захиалга авч байгаа шатандаа байна.",
      ],
      primaryAction: "Урьдчилан захиалга",
    },
  },
];

export const robotaxiSlides = [
  { src: "/assets/images/hero.jpg", alt: "Robotaxi зураг 1" },
  { src: "/assets/images/gallery-2.jpg", alt: "Robotaxi зураг 2" },
  { src: "/assets/images/gallery-3.jpg", alt: "Robotaxi зураг 3" },
];
