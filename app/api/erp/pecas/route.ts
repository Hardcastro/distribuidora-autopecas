import { NextRequest, NextResponse } from "next/server";
import { lerCsv } from "@/lib/fonte/csv";
import { DEFAULT_POR_PAGINA, erpToken } from "@/lib/fonte/erp-config";

/**
 * ERP simulado — responde como um sistema de terceiro responderia: exige
 * token, pagina, e aceita ?simular=lento|erro|malformado para demonstrar
 * os modos de falha sem derrubar nada. Serve o mesmo dado do pecas.csv,
 * simulando que o CSV versionado é a cópia exportada deste sistema.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${erpToken()}`) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const simular = searchParams.get("simular");

  if (simular === "erro") {
    return NextResponse.json({ erro: "erro interno simulado" }, { status: 500 });
  }

  if (simular === "lento") {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  }

  const pagina = Math.max(1, Number.parseInt(searchParams.get("pagina") ?? "1", 10) || 1);
  const porPagina = Math.max(
    1,
    Number.parseInt(searchParams.get("por_pagina") ?? String(DEFAULT_POR_PAGINA), 10) || DEFAULT_POR_PAGINA
  );

  const { pecas } = lerCsv();
  const inicio = (pagina - 1) * porPagina;
  const dados = pecas.slice(inicio, inicio + porPagina).map((p) => ({
    codigo: p.codigo,
    nome: p.nome,
    categoria: p.categoria,
    marca_peca: p.marcaPeca,
    posicao: p.posicao,
    preco: p.preco.toFixed(2).replace(".", ","),
    disponivel: p.disponivel ? "sim" : "não",
    equivalencias: p.equivalencias.join(";"),
  }));

  const corpo = { pagina, por_pagina: porPagina, total: pecas.length, dados };

  if (simular === "malformado") {
    const texto = JSON.stringify(corpo);
    return new NextResponse(texto.slice(0, Math.floor(texto.length / 2)), {
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.json(corpo);
}
