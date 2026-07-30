import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPecaPorCodigo, pecasEquivalentes, veiculosDaPeca } from "@/lib/catalogo";
import { getCatalogo } from "@/lib/fonte";
import { formatBRL } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";
import { Badge, SolidPanel } from "@/components/base/primitives";

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/pecas" className="text-body-sm text-text-muted hover:text-text-primary">
        ← Voltar para peças
      </Link>

      <SolidPanel radius="panel" className="mt-4 p-6 sm:p-9">
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
      </SolidPanel>

      <SolidPanel radius="panel" className="mt-6 p-6 sm:p-9">
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
                <ul className="mt-1 space-y-1">
                  {grupo.faixas.map((faixa, i) => (
                    <li key={i} className="text-body text-text-muted">
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
  );
}
