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

  const linkClass =
    "inline-flex items-center rounded-control bg-glass-solid-bg px-4 py-2 text-body-sm font-medium text-text-primary shadow-surface";
  const desabilitadoClass = "inline-flex items-center rounded-control px-4 py-2 text-body-sm text-text-muted/50";

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

      <span className="text-body-sm text-text-muted">
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
