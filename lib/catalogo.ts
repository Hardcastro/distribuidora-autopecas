import { normalizarCodigo, normalizarTexto, slugify } from "@/lib/format";
import { CATEGORIAS_ORDEM } from "@/lib/tipos";
import type { Aplicacao, Catalogo, FiltroVeiculo, Peca, VeiculoCombo } from "@/lib/tipos";

export const ITENS_POR_PAGINA = 24;

/** Combinações distintas de veículo, derivadas das aplicações — alimentam o seletor em cascata. */
export function veiculoCombos(aplicacoes: Aplicacao[]): VeiculoCombo[] {
  const vistos = new Map<string, VeiculoCombo>();
  for (const a of aplicacoes) {
    const chave = `${a.montadora}|${a.modelo}|${a.geracao}|${a.anoInicio}|${a.anoFim}|${a.motor}`;
    if (!vistos.has(chave)) {
      vistos.set(chave, {
        montadora: a.montadora,
        modelo: a.modelo,
        geracao: a.geracao,
        anoInicio: a.anoInicio,
        anoFim: a.anoFim,
        motor: a.motor,
      });
    }
  }
  return [...vistos.values()];
}

export function montadorasDisponiveis(combos: VeiculoCombo[]): string[] {
  return [...new Set(combos.map((c) => c.montadora))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function modelosDisponiveis(combos: VeiculoCombo[], montadoraSlug: string): string[] {
  return [...new Set(combos.filter((c) => slugify(c.montadora) === montadoraSlug).map((c) => c.modelo))].sort(
    (a, b) => a.localeCompare(b, "pt-BR")
  );
}

export function anosDisponiveis(combos: VeiculoCombo[], montadoraSlug: string, modeloSlug: string): number[] {
  const relevantes = combos.filter(
    (c) => slugify(c.montadora) === montadoraSlug && slugify(c.modelo) === modeloSlug
  );
  const anos = new Set<number>();
  for (const c of relevantes) {
    for (let ano = c.anoInicio; ano <= c.anoFim; ano++) anos.add(ano);
  }
  return [...anos].sort((a, b) => b - a);
}

export function motoresDisponiveis(
  combos: VeiculoCombo[],
  montadoraSlug: string,
  modeloSlug: string,
  ano: number
): string[] {
  const relevantes = combos.filter(
    (c) =>
      slugify(c.montadora) === montadoraSlug &&
      slugify(c.modelo) === modeloSlug &&
      ano >= c.anoInicio &&
      ano <= c.anoFim
  );
  return [...new Set(relevantes.map((c) => c.motor))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function combinaFiltroVeiculo(a: Aplicacao, filtro: FiltroVeiculo): boolean {
  if (filtro.montadora && slugify(a.montadora) !== filtro.montadora) return false;
  if (filtro.modelo && slugify(a.modelo) !== filtro.modelo) return false;
  if (filtro.ano !== undefined && (filtro.ano < a.anoInicio || filtro.ano > a.anoFim)) return false;
  if (filtro.motor && slugify(a.motor) !== filtro.motor) return false;
  return true;
}

/** Ordena por categoria (conhecidas primeiro, na ordem do catálogo técnico) e depois por nome. */
function compararPecas(a: Peca, b: Peca): number {
  const idxA = CATEGORIAS_ORDEM.indexOf(a.categoria as (typeof CATEGORIAS_ORDEM)[number]);
  const idxB = CATEGORIAS_ORDEM.indexOf(b.categoria as (typeof CATEGORIAS_ORDEM)[number]);
  const ordemA = idxA === -1 ? CATEGORIAS_ORDEM.length : idxA;
  const ordemB = idxB === -1 ? CATEGORIAS_ORDEM.length : idxB;
  if (ordemA !== ordemB) return ordemA - ordemB;
  return a.nome.localeCompare(b.nome, "pt-BR");
}

export type FiltroBusca = FiltroVeiculo & {
  categoria?: string;
  q?: string;
  pagina?: number;
};

export type ResultadoBusca = {
  itens: Peca[];
  total: number;
  pagina: number;
  totalPaginas: number;
};

/**
 * Buscar por veículo é resolver a junção: só entram peças com uma aplicação
 * onde montadora/modelo batem, o ano pedido está dentro de ano_inicio–ano_fim
 * e o motor bate. Peça sem nenhuma aplicação continua achável por código —
 * o filtro de veículo só entra em jogo quando algum parâmetro de veículo
 * está presente na busca.
 */
export function buscarPecas(catalogo: Catalogo, filtro: FiltroBusca): ResultadoBusca {
  let candidatos = catalogo.pecas;

  const temFiltroVeiculo = Boolean(filtro.montadora || filtro.modelo || filtro.ano !== undefined || filtro.motor);
  if (temFiltroVeiculo) {
    const codigosCompativeis = new Set(
      catalogo.aplicacoes.filter((a) => combinaFiltroVeiculo(a, filtro)).map((a) => normalizarCodigo(a.codigoPeca))
    );
    candidatos = candidatos.filter((p) => codigosCompativeis.has(p.codigoNormalizado));
  }

  if (filtro.categoria) {
    candidatos = candidatos.filter((p) => slugify(p.categoria) === filtro.categoria);
  }

  if (filtro.q && filtro.q.trim() !== "") {
    const qCodigo = normalizarCodigo(filtro.q);
    const qTexto = normalizarTexto(filtro.q);
    candidatos = candidatos.filter(
      (p) => p.codigoNormalizado.includes(qCodigo) || normalizarTexto(p.nome).includes(qTexto)
    );
  }

  const ordenados = [...candidatos].sort(compararPecas);
  const total = ordenados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / ITENS_POR_PAGINA));
  const pagina = Math.min(Math.max(1, filtro.pagina ?? 1), totalPaginas);
  const inicio = (pagina - 1) * ITENS_POR_PAGINA;

  return {
    itens: ordenados.slice(inicio, inicio + ITENS_POR_PAGINA),
    total,
    pagina,
    totalPaginas,
  };
}

/** Busca tolerante a formatação de código: "JP-4412", "jp4412" e "JP 4412" acham a mesma peça. */
export function buscarPecaPorCodigo(catalogo: Catalogo, codigo: string): Peca | null {
  const alvo = normalizarCodigo(codigo);
  return catalogo.pecas.find((p) => p.codigoNormalizado === alvo) ?? null;
}

export type VeiculoAgrupado = {
  montadora: string;
  modelo: string;
  faixas: Array<{ geracao: string; anoInicio: number; anoFim: number; motor: string }>;
};

/** A página da peça percorre a relação no sentido inverso: em que veículos ela entra, agrupado por montadora e modelo. */
export function veiculosDaPeca(catalogo: Catalogo, peca: Peca): VeiculoAgrupado[] {
  const aplicacoes = catalogo.aplicacoes.filter((a) => normalizarCodigo(a.codigoPeca) === peca.codigoNormalizado);

  const grupos = new Map<string, VeiculoAgrupado>();
  for (const a of aplicacoes) {
    const chave = `${a.montadora}|${a.modelo}`;
    if (!grupos.has(chave)) {
      grupos.set(chave, { montadora: a.montadora, modelo: a.modelo, faixas: [] });
    }
    grupos.get(chave)!.faixas.push({
      geracao: a.geracao,
      anoInicio: a.anoInicio,
      anoFim: a.anoFim,
      motor: a.motor,
    });
  }

  return [...grupos.values()].sort((x, y) => x.montadora.localeCompare(y.montadora, "pt-BR") || x.modelo.localeCompare(y.modelo, "pt-BR"));
}

/** Peças de mesma categoria/nome/posição, de marca diferente — mais os códigos declarados em equivalencias. */
export function pecasEquivalentes(catalogo: Catalogo, peca: Peca): Peca[] {
  const declaradas = new Set(peca.equivalencias.map(normalizarCodigo));
  return catalogo.pecas.filter(
    (p) =>
      p.codigoNormalizado !== peca.codigoNormalizado &&
      (declaradas.has(p.codigoNormalizado) ||
        (p.categoria === peca.categoria && p.nome === peca.nome && p.posicao === peca.posicao))
  );
}

export type SearchParamsPecas = {
  montadora?: string;
  modelo?: string;
  ano?: string;
  motor?: string;
  categoria?: string;
  q?: string;
  pagina?: string;
};

/** Lê o estado do filtro exatamente como ele vive na URL — nada de estado no navegador. */
export function filtroDaUrl(sp: SearchParamsPecas): FiltroBusca {
  return {
    montadora: sp.montadora || undefined,
    modelo: sp.modelo || undefined,
    ano: sp.ano ? Number(sp.ano) : undefined,
    motor: sp.motor || undefined,
    categoria: sp.categoria || undefined,
    q: sp.q || undefined,
    pagina: sp.pagina ? Number(sp.pagina) : 1,
  };
}

/** Monta a query string canônica (mesma ordem sempre) a partir do filtro cru da URL. */
export function queryDaUrl(sp: SearchParamsPecas): string {
  const params = new URLSearchParams();
  if (sp.montadora) params.set("montadora", sp.montadora);
  if (sp.modelo) params.set("modelo", sp.modelo);
  if (sp.ano) params.set("ano", sp.ano);
  if (sp.motor) params.set("motor", sp.motor);
  if (sp.categoria) params.set("categoria", sp.categoria);
  if (sp.q) params.set("q", sp.q);
  if (sp.pagina && sp.pagina !== "1") params.set("pagina", sp.pagina);
  return params.toString();
}

export function categoriaPorSlug(slug: string): string | undefined {
  return CATEGORIAS_ORDEM.find((c) => slugify(c) === slug);
}

/** "Gol 1.0 8V EA111 2011" — texto legível do veículo filtrado, para título de página e imagem de preview. */
export function descreverVeiculo(combos: VeiculoCombo[], filtro: FiltroVeiculo): string {
  const partes: string[] = [];

  const comboModelo = combos.find(
    (c) =>
      (!filtro.montadora || slugify(c.montadora) === filtro.montadora) &&
      (!filtro.modelo || slugify(c.modelo) === filtro.modelo)
  );

  if (filtro.modelo && comboModelo) {
    partes.push(`${comboModelo.montadora} ${comboModelo.modelo}`);
  } else if (filtro.montadora && comboModelo) {
    partes.push(comboModelo.montadora);
  }

  if (filtro.motor) {
    const comboMotor = combos.find(
      (c) => slugify(c.motor) === filtro.motor && (!filtro.modelo || slugify(c.modelo) === filtro.modelo)
    );
    if (comboMotor) partes.push(comboMotor.motor);
  }

  if (filtro.ano !== undefined) partes.push(String(filtro.ano));

  return partes.join(" ");
}
