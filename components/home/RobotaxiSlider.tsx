"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Slide = { src: string; alt: string };

const arrowClass =
  "absolute top-[calc(50%-30px)] flex -translate-y-1/2 rounded-full border border-line-strong bg-glass-2 p-3 backdrop-blur-[12px] transition-colors hover:border-accent/50 hover:bg-accent/12 max-sm:hidden";

export function RobotaxiSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <div className="relative flex w-full flex-col gap-9">
      <div className="overflow-hidden">
        <div
          className="flex gap-8 transition-transform duration-[600ms] ease-soft motion-reduce:transition-none"
          style={{ transform: `translateX(calc(${-index * 100}% - ${index * 32}px))` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.src} className="flex flex-[0_0_100%] justify-center" aria-hidden={i !== index}>
              <div className="relative aspect-[1088/726] w-[85%] overflow-hidden rounded-panel border border-line-strong shadow-panel max-sm:w-full">
                <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 600px) 100vw, 1088px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" aria-label="Өмнөх зураг" className={cn(arrowClass, "left-0")} onClick={() => goTo(index - 1)}>
        <Image src="/assets/icons/arrow-back.svg" width={24} height={24} alt="" unoptimized className="invert" />
      </button>
      <button type="button" aria-label="Дараагийн зураг" className={cn(arrowClass, "right-0")} onClick={() => goTo(index + 1)}>
        <Image src="/assets/icons/arrow-forward.svg" width={24} height={24} alt="" unoptimized className="invert" />
      </button>

      <div className="flex justify-center gap-[9px]">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`${i + 1}-р зураг`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-[width,opacity,background-color] duration-300 ease-soft",
              i === index ? "w-6 bg-accent opacity-100 shadow-[0_0_10px_var(--color-accent)]" : "w-2 bg-ink opacity-25",
            )}
          />
        ))}
      </div>
    </div>
  );
}
