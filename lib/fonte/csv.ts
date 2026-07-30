import { readFileSync } from "node:fs";
import path from "node:path";
import { parseAplicacoesCsv, parsePecasCsv } from "./parse";
import type { Aplicacao, Peca } from "@/lib/tipos";

const PECAS_CSV_PATH = path.join(process.cwd(), "pecas.csv");
const APLICACOES_CSV_PATH = path.join(process.cwd(), "aplicacoes.csv");

function readCsvFile(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

/** Adaptador A — lê os CSV versionados no repositório. É o padrão: clonar e rodar sem .env funciona por aqui. */
export function lerCsv(): { pecas: Peca[]; aplicacoes: Aplicacao[] } {
  const pecas = parsePecasCsv(readCsvFile(PECAS_CSV_PATH));
  const aplicacoes = parseAplicacoesCsv(readCsvFile(APLICACOES_CSV_PATH));
  return { pecas, aplicacoes };
}
