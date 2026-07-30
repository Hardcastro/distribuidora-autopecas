export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Converte preço no formato brasileiro ("248,90" ou "1.234,56") para número. */
export function parsePrecoBR(raw: string): number | null {
  const cleaned = raw
    .trim()
    .replace(/^R\$\s*/i, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (cleaned === "") return null;

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

const TRUE_VALUES = new Set(["sim", "s", "x", "1", "true", "verdadeiro", "yes"]);

/** Aceita várias grafias de "sim"/"não" como booleano. */
export function parseBoolPT(raw: string | undefined): boolean {
  if (!raw) return false;
  const normalized = removeAcentos(raw.trim().toLowerCase());
  return TRUE_VALUES.has(normalized);
}

/** Remove acentos e diacríticos: "não" -> "nao", "Suspensão" -> "Suspensao". */
export function removeAcentos(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Normaliza texto para busca tolerante a acento e caixa: minúsculo, sem acento, espaços colapsados. */
export function normalizarTexto(value: string): string {
  return removeAcentos(value.trim().toLowerCase()).replace(/\s+/g, " ");
}

/** Normaliza código de peça para busca tolerante a formatação: maiúscula, só alfanumérico. */
export function normalizarCodigo(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Slug estável para valores de filtro na URL (ex.: "Volkswagen" -> "volkswagen", "1.0 8V" -> "1.0-8v"). */
export function slugify(value: string): string {
  return removeAcentos(value.trim().toLowerCase())
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
