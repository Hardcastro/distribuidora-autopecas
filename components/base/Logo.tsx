import { site } from "@/site.config";

type LogoMarkProps = {
  size?: number;
  className?: string;
  tone?: "primary" | "surface";
};

/**
 * Marca da Anhanguera — um A desenhado como chave de boca fechando sobre o
 * próprio traço, referência direta a balcão de peças em vez de tipografia.
 * Vive num badge de argila, a mesma linguagem do resto da assinatura visual.
 */
export function LogoMark({ size = 40, className = "", tone = "primary" }: LogoMarkProps) {
  const bg = tone === "primary" ? "bg-clay-primary" : "bg-clay-surface";
  const ink = tone === "primary" ? "text-clay-primary-ink" : "text-clay-surface-ink";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-card shadow-clay ${bg} ${ink} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 32 32" fill="none" style={{ width: size * 0.62, height: size * 0.62 }} aria-hidden="true">
        <path
          d="M8 25 15 7 22 25 M11.2 17.5H18.8"
          stroke="currentColor"
          strokeWidth={2.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24.5" cy="9" r={2} fill="currentColor" />
      </svg>
    </span>
  );
}

type LogoProps = {
  compact?: boolean;
  className?: string;
};

/** Lockup completo — marca + nome (+ selo de cidade no tamanho cheio). */
export function Logo({ compact = false, className = "" }: LogoProps) {
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <LogoMark size={32} />
        <span className="text-lead font-medium tracking-tight text-text-primary">{site.name}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={56} />
      <span>
        <span className="block text-h2 font-medium tracking-tight text-text-primary">{site.name}</span>
        <span className="mt-0.5 block text-body-sm font-medium uppercase tracking-wide text-text-secondary">
          {site.cidade}/{site.uf} · linha leve
        </span>
      </span>
    </span>
  );
}
