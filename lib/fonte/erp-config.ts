/**
 * Valores compartilhados entre o ERP simulado (app/api/erp) e o adaptador
 * que fala com ele (lib/fonte/erp.ts) — um lado autentica, o outro assina
 * com o mesmo token, e os dois têm que concordar sem depender de .env.
 */
export const DEFAULT_ERP_TOKEN = "anhanguera-dev-token";
export const DEFAULT_POR_PAGINA = 200;

export function erpToken(): string {
  return process.env.ERP_TOKEN?.trim() || DEFAULT_ERP_TOKEN;
}
