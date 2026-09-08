import type { Metadata } from "next";
import { site } from "@/site.config";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Caminho da rota, ex. "/atendimento". Default é a home. */
  path?: string;
  /**
   * Título que não recebe o `template` do layout raiz. Só a home usa: sem
   * isto o título dela sairia com o nome da casa duas vezes.
   */
  absoluto?: boolean;
  /** URL absoluta de imagem OG específica da rota (ex. /og/pecas?...). Default é o opengraph-image.tsx da raiz. */
  imageUrl?: string;
};

/**
 * Next.js não faz merge profundo de metadata aninhada — uma rota que define
 * openGraph próprio substitui inteiro o do layout raiz, então repetimos
 * url/type/siteName/locale aqui em toda rota.
 */
export function pageMetadata({ title, description, path = "/", absoluto = false, imageUrl }: PageMetadataInput): Metadata {
  const url = `${site.url}${path}`;
  // A ressalva entra em toda rota, e não só na home: quem chega por um
  // resultado de busca de página interna também precisa dela.
  const descricao = `${site.portfolio.ressalva} ${description}`;
  return {
    title: absoluto ? { absolute: title } : title,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: descricao,
      url,
      type: "website",
      locale: site.locale,
      siteName: site.name,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    // Cartão grande: as três peças de site nasceram com `summary`, que mostra
    // miniatura e não imagem. O opengraph-image.tsx já existe nas três — era
    // imagem pronta que nenhum compartilhamento usava.
    twitter: { title, description: descricao, card: "summary_large_image" },
  };
}
