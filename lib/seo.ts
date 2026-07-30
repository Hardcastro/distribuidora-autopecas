import type { Metadata } from "next";
import { site } from "@/site.config";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Caminho da rota, ex. "/atendimento". Default é a home. */
  path?: string;
  /** URL absoluta de imagem OG específica da rota (ex. /og/pecas?...). Default é o opengraph-image.tsx da raiz. */
  imageUrl?: string;
};

/**
 * Next.js não faz merge profundo de metadata aninhada — uma rota que define
 * openGraph próprio substitui inteiro o do layout raiz, então repetimos
 * url/type/siteName/locale aqui em toda rota.
 */
export function pageMetadata({ title, description, path = "/", imageUrl }: PageMetadataInput): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: site.locale,
      siteName: site.name,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: { title, description, card: "summary" },
  };
}
