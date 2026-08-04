"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site, whatsappHref } from "@/site.config";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

type IndicatorRect = { left: number; width: number };

/**
 * Barra grudada de ponta a ponta — único elemento com vidro fora do menu
 * mobile: fica sobre o conteúdo rolando, então tem algo atrás para borrar.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeIndex = site.nav.findIndex((item) => item.href === pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desliza o sublinhado ativo em vez de só trocar sem transição — mesma
  // técnica da S1/S2, adaptada a um traço embaixo pra não mudar o estilo
  // de "ativo" que esta peça já tinha escolhido.
  useLayoutEffect(() => {
    const medir = () => {
      const el = linkRefs.current[activeIndex];
      if (!el) {
        setIndicator(null);
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [activeIndex, pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-glass-border bg-glass-bg backdrop-blur-glass transition-shadow duration-200 ${
        scrolled ? "shadow-surface" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label={site.name}>
          <Logo compact />
        </Link>

        <nav aria-label="Principal" className="relative hidden items-center gap-1 md:flex">
          {indicator ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-clay-primary transition-[left,width] duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          ) : null}
          {site.nav.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={item.href}
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-control px-3 py-2 text-body-sm font-medium transition-colors ${
                  isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="hidden items-center gap-2 rounded-control bg-clay-primary px-4 py-2 text-body-sm font-medium text-clay-primary-ink shadow-clay transition-[box-shadow,transform] active:shadow-clay-active active:translate-y-px md:inline-flex"
        >
          <WhatsAppIcon size={18} />
          WhatsApp
        </a>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-control text-text-primary md:hidden"
          aria-expanded={open}
          aria-controls="menu-movel"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            id="menu-movel"
            aria-label="Menu móvel"
            inert={!open}
            className="flex flex-col gap-1 border-t border-glass-border px-4 py-3"
          >
            {site.nav.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-control px-3 py-3 text-body font-medium ${
                    isActive ? "bg-clay-primary text-clay-primary-ink" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2 rounded-control bg-clay-primary px-3 py-3 text-body font-medium text-clay-primary-ink"
            >
              <WhatsAppIcon size={18} />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
