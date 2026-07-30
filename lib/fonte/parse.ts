import { csvToRecords } from "@/lib/csv";
import { normalizarCodigo, parseBoolPT, parsePrecoBR } from "@/lib/format";
import type { Aplicacao, Peca } from "@/lib/tipos";

/** Linha sem código ou sem nome é ignorada. Coluna faltando não derruba o parser. */
export function recordToPeca(record: Record<string, string>): Peca | null {
  const codigo = record["codigo"]?.trim() || record["código"]?.trim();
  const nome = record["nome"]?.trim();
  if (!codigo || !nome) return null;

  const precoRaw = record["preco"] ?? record["preço"] ?? "";
  const preco = parsePrecoBR(precoRaw) ?? 0;

  const categoriaRaw = record["categoria"]?.trim();
  const equivalenciasRaw = record["equivalencias"] ?? record["equivalências"] ?? "";

  return {
    codigo,
    codigoNormalizado: normalizarCodigo(codigo),
    nome,
    categoria: categoriaRaw && categoriaRaw !== "" ? categoriaRaw : "Outros",
    marcaPeca: record["marca_peca"]?.trim() || record["marca"]?.trim() || "—",
    posicao: record["posicao"]?.trim() || record["posição"]?.trim() || "",
    preco,
    disponivel: record["disponivel"] || record["disponível"] ? parseBoolPT(record["disponivel"] ?? record["disponível"]) : true,
    equivalencias: equivalenciasRaw
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean),
  };
}

export function parsePecasCsv(csvText: string): Peca[] {
  return csvToRecords(csvText)
    .map(recordToPeca)
    .filter((peca): peca is Peca => peca !== null);
}

/** Linha sem código de peça ou sem montadora/modelo é ignorada — mas não derruba as outras. */
export function recordToAplicacao(record: Record<string, string>): Aplicacao | null {
  const codigoPeca = record["codigo_peca"]?.trim() || record["codigopeca"]?.trim();
  const montadora = record["montadora"]?.trim();
  const modelo = record["modelo"]?.trim();
  if (!codigoPeca || !montadora || !modelo) return null;

  const anoInicio = Number.parseInt(record["ano_inicio"] ?? record["anoinicio"] ?? "", 10);
  const anoFim = Number.parseInt(record["ano_fim"] ?? record["anofim"] ?? "", 10);
  if (!Number.isFinite(anoInicio) || !Number.isFinite(anoFim)) return null;

  return {
    codigoPeca,
    montadora,
    modelo,
    geracao: record["geracao"]?.trim() || record["geração"]?.trim() || "",
    anoInicio,
    anoFim,
    motor: record["motor"]?.trim() || "",
  };
}

export function parseAplicacoesCsv(csvText: string): Aplicacao[] {
  return csvToRecords(csvText)
    .map(recordToAplicacao)
    .filter((ap): ap is Aplicacao => ap !== null);
}
