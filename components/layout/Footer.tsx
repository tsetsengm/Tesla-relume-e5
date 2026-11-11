import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { footerColumns, legalLinks, socialLinks } from "@/data/nav";
import { NewsletterForm } from "./NewsletterForm";

const linkClass = "flex items-center gap-3 py-1.5 text-muted transition-colors hover:text-ink";
const headingClass = "text-xs font-semibold uppercase tracking-[0.14em] text-muted-2";

export function Footer() {
  return (
    <footer id="contact" className="relative px-4 pt-16 pb-12 sm:px-8 lg:px-16 lg:pt-20">
      <div className="mx-auto flex w-full max-w-site flex-col gap-16 border-t border-line pt-12">
        <div className="flex gap-32 max-xl:flex-col max-xl:gap-12">
          <Reveal className="flex w-[500px] shrink-0 flex-col items-start gap-5 text-muted max-xl:w-full max-xl:max-w-[500px]">
            <Link href="/" className="flex h-9 items-center" aria-label="Нүүр хуудас">
              <Image src="/assets/icons/tesla-wordmark.svg" width={140} height={14} alt="Tesla" unoptimized />
            </Link>
            <p>Бидэнтэй хамт байгаарай</p>
            <NewsletterForm />
          </Reveal>

          <div className="flex flex-1 gap-10 max-sm:flex-wrap">
            {footerColumns.map((col, i) => (
              <Reveal key={col.title} delay={(i + 1) * 80} className="flex flex-1 flex-col gap-3.5 text-[14.5px] max-sm:basis-[140px]">
                <h4 className={headingClass}>{col.title}</h4>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}

            <Reveal delay={240} className="flex flex-1 flex-col gap-3.5 text-[14.5px] max-sm:basis-[140px]">
              <h4 className={headingClass}>Follow us</h4>
              <ul>
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className={linkClass}>
                      <Image src={s.icon} width={20} height={20} alt="" unoptimized className="opacity-75 invert" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="flex justify-between gap-6 text-[13px] text-muted-2 max-sm:flex-col-reverse">
          <p>© 2025. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.href} className="underline underline-offset-[3px] transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
