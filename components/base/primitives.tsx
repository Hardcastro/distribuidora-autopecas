import type { ElementType, ReactNode } from "react";
import Link from "next/link";

type SolidPanelProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  radius?: "control" | "card" | "panel";
};

/** Bloco opaco branco com elevação real — para tudo que carrega texto corrido ou lista densa. Nunca vidro, nunca achatado. */
export function SolidPanel({ children, className = "", as: Tag = "div", radius = "card" }: SolidPanelProps) {
  const radiusClass = radius === "panel" ? "rounded-panel" : radius === "control" ? "rounded-control" : "rounded-card";
  return (
    <Tag
      className={`bg-glass-solid-bg border border-glass-solid-border shadow-surface ${radiusClass} ${className}`}
    >
      {children}
    </Tag>
  );
}

type ClayButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "surface";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

/** Botão com sombra de argila e estado pressionado — usado para as poucas ações da peça. */
export function ClayButton({
  children,
  href,
  variant = "primary",
  className = "",
  external = false,
  type = "button",
  onClick,
}: ClayButtonProps) {
  const tone =
    variant === "primary" ? "bg-clay-primary text-clay-primary-ink" : "bg-clay-surface text-clay-surface-ink";

  const classes = `inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-body font-medium shadow-clay transition-[box-shadow,transform] duration-150 active:shadow-clay-active active:translate-y-px ${tone} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function AmbientGlow() {
  return <div className="ambient-glow" aria-hidden="true" />;
}

type BadgeProps = {
  children: ReactNode;
  tone?: "primary" | "muted" | "warning";
};

/** Selo curto — categoria, disponibilidade, aviso de fonte defasada. */
export function Badge({ children, tone = "muted" }: BadgeProps) {
  const toneClass =
    tone === "primary"
      ? "bg-clay-primary/15 text-text-secondary"
      : tone === "warning"
        ? "bg-amber-100 text-amber-800"
        : "bg-bg-solid text-text-muted";
  return (
    <span className={`inline-flex items-center rounded-control px-2.5 py-1 text-body-sm font-medium ${toneClass}`}>
      {children}
    </span>
  );
}
