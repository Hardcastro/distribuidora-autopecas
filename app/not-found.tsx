import { pageMetadata } from "@/lib/seo";
import { ClayButton } from "@/components/base/primitives";

export const metadata = pageMetadata({
  title: "Página não encontrada",
  description: "Essa página não existe ou mudou de endereço.",
});

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-24 sm:px-6">
      <span className="text-body-sm font-medium uppercase tracking-wide text-text-secondary">Erro 404</span>
      <h1 className="text-h2 font-medium tracking-tight text-text-primary">
        Essa página não existe — ou mudou de endereço.
      </h1>
      <p className="text-lead text-text-muted">Confira o link ou volte para uma das páginas da casa.</p>
      <div className="mt-2 flex flex-wrap gap-4">
        <ClayButton href="/">Voltar para o início</ClayButton>
        <ClayButton href="/pecas" variant="surface">
          Ver peças
        </ClayButton>
      </div>
    </div>
  );
}
