"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, whatsappHref } from "@/site.config";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

/**
 * Barra grudada de ponta a ponta — único elemento com vidro fora do menu
 * mobile: fica sobre o conteúdo rolando, então tem algo atrás para borrar.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => {
            const isActive = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-control px-3 py-2 text-body-sm font-medium transition-colors ${
                  isActive
                    ? "text-text-primary underline decoration-clay-primary decoration-2 underline-offset-4"
                    : "text-text-muted hover:text-text-primary"
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
