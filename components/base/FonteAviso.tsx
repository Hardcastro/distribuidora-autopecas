import type { OrigemCatalogo } from "@/lib/tipos";
import { AlertIcon } from "./Icons";

/** Aviso discreto de que o catálogo pode estar defasado — aparece só quando o ERP falhou e caímos no CSV. */
export function FonteAviso({ origem }: { origem: OrigemCatalogo }) {
  if (origem !== "erp-fallback") return null;

  return (
    <div className="mx-auto flex max-w-6xl items-start gap-2.5 px-4 pt-4 text-body-sm text-amber-800 sm:px-6">
      <AlertIcon size={18} className="mt-0.5 shrink-0" />
      <span>
        O sistema de estoque não respondeu agora — mostrando o catálogo da última atualização versionada. Pode
        estar um pouco defasado.
      </span>
    </div>
  );
}
