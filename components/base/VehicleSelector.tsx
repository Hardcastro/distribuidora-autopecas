"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { anosDisponiveis, modelosDisponiveis, montadorasDisponiveis, motoresDisponiveis } from "@/lib/catalogo";
import { slugify } from "@/lib/format";
import type { VeiculoCombo } from "@/lib/tipos";
import { CarIcon, ChevronDownIcon } from "./Icons";
import { AmbientGlow, SolidPanel } from "./primitives";

type Props = {
  combos: VeiculoCombo[];
  /** Painel mais compacto quando reaproveitado dentro de /pecas, sob o resultado já visível. */
  compacto?: boolean;
};

/**
 * A interação principal do site: escolher montadora → modelo → ano → motor.
 * Cada mudança navega de verdade para /pecas com os parâmetros atualizados —
 * nada de estado que só existe no navegador. Sem foto: tem que ser a coisa
 * mais rápida da página.
 */
export function VehicleSelector({ combos, compacto = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const montadora = searchParams.get("montadora") ?? "";
  const modelo = searchParams.get("modelo") ?? "";
  const anoStr = searchParams.get("ano") ?? "";
  const motor = searchParams.get("motor") ?? "";

  const montadoras = useMemo(() => montadorasDisponiveis(combos), [combos]);
  const modelos = useMemo(() => (montadora ? modelosDisponiveis(combos, montadora) : []), [combos, montadora]);
  const anos = useMemo(
    () => (montadora && modelo ? anosDisponiveis(combos, montadora, modelo) : []),
    [combos, montadora, modelo]
  );
  const motores = useMemo(
    () => (montadora && modelo && anoStr ? motoresDisponiveis(combos, montadora, modelo, Number(anoStr)) : []),
    [combos, montadora, modelo, anoStr]
  );

  function navegar(campos: { montadora?: string; modelo?: string; ano?: string; motor?: string }) {
    const proximo = new URLSearchParams(searchParams.toString());
    proximo.delete("pagina");
    const valores = { montadora, modelo, ano: anoStr, motor, ...campos };
    for (const chave of ["montadora", "modelo", "ano", "motor"] as const) {
      const valor = valores[chave];
      if (valor) proximo.set(chave, valor);
      else proximo.delete(chave);
    }
    router.push(`/pecas?${proximo.toString()}`);
  }

  const selectClass =
    "w-full appearance-none rounded-control border border-glass-solid-border bg-glass-solid-bg px-4 py-3 pr-10 text-body text-text-primary shadow-surface disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <SolidPanel radius="panel" className={`relative overflow-hidden ${compacto ? "p-5 sm:p-6" : "p-6 sm:p-9"}`}>
      {!compacto && <AmbientGlow />}
      <div className="flex items-center gap-2.5 text-text-secondary">
        <CarIcon size={22} />
        <span className="text-body-sm font-medium uppercase tracking-wide">Encontre a peça pelo carro</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-body-sm font-medium text-text-muted">Montadora</span>
          <span className="relative block">
            <select
              className={selectClass}
              value={montadora}
              onChange={(e) => navegar({ montadora: e.target.value, modelo: "", ano: "", motor: "" })}
            >
              <option value="">Selecione</option>
              {montadoras.map((m) => (
                <option key={m} value={slugify(m)}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-body-sm font-medium text-text-muted">Modelo</span>
          <span className="relative block">
            <select
              className={selectClass}
              value={modelo}
              disabled={!montadora}
              onChange={(e) => navegar({ modelo: e.target.value, ano: "", motor: "" })}
            >
              <option value="">{montadora ? "Selecione" : "Escolha a montadora"}</option>
              {modelos.map((m) => (
                <option key={m} value={slugify(m)}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-body-sm font-medium text-text-muted">Ano</span>
          <span className="relative block">
            <select
              className={selectClass}
              value={anoStr}
              disabled={!modelo}
              onChange={(e) => navegar({ ano: e.target.value, motor: "" })}
            >
              <option value="">{modelo ? "Selecione" : "Escolha o modelo"}</option>
              {anos.map((ano) => (
                <option key={ano} value={String(ano)}>
                  {ano}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-body-sm font-medium text-text-muted">Motor</span>
          <span className="relative block">
            <select
              className={selectClass}
              value={motor}
              disabled={!anoStr}
              onChange={(e) => navegar({ motor: e.target.value })}
            >
              <option value="">{anoStr ? "Selecione" : "Escolha o ano"}</option>
              {motores.map((m) => (
                <option key={m} value={slugify(m)}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </span>
        </label>
      </div>
    </SolidPanel>
  );
}
