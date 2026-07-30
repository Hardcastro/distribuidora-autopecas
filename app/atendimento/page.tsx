import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappHref } from "@/site.config";
import { SolidPanel, ClayButton } from "@/components/base/primitives";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/base/Icons";

export const metadata: Metadata = pageMetadata({
  title: "Atendimento",
  description: "Balcão, horário, entrega e como pedir peça na Anhanguera Autopeças.",
  path: "/atendimento",
});

export default function AtendimentoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-h1 font-medium tracking-tight text-text-primary">Atendimento</h1>
      <p className="mt-3 max-w-2xl text-lead text-text-muted">
        Balcão de manhã, entrega de tarde. A maior parte do pedido de oficina chega por telefone ou WhatsApp —
        aqui vai o que a gente precisa saber pra separar a peça certa de primeira.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <SolidPanel radius="panel" className="p-6 sm:p-8">
          <h2 className="text-h3 font-medium tracking-tight text-text-primary">Como pedir</h2>
          <div className="mt-4 space-y-4 text-body text-text-muted">
            <p>
              Quem liga informa montadora, modelo, ano e motor do carro — os mesmos quatro dados do buscador do
              site. Com isso a gente já confirma se tem em estoque e o preço na hora.
            </p>
            <p>
              Se já tiver o código da peça (de uma nota anterior ou do próprio site), o pedido é mais rápido
              ainda: só confirma a disponibilidade e separa.
            </p>
            <p>
              Para quem prefere mandar por escrito, o WhatsApp aceita foto da peça antiga ou do chassi — ajuda
              quando o cliente não tem certeza da motorização exata.
            </p>
          </div>
        </SolidPanel>

        <SolidPanel radius="panel" className="p-6 sm:p-8">
          <h2 className="text-h3 font-medium tracking-tight text-text-primary">Entrega</h2>
          <div className="mt-4 space-y-4 text-body text-text-muted">
            <p>
              Pedido confirmado até o meio-dia sai para entrega na mesma tarde nas regiões de Osasco, Barueiro e
              zona oeste de São Paulo. Fora dessa área, o prazo é combinado na hora do pedido.
            </p>
            <p>Balcão físico atende sem hora marcada — quem preferir buscar, a peça fica separada em nome de quem ligou.</p>
          </div>
        </SolidPanel>
      </div>

      <SolidPanel radius="panel" className="mt-6 grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
        <div className="flex items-start gap-3">
          <PinIcon size={22} className="mt-0.5 shrink-0 text-text-secondary" />
          <div>
            <p className="text-body-sm font-medium uppercase tracking-wide text-text-muted">Endereço</p>
            <p className="mt-1 text-body text-text-primary">
              {site.endereco.logradouro}
              <br />
              {site.endereco.cidadeUf} — {site.endereco.cep}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ClockIcon size={22} className="mt-0.5 shrink-0 text-text-secondary" />
          <div>
            <p className="text-body-sm font-medium uppercase tracking-wide text-text-muted">Horário</p>
            {site.horario.map((linha) => (
              <p key={linha.dias} className="mt-1 text-body text-text-primary">
                {linha.dias}: {linha.turno}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <PhoneIcon size={22} className="mt-0.5 shrink-0 text-text-secondary" />
          <div>
            <p className="text-body-sm font-medium uppercase tracking-wide text-text-muted">Telefone</p>
            <a href={site.telefoneHref} className="mt-1 block text-body text-text-primary hover:text-text-secondary">
              {site.telefone}
            </a>
          </div>
        </div>
      </SolidPanel>

      <div className="relative mt-6 overflow-hidden rounded-panel shadow-surface">
        <div className="relative aspect-[16/7] w-full">
          <Image
            src="/fotos/atendimento-bancada.jpg"
            alt="Bancada de oficina com peças organizadas para retirada"
            fill
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <ClayButton href={whatsappHref()} external>
          <WhatsAppIcon size={18} />
          Falar no WhatsApp
        </ClayButton>
        <ClayButton href="/pecas" variant="surface">
          Ver peças
        </ClayButton>
      </div>
    </div>
  );
}
