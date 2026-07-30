export type Peca = {
  codigo: string;
  /** Código normalizado (maiúsculo, só alfanumérico) — pré-computado para busca tolerante. */
  codigoNormalizado: string;
  nome: string;
  categoria: string;
  marcaPeca: string;
  posicao: string;
  preco: number;
  disponivel: boolean;
  equivalencias: string[];
};

export type Aplicacao = {
  codigoPeca: string;
  montadora: string;
  modelo: string;
  geracao: string;
  anoInicio: number;
  anoFim: number;
  motor: string;
};

export type OrigemCatalogo = "csv" | "erp" | "erp-fallback";

export type Catalogo = {
  pecas: Peca[];
  aplicacoes: Aplicacao[];
  origem: OrigemCatalogo;
};

export const CATEGORIAS_ORDEM = [
  "Suspensão",
  "Freio",
  "Motor",
  "Elétrica",
  "Filtros",
  "Embreagem",
  "Arrefecimento",
  "Transmissão",
] as const;

export type FiltroVeiculo = {
  montadora?: string;
  modelo?: string;
  ano?: number;
  motor?: string;
};

/** Uma combinação distinta de veículo, derivada das aplicações — alimenta o seletor em cascata. */
export type VeiculoCombo = {
  montadora: string;
  modelo: string;
  geracao: string;
  anoInicio: number;
  anoFim: number;
  motor: string;
};
