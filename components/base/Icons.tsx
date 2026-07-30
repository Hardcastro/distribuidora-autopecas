type IconProps = {
  className?: string;
  size?: number;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MenuIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function CloseIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function PinIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </svg>
  );
}

export function ClockIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function PhoneIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <path d="M6.5 4h3l1.2 4.2-2 1.6a12 12 0 0 0 5.5 5.5l1.6-2 4.2 1.2v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 8.6 1.5 1.5 0 0 1 6.5 4Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2.5A9.4 9.4 0 0 0 3.7 16.9L2.5 21.5l4.7-1.2A9.4 9.4 0 1 0 12 2.5Zm0 1.7a7.6 7.6 0 0 1 6.6 11.5 7.7 7.7 0 0 1-6.6 3.9 7.6 7.6 0 0 1-3.9-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.6 7.6 0 0 1 12 4.2Zm-3.1 3.9c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.2.2 2 3.1 4.8 4.2 2.4 1 2.8.8 3.3.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3l-2.2-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.2-.5-.4-.5-.6-.5Z"
      />
    </svg>
  );
}

export function CarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <path d="M4 16.5V12l2-5h12l2 5v4.5" />
      <path d="M4 16.5h16v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <line x1="6.5" y1="7" x2="17.5" y2="7" />
      <circle cx="7.5" cy="16.5" r="1.4" />
      <circle cx="16.5" cy="16.5" r="1.4" />
    </svg>
  );
}

export function SearchIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.3" y1="15.3" x2="20.5" y2="20.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className, size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <polyline points="5,9 12,16 19,9" />
    </svg>
  );
}

export function CopyIcon({ className, size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
      <path d="M15 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v7.5A1.5 1.5 0 0 0 6 15h2.5" />
    </svg>
  );
}

export function CheckIcon({ className, size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <polyline points="4,13 9,18 20,6" />
    </svg>
  );
}

export function AlertIcon({ className, size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <path d="M12 3.5 21.5 20h-19Z" />
      <line x1="12" y1="9.5" x2="12" y2="14" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon({ className, size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </svg>
  );
}

/** Disco de freio — atalho de categoria "Freio". */
export function BrakeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.6" />
      <line x1="12" y1="6" x2="12" y2="8.2" />
      <line x1="12" y1="15.8" x2="12" y2="18" />
      <line x1="6" y1="12" x2="8.2" y2="12" />
      <line x1="15.8" y1="12" x2="18" y2="12" />
    </svg>
  );
}

/** Amortecedor — atalho de categoria "Suspensão". */
export function SuspensionIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <line x1="12" y1="2.5" x2="12" y2="6" />
      <path d="M8 6h8l-1.2 3H9.2Z" />
      <path d="M9.5 9v2M12 9v2M14.5 9v2" />
      <path d="M9.5 11h5l-1 3h-3Z" />
      <line x1="12" y1="14" x2="12" y2="21.5" />
    </svg>
  );
}

/** Cofre de motor — atalho de categoria "Motor". */
export function EngineIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <rect x="4" y="9" width="12" height="8" rx="1" />
      <path d="M16 11h2.5l1.5 2v4h-4" />
      <line x1="7" y1="9" x2="7" y2="6.5" />
      <line x1="10.5" y1="9" x2="10.5" y2="6.5" />
      <line x1="7" y1="6.5" x2="10.5" y2="6.5" />
      <circle cx="9" cy="13" r="1.4" />
    </svg>
  );
}

/** Raio — atalho de categoria "Elétrica". */
export function BoltIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <path d="M13 3 5 13.5h5.5L11 21l8-11.5h-5.5Z" />
    </svg>
  );
}

/** Radiador com pás — atalho de categoria "Arrefecimento". */
export function RadiatorIcon({ className, size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <line x1="8" y1="4" x2="8" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="16" y1="4" x2="16" y2="20" />
    </svg>
  );
}
