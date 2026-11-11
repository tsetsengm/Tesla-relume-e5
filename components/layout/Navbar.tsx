"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { mainNav } from "@/data/nav";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/55 backdrop-blur-[16px]">
      <div className="mx-auto flex h-[72px] max-w-[calc(var(--container-site)+8rem)] items-center justify-between px-4 sm:px-8 lg:px-16">
        <Link href="/" className="flex h-9 shrink-0 items-center" aria-label="Нүүр хуудас" onClick={close}>
          <Image src="/assets/icons/tesla-wordmark.svg" width={140} height={14} alt="Tesla" unoptimized priority />
        </Link>

        <button
          type="button"
          className="flex size-11 flex-col justify-center gap-[5px] p-2.5 lg:hidden"
          aria-label={open ? "Цэс хаах" : "Цэс нээх"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn("block h-0.5 bg-ink transition-transform", open && "translate-y-[7px] rotate-45")} />
          <span className={cn("block h-0.5 bg-ink transition-opacity", open && "opacity-0")} />
          <span className={cn("block h-0.5 bg-ink transition-transform", open && "-translate-y-[7px] -rotate-45")} />
        </button>

        <div
          id="nav-menu"
          className={cn(
            "items-center gap-6 lg:flex",
            // Mobile: dropdown panel under the bar
            "max-lg:absolute max-lg:inset-x-0 max-lg:top-[72px] max-lg:flex-col max-lg:items-start max-lg:border-b max-lg:border-line max-lg:bg-bg/92 max-lg:px-4 max-lg:pt-4 max-lg:pb-8 max-lg:backdrop-blur-[16px] sm:max-lg:px-8",
            open ? "flex" : "hidden",
          )}
        >
          <nav aria-label="Үндсэн цэс" className="flex items-center gap-5 max-lg:flex-col max-lg:items-start max-lg:gap-4 xl:gap-[30px]">
            {/* usePathname needs a Suspense boundary under Cache Components */}
            <Suspense fallback={<NavLinks onNavigate={close} />}>
              <ActiveNavLinks onNavigate={close} />
            </Suspense>
          </nav>
          <div className="flex gap-3">
            <Button href="#contact" variant="secondary" size="sm">
              Холбоо барих
            </Button>
            <Button href="#contact" size="sm">
              Test drive
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function ActiveNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} onNavigate={onNavigate} />;
}

function NavLinks({ pathname, onNavigate }: { pathname?: string; onNavigate: () => void }) {
  return mainNav.map((link) => {
    const current = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        aria-current={current ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-0.5 whitespace-nowrap text-[14.5px] transition-colors hover:text-ink max-lg:text-base",
          current ? "text-ink" : "text-muted",
        )}
      >
        {link.label}
        {link.dropdown && (
          <Image src="/assets/icons/chevron-down.svg" width={20} height={20} alt="" unoptimized className="opacity-70 invert" />
        )}
      </Link>
    );
  });
}
