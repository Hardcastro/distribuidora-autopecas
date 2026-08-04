import Link from "next/link";
import { site, whatsappHref } from "@/site.config";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-glass-solid-border bg-glass-solid-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark size={32} tone="surface" />
            <p className="text-lead font-medium text-text-primary">{site.name}</p>
          </div>
          <p className="mt-2 max-w-xs text-body-sm text-text-muted">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-2 text-body-sm text-text-muted">
          <span className="flex items-start gap-2">
            <PinIcon size={18} className="mt-0.5 shrink-0 text-text-secondary" />
            {site.endereco.logradouro} — {site.endereco.cidadeUf}
          </span>
          <a href={site.telefoneHref} className="flex items-center gap-2 hover:text-text-primary">
            <PhoneIcon size={18} className="shrink-0 text-text-secondary" />
            {site.telefone}
          </a>
          <span className="flex items-start gap-2">
            <ClockIcon size={18} className="mt-0.5 shrink-0 text-text-secondary" />
            <span>
              {site.horario.map((linha) => (
                <span key={linha.dias} className="block">
                  {linha.dias}: {linha.turno}
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className="flex flex-col items-start gap-3">
          <nav aria-label="Rodapé" className="flex flex-col gap-1 text-body-sm">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-text-muted hover:text-text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <WhatsAppIcon size={16} />
            Falar pelo WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-glass-solid-border px-4 py-4 text-center text-body-sm text-text-muted sm:px-6">
        Peça de portfólio fictícia — empresa e marcas de peça inventadas. Código no{" "}
        <a
          href="https://github.com/Hardcastro/distribuidora-autopecas"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-text-primary"
        >
          GitHub
        </a>
        .
      </div>
    </footer>
  );
}
