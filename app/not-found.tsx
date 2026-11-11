import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-6 py-16 text-center">
        <span className="tagline">404</span>
        <h1 className="heading-2">Хуудас олдсонгүй</h1>
        <p className="text-lg leading-[1.65] text-muted">Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.</p>
        <Button href="/" icon="arrow">
          Нүүр хуудас руу буцах
        </Button>
      </div>
    </Section>
  );
}
