import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPecaPorCodigo, pecasEquivalentes, veiculosDaPeca } from "@/lib/catalogo";
import { getCatalogo } from "@/lib/fonte";
import { formatBRL } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";
import { Badge, SolidPanel } from "@/components/base/primitives";
import { ShareBar } from "@/components/base/ShareBar";

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const catalogo = await getCatalogo();
  const peca = buscarPecaPorCodigo(catalogo, codigo);

  if (!peca) {
    return pageMetadata({
      title: "Peça não encontrada",
      description: "Essa peça não existe no catálogo.",
      path: `/peca/${codigo}`,
    });
  }

  const posicaoTexto = peca.posicao ? `, ${peca.posicao.toLowerCase()}` : "";
  return pageMetadata({
    title: `${peca.nome} — ${peca.codigo}`,
    description: `${peca.nome}, ${peca.categoria.toLowerCase()}${posicaoTexto} — ${formatBRL(peca.preco)}. ${site.name}.`,
    path: `/peca/${peca.codigo}`,
  });
}

export default async function PecaPage({ params }: Props) {
  const { codigo } = await params;
  const catalogo = await getCatalogo();
  const peca = buscarPecaPorCodigo(catalogo, codigo);

  if (!peca) notFound();

  const veiculos = veiculosDaPeca(catalogo, peca);
  const equivalentes = pecasEquivalentes(catalogo, peca);

  // Moldura de 1152px, igual à do cabeçalho e à do rodapé. Esta rota era a
  // única do site presa em `max-w-3xl`: as duas fichas ficavam numa coluna de
  // 715px no meio de 1440, com 360px de branco de cada lado enquanto a barra
  // de cima usava a largura toda. E as duas fichas passam a dividir a linha no
  // desktop — a lista de aplicações é longa e não tem por que esperar o fim da
  // ficha para começar.
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/pecas"
        className="-my-2.5 inline-block py-2.5 text-body-sm text-text-muted hover:text-text-primary"
      >
        ← Voltar para peças
      </Link>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
      <SolidPanel radius="panel" className="p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-body-sm text-text-muted">{peca.codigo}</span>
          <Badge>{peca.categoria}</Badge>
          {peca.posicao && <Badge>{peca.posicao}</Badge>}
          {!peca.disponivel && <Badge tone="warning">Sob consulta</Badge>}
        </div>
        <h1 className="mt-2 text-h2 font-medium tracking-tight text-text-primary">{peca.nome}</h1>
        <p className="mt-1 text-body text-text-muted">Marca {peca.marcaPeca}</p>
        <p className="mt-4 text-h3 font-medium text-text-primary">{formatBRL(peca.preco)}</p>

        {equivalentes.length > 0 && (
          <div className="mt-6 border-t border-glass-solid-border pt-6">
            <h2 className="text-body-sm font-medium uppercase tracking-wide text-text-muted">Equivalências</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {equivalentes.map((eq) => (
                <li key={eq.codigo}>
                  <Link
                    href={`/peca/${eq.codigo}`}
                    className="inline-flex items-center gap-1.5 rounded-control bg-bg-solid px-3 py-1.5 text-body-sm text-text-secondary hover:text-text-primary"
                  >
                    <span className="font-mono">{eq.codigo}</span> · {eq.marcaPeca}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/*
          A ficha da peça não tinha ação nenhuma. É a página mais funda do
          site — quem chega aqui já sabe qual peça quer — e o único jeito de
          falar com o balcão era voltar ao topo e usar o botão genérico do
          cabeçalho. Mesma barra da listagem, com a URL desta peça: o link
          filtrado é o entregável da peça inteira, e aqui o filtro é o código.
        */}
        <div className="mt-6 border-t border-glass-solid-border pt-6">
          <ShareBar
            url={`${site.url}/peca/${peca.codigo}`}
            mensagem={`${peca.nome} (${peca.codigo}) — ${formatBRL(peca.preco)}, na ${site.name}:`}
          />
        </div>
      </SolidPanel>

      <SolidPanel radius="panel" className="p-6 sm:p-9">
        <h2 className="text-h3 font-medium tracking-tight text-text-primary">Em que carros ela entra</h2>
        {veiculos.length === 0 ? (
          <p className="mt-3 text-body text-text-muted">Sem compatibilidade cadastrada para esta peça ainda.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {veiculos.map((grupo) => (
              <div key={`${grupo.montadora}-${grupo.modelo}`}>
                <p className="text-lead font-medium text-text-primary">
                  {grupo.montadora} {grupo.modelo}
                </p>
                {/* Coluna única de propósito. A parede de nove linhas quase
                    iguais já foi resolvida um nível acima, colocando esta
                    ficha AO LADO da outra em vez de abaixo dela; partir
                    também aqui deixava cada coluna com 210px e quebrava
                    "G4 · 2006–2008 · 1.0 8V EA111" no meio. */}
                <ul className="mt-1 space-y-1">
                  {grupo.faixas.map((faixa, i) => (
                    <li key={i} className="text-body tabular-nums text-text-muted">
                      {faixa.geracao} · {faixa.anoInicio}–{faixa.anoFim} · {faixa.motor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SolidPanel>
      </div>
    </div>
  );
}
