"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, WhatsAppIcon } from "./Icons";

type Props = {
  url: string;
  mensagem: string;
};

/** Link filtrado é o entregável desta peça — copiar e mandar no WhatsApp compartilham a URL do momento. */
export function ShareBar({ url, mensagem }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Clipboard indisponível (contexto não seguro, permissão negada) — o link continua na barra de endereço.
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${mensagem} ${url}`)}`;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={copiar}
        className="inline-flex items-center gap-2 rounded-control bg-clay-surface px-4 py-2.5 text-body-sm font-medium text-clay-surface-ink shadow-clay transition-[box-shadow,transform] duration-150 active:shadow-clay-active active:translate-y-px"
      >
        {copiado ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        {copiado ? "Link copiado" : "Copiar link"}
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-control bg-clay-primary px-4 py-2.5 text-body-sm font-medium text-clay-primary-ink shadow-clay transition-[box-shadow,transform] duration-150 active:shadow-clay-active active:translate-y-px"
      >
        <WhatsAppIcon size={18} />
        Mandar no WhatsApp
      </a>
    </div>
  );
}
