import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/format";
import { ArrowRightIcon } from "./Icons";

type Atalho = {
  categoria: string;
  imagem: string;
  alt: string;
};

const ATALHOS: Atalho[] = [
  { categoria: "Freio", imagem: "/fotos/cat-freio.jpg", alt: "Disco e pinça de freio desmontados sobre bancada de oficina" },
  { categoria: "Suspensão", imagem: "/fotos/cat-suspensao.jpg", alt: "Amortecedor e mola de suspensão apoiados na bancada" },
  { categoria: "Motor", imagem: "/fotos/cat-motor.jpg", alt: "Cofre de motor aberto durante manutenção" },
  { categoria: "Elétrica", imagem: "/fotos/cat-eletrica.jpg", alt: "Chicote elétrico e bateria de veículo" },
  { categoria: "Arrefecimento", imagem: "/fotos/cat-arrefecimento.jpg", alt: "Radiador exposto durante troca de arrefecimento" },
];

/** Atalhos de categoria com foto — a única lista de produto que leva imagem, e mesmo assim genérica de contexto, nunca a peça em si. */
export function CategoryShortcuts() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ATALHOS.map((atalho) => (
        <Link
          key={atalho.categoria}
          href={`/pecas?categoria=${slugify(atalho.categoria)}`}
          className="group relative overflow-hidden rounded-card shadow-surface transition-shadow hover:shadow-surface-lg"
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={atalho.imagem}
              alt={atalho.alt}
              fill
              sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-bg-deep/10 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
            <span className="text-body-sm font-medium text-white">{atalho.categoria}</span>
            <ArrowRightIcon size={16} className="text-white/80 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
