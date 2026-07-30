import { ImageResponse } from "next/og";
import { buscarPecas, categoriaPorSlug, descreverVeiculo, filtroDaUrl, veiculoCombos } from "@/lib/catalogo";
import { getCatalogo } from "@/lib/fonte";
import { site } from "@/site.config";
import type { SearchParamsPecas } from "@/lib/catalogo";

const size = { width: 1200, height: 630 };

/**
 * opengraph-image.tsx recebe params, não searchParams — não dá pra gerar
 * preview por filtro nesse arquivo especial. Por isso o preview de /pecas
 * é um route handler comum: /pecas aponta openGraph.images pra cá.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sp: SearchParamsPecas = Object.fromEntries(searchParams.entries());

  const catalogo = await getCatalogo();
  const filtro = filtroDaUrl(sp);
  const resultado = buscarPecas(catalogo, filtro);
  const combos = veiculoCombos(catalogo.aplicacoes);
  const descricaoVeiculo = descreverVeiculo(combos, filtro);
  const categoriaNome = sp.categoria ? categoriaPorSlug(sp.categoria) : undefined;
  const rotulo = [descricaoVeiculo, categoriaNome].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(140deg, #ffffff 0%, #f3faf7 55%, #e9f6f0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#065f46",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 22 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600, color: "#0f172a" }}>{resultado.total}</div>
          <div style={{ display: "flex", fontSize: 34, color: "#134e4a" }}>
            peça{resultado.total === 1 ? "" : "s"} encontrada{resultado.total === 1 ? "" : "s"}
          </div>
        </div>
        {rotulo && (
          <div style={{ display: "flex", marginTop: 20, fontSize: 40, fontWeight: 600, color: "#022c22", maxWidth: 980 }}>
            {rotulo}
          </div>
        )}
        <div style={{ display: "flex", marginTop: 32, fontSize: 24, color: "#475569" }}>
          {site.cidade}/{site.uf} · link filtrado, resultado idêntico pra quem abrir
        </div>
      </div>
    ),
    size
  );
}
