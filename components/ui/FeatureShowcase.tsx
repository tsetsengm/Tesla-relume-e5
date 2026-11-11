import Image from "next/image";
import type { ReactNode } from "react";
import type { ShowcaseMedia } from "@/data/models";
import { cn } from "@/lib/cn";

type FeatureShowcaseProps = {
  media: ShowcaseMedia;
  title: string;
  tagline?: string;
  paragraphs: string[];
  /** Media on the right instead of the left */
  reverse?: boolean;
  /** Extra content under the text: logos, actions, checklists… */
  children?: ReactNode;
};

/** Large split panel: photo or video poster on one side, copy on the other. */
export function FeatureShowcase({ media, title, tagline, paragraphs, reverse = false, children }: FeatureShowcaseProps) {
  return (
    <article
      className={cn(
        "group hairline relative flex h-[640px] overflow-hidden rounded-panel border border-line-strong bg-glass-2 shadow-panel backdrop-blur-[18px]",
        "max-lg:h-auto max-lg:flex-col",
        reverse && "flex-row-reverse [--hairline-angle:200deg]",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 basis-1/2 overflow-hidden max-lg:aspect-[4/3] max-lg:basis-auto",
          media.type === "video" && "rounded-panel",
        )}
      >
        {media.type === "image" ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 991px) 100vw, 640px"
            className="object-cover transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <Image src={media.poster} alt="" fill sizes="(max-width: 991px) 100vw, 640px" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-bg/62" />
            <button
              type="button"
              aria-label={media.label}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[scale,filter] duration-200 hover:scale-[1.08] hover:drop-shadow-[0_0_18px_rgb(93_240_168/0.6)]"
            >
              <Image src="/assets/icons/play.svg" width={64} height={64} alt="" unoptimized />
            </button>
          </>
        )}
      </div>

      <div className="flex shrink-0 basis-1/2 flex-col justify-center gap-8 p-14 max-lg:basis-auto max-lg:p-10 max-sm:px-[22px] max-sm:py-7">
        <div className="flex flex-col text-[17px] leading-[1.65] text-muted">
          {tagline && <p className="tagline mb-3.5">{tagline}</p>}
          <h2 className="heading-2 mb-[22px] text-ink">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className={cn(i > 0 && "mt-[18px]")}>
              {p}
            </p>
          ))}
        </div>
        {children}
      </div>
    </article>
  );
}
