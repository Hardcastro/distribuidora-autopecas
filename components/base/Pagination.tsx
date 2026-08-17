import Link from "next/link";

type Props = {
  paginaAtual: number;
  totalPaginas: number;
  /** Query string atual, sem o parâmetro "pagina". */
  query: string;
};

function hrefPagina(query: string, pagina: number): string {
  const params = new URLSearchParams(query);
  if (pagina > 1) params.set("pagina", String(pagina));
  const qs = params.toString();
  return `/pecas${qs ? `?${qs}` : ""}`;
}

export function Pagination({ paginaAtual, totalPaginas, query }: Props) {
  if (totalPaginas <= 1) return null;

  // h-10 nos três: alvo de toque de verdade, e o desabilitado ganha borda
  // tracejada em vez de só perder cor — antes ele tinha exatamente a mesma
  // silhueta do link ativo, e a única diferença era o tom do texto.
  const linkClass =
    "inline-flex h-10 items-center rounded-control border border-glass-solid-border bg-glass-solid-bg px-4 text-body-sm font-medium text-text-primary shadow-surface transition-colors hover:border-clay-primary/50";
  const desabilitadoClass =
    "inline-flex h-10 items-center rounded-control border border-dashed border-glass-solid-border px-4 text-body-sm text-text-muted/50";

  return (
    <nav aria-label="Paginação de peças" className="mt-8 flex items-center justify-center gap-3">
      {paginaAtual > 1 ? (
        <Link href={hrefPagina(query, paginaAtual - 1)} className={linkClass}>
          Anterior
        </Link>
      ) : (
        <span className={desabilitadoClass} aria-disabled="true">
          Anterior
        </span>
      )}

      <span className="px-2 text-body-sm font-medium tabular-nums text-text-secondary">
        Página {paginaAtual} de {totalPaginas}
      </span>

      {paginaAtual < totalPaginas ? (
        <Link href={hrefPagina(query, paginaAtual + 1)} className={linkClass}>
          Próxima
        </Link>
      ) : (
        <span className={desabilitadoClass} aria-disabled="true">
          Próxima
        </span>
      )}
    </nav>
  );
}
