import { lerCsv } from "./csv";
import { lerErp } from "./erp";
import type { Catalogo } from "@/lib/tipos";

let cache: Catalogo | null = null;

/**
 * A única interface que o catálogo conhece. Troca de fonte é troca da
 * variável de ambiente FONTE — nada no resto do código sabe se o dado veio
 * do CSV versionado ou do ERP simulado.
 */
export async function getCatalogo(): Promise<Catalogo> {
  if (cache) return cache;

  const fonte = process.env.FONTE === "erp" ? "erp" : "csv";

  if (fonte === "csv") {
    const { pecas, aplicacoes } = lerCsv();
    cache = { pecas, aplicacoes, origem: "csv" };
    return cache;
  }

  try {
    const { pecas, aplicacoes } = await lerErp();
    if (pecas.length === 0) throw new Error("ERP devolveu catálogo vazio");
    cache = { pecas, aplicacoes, origem: "erp" };
    return cache;
  } catch {
    // Queda cai no fallback: o CSV versionado, para a página nunca dar 500
    // porque um sistema de fora caiu.
    const { pecas, aplicacoes } = lerCsv();
    cache = { pecas, aplicacoes, origem: "erp-fallback" };
    return cache;
  }
}
