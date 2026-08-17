import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  buscarPecas,
  categoriaPorSlug,
  descreverVeiculo,
  filtroDaUrl,
  queryDaUrl,
  veiculoCombos,
  type SearchParamsPecas,
} from "@/lib/catalogo";
import { slugify } from "@/lib/format";
import { getCatalogo } from "@/lib/fonte";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";
import { CATEGORIAS_ORDEM } from "@/lib/tipos";
import { VehicleSelector } from "@/components/base/VehicleSelector";
import { PartsList } from "@/components/base/PartsList";
import { Pagination } from "@/components/base/Pagination";
import { ShareBar } from "@/components/base/ShareBar";
import { FonteAviso } from "@/components/base/FonteAviso";
import { SearchIcon } from "@/components/base/Icons";

type Props = {
  searchParams: Promise<SearchParamsPecas>;
};

async function carregar(searchParams: Promise<SearchParamsPecas>) {
  const sp = await searchParams;
  const catalogo = await getCatalogo();
  const filtro = filtroDaUrl(sp);
  const resultado = buscarPecas(catalogo, filtro);
  const combos = veiculoCombos(catalogo.aplicacoes);
  return { sp, catalogo, filtro, resultado, combos };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sp, resultado, combos } = await carregar(searchParams);
  const query = queryDaUrl(sp);
  const path = `/pecas${query ? `?${query}` : ""}`;

  const descricaoVeiculo = descreverVeiculo(combos, filtroDaUrl(sp));
  const categoriaNome = sp.categoria ? categoriaPorSlug(sp.categoria) : undefined;
  const rotulo = [descricaoVeiculo, categoriaNome].filter(Boolean).join(" · ");
  const descricao = rotulo
    ? `${resultado.total} peças · ${rotulo} · ${site.name}`
    : `${resultado.total} peças no catálogo · ${site.name}`;

  return pageMetadata({
    title: rotulo ? `Peças — ${rotulo}` : "Peças",
    description: descricao,
    path,
    imageUrl: `${site.url}/og/pecas${query ? `?${query}` : ""}`,
  });
}

export default async function PecasPage({ searchParams }: Props) {
  const { sp, catalogo, resultado, combos } = await carregar(searchParams);
  const query = queryDaUrl(sp);
  const queryFilteredNoPage = new URLSearchParams(query);
  queryFilteredNoPage.delete("pagina");

  const descricaoVeiculo = descreverVeiculo(combos, filtroDaUrl(sp));
  const categoriaAtual = sp.categoria ? categoriaPorSlug(sp.categoria) : undefined;

  const url = `${site.url}/pecas${query ? `?${query}` : ""}`;
  const mensagemCompartilhar = descricaoVeiculo
    ? `Peças para ${descricaoVeiculo} na ${site.name}:`
    : `Peças na ${site.name}:`;

  return (
    <>
      <FonteAviso origem={catalogo.origem} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}>
          <VehicleSelector combos={combos} compacto />
        </Suspense>

        <form method="get" action="/pecas" className="mt-4 flex flex-wrap items-center gap-2" role="search">
          {sp.montadora && <input type="hidden" name="montadora" value={sp.montadora} />}
          {sp.modelo && <input type="hidden" name="modelo" value={sp.modelo} />}
          {sp.ano && <input type="hidden" name="ano" value={sp.ano} />}
          {sp.motor && <input type="hidden" name="motor" value={sp.motor} />}
          {sp.categoria && <input type="hidden" name="categoria" value={sp.categoria} />}
          <label className="relative flex-1 min-w-[220px]">
            <span className="sr-only">Buscar por código ou nome da peça</span>
            <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Buscar por código ou nome"
              className="w-full rounded-control border border-glass-solid-border bg-glass-solid-bg py-2.5 pl-10 pr-4 text-body text-text-primary shadow-surface"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center rounded-control bg-clay-primary px-4 py-2.5 text-body-sm font-medium text-clay-primary-ink shadow-clay"
          >
            Buscar
          </button>
        </form>

        <nav aria-label="Categorias" className="mt-4 flex flex-wrap gap-2">
          <Link
            href={(() => {
              const p = new URLSearchParams(query);
              p.delete("categoria");
              p.delete("pagina");
              const qs = p.toString();
              return `/pecas${qs ? `?${qs}` : ""}`;
            })()}
            className={`rounded-control px-3 py-1.5 text-body-sm font-medium ${
              !categoriaAtual ? "bg-clay-primary text-clay-primary-ink" : "bg-glass-solid-bg text-text-muted shadow-surface"
            }`}
          >
            Todas
          </Link>
          {CATEGORIAS_ORDEM.map((categoria) => {
            const slug = slugify(categoria);
            const ativo = sp.categoria === slug;
            const params = new URLSearchParams(query);
            params.set("categoria", slug);
            params.delete("pagina");
            return (
              <Link
                key={categoria}
                href={`/pecas?${params.toString()}`}
                className={`rounded-control px-3 py-1.5 text-body-sm font-medium ${
                  ativo ? "bg-clay-primary text-clay-primary-ink" : "bg-glass-solid-bg text-text-muted shadow-surface"
                }`}
              >
                {categoria}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          {/* O número é a resposta da busca e estava em corpo de texto ao
              lado de dois botões preenchidos, que pesavam mais que ele. */}
          <p className="text-lead tabular-nums text-text-primary sm:text-h3">
            <strong className="font-medium">{resultado.total}</strong> peça{resultado.total === 1 ? "" : "s"}
            {descricaoVeiculo && (
              <>
                {" "}
                para <strong className="font-medium text-text-secondary">{descricaoVeiculo}</strong>
              </>
            )}
            {categoriaAtual && <> em {categoriaAtual}</>}
          </p>
          <ShareBar url={url} mensagem={mensagemCompartilhar} />
        </div>

        <div className="rounded-panel bg-glass-solid-bg p-4 shadow-surface sm:p-6">
          <PartsList itens={resultado.itens} />
        </div>

        <Pagination paginaAtual={resultado.pagina} totalPaginas={resultado.totalPaginas} query={queryFilteredNoPage.toString()} />
      </div>
    </>
  );
}
