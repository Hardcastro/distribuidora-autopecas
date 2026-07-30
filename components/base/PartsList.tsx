import Link from "next/link";
import { formatBRL } from "@/lib/format";
import type { Peca } from "@/lib/tipos";
import { Badge } from "./primitives";

/**
 * A lista de resultados é tipográfica — sem foto de peça, sem placeholder.
 * Código, nome, posição e preço carregam a linha com hierarquia e
 * divisória, no estilo de catálogo técnico impresso.
 */
export function PartsList({ itens }: { itens: Peca[] }) {
  if (itens.length === 0) {
    return <p className="py-16 text-center text-lead text-text-muted">Nenhuma peça encontrada com esse filtro.</p>;
  }

  return (
    <ul>
      {itens.map((peca) => (
        <li key={peca.codigo} className="linha-peca">
          <Link
            href={`/peca/${peca.codigo}`}
            className="-mx-2 flex items-center justify-between gap-4 rounded-control px-2 py-4 transition-colors hover:bg-bg-solid/60"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-body-sm text-text-muted">{peca.codigo}</span>
                <span className="text-body font-medium text-text-primary">{peca.nome}</span>
                {peca.posicao && <Badge>{peca.posicao}</Badge>}
                {!peca.disponivel && <Badge tone="warning">Sob consulta</Badge>}
              </div>
              <p className="mt-0.5 text-body-sm text-text-muted">
                {peca.marcaPeca} · {peca.categoria}
              </p>
            </div>
            <span className="shrink-0 text-lead font-medium text-text-primary">{formatBRL(peca.preco)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
