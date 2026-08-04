/**
 * Template, não layout — o Next remonta isto a cada navegação (layout
 * sobrevive entre rotas, template não), e é isso que reinicia a animação
 * de .page-transition a cada troca de página sem listener de rota nenhum.
 * Keyframes em globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
