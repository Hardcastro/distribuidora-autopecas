import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getCatalogo } from "@/lib/fonte";
import { veiculoCombos } from "@/lib/catalogo";
import { site, whatsappHref } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import { VehicleSelector } from "@/components/base/VehicleSelector";
import { CategoryShortcuts } from "@/components/base/CategoryShortcuts";
import { FonteAviso } from "@/components/base/FonteAviso";
import { SolidPanel, ClayButton } from "@/components/base/primitives";
import { ClockIcon, PinIcon, WhatsAppIcon } from "@/components/base/Icons";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.descricao,
  path: "/",
});

export default async function HomePage() {
  const catalogo = await getCatalogo();
  const combos = veiculoCombos(catalogo.aplicacoes);

  return (
    <>
      <FonteAviso origem={catalogo.origem} />

      {/* Faixa fotográfica de topo — único lugar da home com foto, e o
          único vidro do body: fica sobre a imagem, então tem algo atrás
          para borrar (regra 1 da assinatura visual). */}
      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src="/fotos/topo-estrada.jpg"
          alt="Estrada vista do para-brisa de um carro, ao entardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/85 via-bg-deep/30 to-bg-deep/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <div className="inline-block rounded-panel border border-white/15 bg-glass-bg px-6 py-5 backdrop-blur-glass">
              <p className="text-body-sm font-medium uppercase tracking-wide text-white/80">
                {site.cidade}/{site.uf} · distribuidora de linha leve
              </p>
              <h1 className="mt-1 text-h2 font-medium tracking-tight text-white sm:text-h1">{site.promise}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}>
          <VehicleSelector combos={combos} />
        </Suspense>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-4 text-h3 font-medium tracking-tight text-text-primary">Atalhos por categoria</h2>
        <CategoryShortcuts />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <SolidPanel radius="panel" className="p-6 sm:p-9">
          <h2 className="text-h3 font-medium tracking-tight text-text-primary">O que a casa faz</h2>
          <p className="mt-3 max-w-2xl text-lead text-text-muted">
            Balcão de manhã, entrega de tarde. Trabalhamos com linha leve — suspensão, freio, motor, elétrica,
            filtros, embreagem, arrefecimento e transmissão — e a busca acima já cruza o carro informado com o
            que tem aplicação cadastrada para ele. Sem estimativa: se a peça aparece no resultado, ela serve
            naquele carro.
          </p>
          <p className="mt-3 max-w-2xl text-body text-text-muted">
            Atendemos oficina da Grande São Paulo com entrega própria. Quem prefere balcão, o endereço e o
            horário estão logo abaixo — e em{" "}
            <Link href="/atendimento" className="font-medium text-text-secondary underline underline-offset-2">
              Atendimento
            </Link>{" "}
            tem o passo a passo de como pedir por telefone ou WhatsApp.
          </p>
        </SolidPanel>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SolidPanel radius="panel" className="grid gap-6 p-6 sm:grid-cols-3 sm:p-9">
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
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-start gap-3">
              <WhatsAppIcon size={22} className="mt-0.5 shrink-0 text-text-secondary" />
              <div>
                <p className="text-body-sm font-medium uppercase tracking-wide text-text-muted">Fale com o balcão</p>
                <p className="mt-1 text-body text-text-primary">{site.whatsapp.display}</p>
              </div>
            </div>
            <ClayButton href={whatsappHref()} external>
              Falar no WhatsApp
            </ClayButton>
          </div>
        </SolidPanel>
      </section>
    </>
  );
}
