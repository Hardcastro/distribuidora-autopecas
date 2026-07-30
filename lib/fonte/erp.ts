import { recordToAplicacao, recordToPeca } from "./parse";
import { DEFAULT_POR_PAGINA, erpToken } from "./erp-config";
import type { Aplicacao, Peca } from "@/lib/tipos";

const TIMEOUT_MS = 4000;

function erpBaseUrl(): string {
  return process.env.ERP_BASE_URL?.trim() || "http://localhost:3000/api/erp";
}

async function fetchComTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${erpToken()}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`ERP respondeu ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** Uma tentativa, e uma retentativa antes de desistir — é o que integração real com sistema de terceiro exige. */
async function fetchComRetry(url: string): Promise<Response> {
  try {
    return await fetchComTimeout(url);
  } catch (primeiroErro) {
    try {
      return await fetchComTimeout(url);
    } catch {
      throw primeiroErro;
    }
  }
}

async function paginarTudo<T>(endpoint: string, toItem: (record: Record<string, string>) => T | null): Promise<T[]> {
  const itens: T[] = [];
  let pagina = 1;

  for (;;) {
    const url = `${erpBaseUrl()}/${endpoint}?pagina=${pagina}&por_pagina=${DEFAULT_POR_PAGINA}`;
    const res = await fetchComRetry(url);
    const texto = await res.text();
    const corpo = JSON.parse(texto) as { dados: Record<string, string>[] };

    for (const record of corpo.dados) {
      const item = toItem(record);
      if (item) itens.push(item);
    }

    if (corpo.dados.length < DEFAULT_POR_PAGINA) break;
    pagina++;
  }

  return itens;
}

/** Adaptador B — HTTP paginado, com token, contra o ERP simulado. Falha sobe para lib/fonte/index.ts decidir o fallback. */
export async function lerErp(): Promise<{ pecas: Peca[]; aplicacoes: Aplicacao[] }> {
  const [pecas, aplicacoes] = await Promise.all([
    paginarTudo("pecas", recordToPeca),
    paginarTudo("aplicacoes", recordToAplicacao),
  ]);
  return { pecas, aplicacoes };
}
