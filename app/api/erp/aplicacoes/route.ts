import { NextRequest, NextResponse } from "next/server";
import { lerCsv } from "@/lib/fonte/csv";
import { DEFAULT_POR_PAGINA, erpToken } from "@/lib/fonte/erp-config";

/** Mesmo contrato do /api/erp/pecas, para a tabela de aplicação (compatibilidade veicular). */
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

  const { aplicacoes } = lerCsv();
  const inicio = (pagina - 1) * porPagina;
  const dados = aplicacoes.slice(inicio, inicio + porPagina).map((a) => ({
    codigo_peca: a.codigoPeca,
    montadora: a.montadora,
    modelo: a.modelo,
    geracao: a.geracao,
    ano_inicio: String(a.anoInicio),
    ano_fim: String(a.anoFim),
    motor: a.motor,
  }));

  const corpo = { pagina, por_pagina: porPagina, total: aplicacoes.length, dados };

  if (simular === "malformado") {
    const texto = JSON.stringify(corpo);
    return new NextResponse(texto.slice(0, Math.floor(texto.length / 2)), {
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.json(corpo);
}
