import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeroProps = {
  image: string;
  children: ReactNode;
  /** Compact: height follows content (home). Default: fills the viewport. */
  compact?: boolean;
  /** full: photo behind everything. right (lg+): photo moves right of the text — larger and brighter. */
  media?: "full" | "right";
  className?: string;
};

const mediaBox = {
  full: "opacity-55",
  right: "overflow-hidden opacity-55 lg:left-[36%] lg:opacity-90 lg:mask-[linear-gradient(90deg,transparent_0%,#000_30%)]",
};

/** Extra zoom toward the subject (lg+) */
const mediaZoom = {
  full: "",
  right: "lg:origin-[55%_62%] lg:scale-[1.22]",
};

/** Full-bleed photo backdrop that fades into the dark page, with left-aligned content. */
export function Hero({ image, children, compact = false, media = "full", className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden px-4 sm:px-8 lg:px-16",
        compact
          ? "py-16 sm:py-20 lg:py-28"
          : "min-h-0 pt-[120px] pb-40 sm:min-h-[calc(100vh-72px)] sm:py-20 lg:py-28",
        className,
      )}
    >
      <div className={cn("absolute inset-0", mediaBox[media])}>
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes={media === "right" ? "(min-width: 992px) 80vw, 100vw" : "100vw"}
          className={cn(
            "object-cover",
            mediaZoom[media],
            compact
              ? "mask-[linear-gradient(180deg,#000_60%,transparent_100%)]"
              : "mask-[linear-gradient(180deg,#000_35%,transparent_92%)]",
          )}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(125%_62%_at_50%_-10%,rgb(4_6_15/0.82)_0%,rgb(4_6_15/0.28)_44%,transparent_68%),linear-gradient(90deg,rgb(4_6_15/0.75)_0%,transparent_70%)]" />
      <div className="relative mx-auto w-full max-w-site">{children}</div>
    </section>
  );
}
