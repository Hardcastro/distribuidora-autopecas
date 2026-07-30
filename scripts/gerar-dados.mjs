#!/usr/bin/env node
/**
 * Gera pecas.csv e aplicacoes.csv a partir de um catálogo de veículos reais
 * (montadora/modelo/geração/motor de mercado brasileiro) e um conjunto de
 * marcas de peça FICTÍCIAS. Sem dependência externa — só node.
 *
 * Regra de coerência que este script garante:
 *  - Peças de categoria "chassi" (Suspensão, Freio, Embreagem, Transmissão)
 *    ficam ligadas a uma geração inteira de um modelo (todas as motorizações
 *    daquela geração), porque a peça é a mesma independente do motor.
 *  - Peças de categoria "motor" (Motor, Elétrica, Filtros, Arrefecimento)
 *    ficam ligadas a uma FAMÍLIA de motor (ex.: EA111 da VW), que pode
 *    atravessar vários modelos e gerações da mesma montadora — do jeito que
 *    motor de plataforma compartilhada funciona na vida real. Nunca
 *    atravessa marcas: família de motor é sempre exclusiva de uma montadora.
 *
 * Rodar: node scripts/gerar-dados.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Catálogo de veículos: modelos reais do mercado brasileiro. Cada geração
// carrega sua família de motor (para o fan-out de peças "motor") e a lista
// de motores específicos oferecidos naquela geração.
// ---------------------------------------------------------------------------

const MODELOS = [
  {
    montadora: "Volkswagen",
    modelo: "Gol",
    geracoes: [
      { geracao: "G4", anoInicio: 2006, anoFim: 2008, familia: "EA111", motores: ["1.0 8V EA111", "1.6 8V EA111"] },
      { geracao: "G5", anoInicio: 2008, anoFim: 2012, familia: "EA111", motores: ["1.0 8V EA111", "1.6 8V EA111", "1.6 16V EA111"] },
      { geracao: "G6", anoInicio: 2012, anoFim: 2016, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.6 16V MSI EA111"] },
      { geracao: "G7/G8", anoInicio: 2016, anoFim: 2023, familia: "EA211", motores: ["1.0 12V MPI EA211", "1.6 16V MSI EA211"] },
    ],
  },
  {
    montadora: "Volkswagen",
    modelo: "Fox",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2003, anoFim: 2009, familia: "EA111", motores: ["1.0 8V EA111", "1.6 8V EA111"] },
      { geracao: "2ª geração", anoInicio: 2009, anoFim: 2014, familia: "EA111", motores: ["1.0 8V EA111", "1.6 16V EA111"] },
      { geracao: "Facelift", anoInicio: 2014, anoFim: 2017, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.6 16V MSI EA111"] },
      { geracao: "Final", anoInicio: 2017, anoFim: 2021, familia: "EA211", motores: ["1.0 12V MPI EA211", "1.6 16V MSI EA211"] },
    ],
  },
  {
    montadora: "Volkswagen",
    modelo: "Voyage",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2008, anoFim: 2012, familia: "EA111", motores: ["1.0 8V EA111", "1.6 8V EA111"] },
      { geracao: "2ª geração", anoInicio: 2012, anoFim: 2016, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.6 16V MSI EA111"] },
      { geracao: "Facelift", anoInicio: 2016, anoFim: 2019, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.6 16V MSI EA111"] },
      { geracao: "Final", anoInicio: 2019, anoFim: 2023, familia: "EA211", motores: ["1.0 12V MPI EA211", "1.6 16V MSI EA211"] },
    ],
  },
  {
    montadora: "Volkswagen",
    modelo: "Saveiro",
    geracoes: [
      { geracao: "G5", anoInicio: 2009, anoFim: 2013, familia: "EA111", motores: ["1.6 8V EA111", "1.6 16V EA111"] },
      { geracao: "G6", anoInicio: 2013, anoFim: 2016, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.6 16V MSI EA111"] },
      { geracao: "G7", anoInicio: 2016, anoFim: 2021, familia: "EA211", motores: ["1.6 16V MSI EA211", "1.6 20V TSI EA211"] },
      { geracao: "Atual", anoInicio: 2021, anoFim: 2023, familia: "EA211", motores: ["1.6 16V MSI EA211", "1.6 20V TSI EA211"] },
    ],
  },
  {
    montadora: "Volkswagen",
    modelo: "Polo",
    geracoes: [
      { geracao: "1ª geração BR", anoInicio: 2002, anoFim: 2007, familia: "EA111", motores: ["1.6 8V EA111", "1.8 20V Turbo EA111"] },
      { geracao: "2ª geração BR", anoInicio: 2007, anoFim: 2014, familia: "EA111", motores: ["1.6 8V EA111", "2.0 8V EA111"] },
      { geracao: "Novo Polo", anoInicio: 2017, anoFim: 2020, familia: "EA211", motores: ["1.0 12V MPI EA211", "1.0 12V TSI EA211", "1.6 16V MSI EA211"] },
      { geracao: "Atual", anoInicio: 2020, anoFim: 2023, familia: "EA211", motores: ["1.0 12V TSI EA211", "1.6 16V MSI EA211"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Palio",
    geracoes: [
      { geracao: "2ª geração", anoInicio: 1996, anoFim: 2000, familia: "Fire", motores: ["1.0 8V Fire", "1.6 16V"] },
      { geracao: "Facelift", anoInicio: 2001, anoFim: 2004, familia: "Fire", motores: ["1.0 8V Fire", "1.5 8V"] },
      { geracao: "3ª geração", anoInicio: 2004, anoFim: 2011, familia: "Fire", motores: ["1.0 8V Fire", "1.4 8V Fire", "1.8 8V"] },
      { geracao: "Atual", anoInicio: 2012, anoFim: 2017, familia: "Fire Evo", motores: ["1.0 Fire Evo", "1.4 Fire Evo"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Uno",
    geracoes: [
      { geracao: "Mille", anoInicio: 2004, anoFim: 2010, familia: "Fire", motores: ["1.0 8V Fire", "1.5 8V"] },
      { geracao: "Novo Uno 1ª", anoInicio: 2010, anoFim: 2014, familia: "Fire", motores: ["1.0 8V Fire", "1.4 8V Fire"] },
      { geracao: "Novo Uno 2ª", anoInicio: 2014, anoFim: 2021, familia: "Fire Evo", motores: ["1.0 Fire Evo", "1.3 Firefly"] },
      { geracao: "Atual", anoInicio: 2021, anoFim: 2023, familia: "Firefly", motores: ["1.0 Firefly", "1.3 Firefly"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Siena",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 1996, anoFim: 2001, familia: "Fire", motores: ["1.0 8V Fire", "1.5 8V"] },
      { geracao: "2ª geração", anoInicio: 2001, anoFim: 2004, familia: "Fire", motores: ["1.0 8V Fire", "1.4 8V Fire"] },
      { geracao: "3ª geração", anoInicio: 2004, anoFim: 2012, familia: "Fire", motores: ["1.0 8V Fire", "1.4 8V Fire", "1.8 8V"] },
      { geracao: "Atual", anoInicio: 2012, anoFim: 2016, familia: "Fire Evo", motores: ["1.0 Fire Evo", "1.4 Fire Evo"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Strada",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 1998, anoFim: 2004, familia: "Fire", motores: ["1.5 8V", "1.6 8V"] },
      { geracao: "2ª geração", anoInicio: 2004, anoFim: 2012, familia: "Fire", motores: ["1.4 8V Fire", "1.8 8V"] },
      { geracao: "3ª geração", anoInicio: 2013, anoFim: 2020, familia: "Fire Evo", motores: ["1.4 Fire Evo", "1.8 E.torQ"] },
      { geracao: "Atual", anoInicio: 2020, anoFim: 2023, familia: "Firefly", motores: ["1.3 Firefly", "1.4 Firefly Turbo"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Punto",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2007, anoFim: 2009, familia: "Fire", motores: ["1.4 8V Fire", "1.8 8V"] },
      { geracao: "Facelift 1", anoInicio: 2009, anoFim: 2012, familia: "Fire", motores: ["1.4 8V Fire", "1.8 E.torQ"] },
      { geracao: "Facelift 2", anoInicio: 2012, anoFim: 2015, familia: "Fire Evo", motores: ["1.4 Fire Evo", "1.6 E.torQ"] },
      { geracao: "Final", anoInicio: 2015, anoFim: 2017, familia: "Fire Evo", motores: ["1.4 Fire Evo", "1.6 E.torQ"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Celta",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2000, anoFim: 2003, familia: "VHC", motores: ["1.0 8V VHC", "1.4 8V VHC"] },
      { geracao: "Facelift", anoInicio: 2003, anoFim: 2006, familia: "VHC", motores: ["1.0 8V VHC", "1.4 8V VHC"] },
      { geracao: "2ª geração", anoInicio: 2006, anoFim: 2011, familia: "VHCE", motores: ["1.0 8V VHCE", "1.4 8V VHCE Flexpower"] },
      { geracao: "Final", anoInicio: 2011, anoFim: 2016, familia: "VHCE", motores: ["1.0 8V VHCE", "1.4 8V VHCE Flexpower"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Corsa",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 1994, anoFim: 2000, familia: "VHC", motores: ["1.0 8V VHC", "1.6 8V VHC"] },
      { geracao: "2ª geração", anoInicio: 2000, anoFim: 2002, familia: "VHC", motores: ["1.0 8V VHC", "1.6 8V VHC"] },
      { geracao: "Facelift", anoInicio: 2002, anoFim: 2007, familia: "VHC", motores: ["1.0 8V VHC", "1.4 8V VHC", "1.8 8V"] },
      { geracao: "Final", anoInicio: 2007, anoFim: 2012, familia: "VHCE", motores: ["1.0 8V VHCE", "1.4 8V VHCE Flexpower"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Classic",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2003, anoFim: 2005, familia: "VHC", motores: ["1.0 8V VHC", "1.4 8V VHC"] },
      { geracao: "Facelift 1", anoInicio: 2005, anoFim: 2010, familia: "VHC", motores: ["1.0 8V VHC", "1.4 8V VHC"] },
      { geracao: "Facelift 2", anoInicio: 2010, anoFim: 2014, familia: "VHCE", motores: ["1.0 8V VHCE Economy", "1.4 8V VHCE Flexpower"] },
      { geracao: "Final", anoInicio: 2014, anoFim: 2016, familia: "VHCE", motores: ["1.0 8V VHCE Economy", "1.4 8V VHCE Flexpower"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Onix",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2012, anoFim: 2015, familia: "SPE4", motores: ["1.0 SPE4", "1.4 SPE4"] },
      { geracao: "Facelift", anoInicio: 2015, anoFim: 2019, familia: "SPE4", motores: ["1.0 SPE4", "1.4 SPE4"] },
      { geracao: "2ª geração", anoInicio: 2019, anoFim: 2022, familia: "Family 0", motores: ["1.0 Turbo Family 0", "1.0 Aspirado Family 0"] },
      { geracao: "Atual", anoInicio: 2022, anoFim: 2023, familia: "Family 0", motores: ["1.0 Turbo Family 0", "1.0 Aspirado Family 0"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Prisma",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2006, anoFim: 2013, familia: "VHCE", motores: ["1.0 8V VHCE", "1.4 8V VHCE Flexpower"] },
      { geracao: "2ª geração", anoInicio: 2013, anoFim: 2016, familia: "SPE4", motores: ["1.0 SPE4", "1.4 SPE4"] },
      { geracao: "Facelift", anoInicio: 2016, anoFim: 2019, familia: "SPE4", motores: ["1.0 SPE4", "1.4 SPE4"] },
      { geracao: "Final", anoInicio: 2019, anoFim: 2021, familia: "SPE4", motores: ["1.0 SPE4", "1.4 SPE4"] },
    ],
  },
  {
    montadora: "Ford",
    modelo: "Ka",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 1997, anoFim: 2000, familia: "Zetec Rocam", motores: ["1.0 Zetec Rocam", "1.3 Zetec Rocam"] },
      { geracao: "Facelift", anoInicio: 2000, anoFim: 2007, familia: "Zetec Rocam", motores: ["1.0 Zetec Rocam", "1.6 Zetec Rocam"] },
      { geracao: "Nova geração", anoInicio: 2014, anoFim: 2017, familia: "Dragon", motores: ["1.0 Ti-VCT Dragon", "1.5 Ti-VCT Dragon"] },
      { geracao: "Facelift atual", anoInicio: 2017, anoFim: 2021, familia: "Dragon", motores: ["1.0 Ti-VCT Dragon", "1.5 Ti-VCT Dragon"] },
    ],
  },
  {
    montadora: "Ford",
    modelo: "Fiesta",
    geracoes: [
      { geracao: "1ª geração BR", anoInicio: 2002, anoFim: 2005, familia: "Zetec Rocam", motores: ["1.0 Zetec Rocam", "1.6 Zetec Rocam"] },
      { geracao: "2ª geração BR", anoInicio: 2005, anoFim: 2012, familia: "Zetec Rocam", motores: ["1.0 Zetec Rocam", "1.6 Zetec Rocam"] },
      { geracao: "Nova geração", anoInicio: 2013, anoFim: 2017, familia: "Ti-VCT", motores: ["1.6 Ti-VCT", "1.0 EcoBoost"] },
      { geracao: "Final", anoInicio: 2017, anoFim: 2019, familia: "Ti-VCT", motores: ["1.6 Ti-VCT", "1.0 EcoBoost"] },
    ],
  },
  {
    montadora: "Ford",
    modelo: "EcoSport",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2003, anoFim: 2007, familia: "Zetec Rocam", motores: ["1.6 Zetec Rocam", "2.0 Zetec"] },
      { geracao: "Facelift", anoInicio: 2007, anoFim: 2012, familia: "Zetec Rocam", motores: ["1.6 Zetec Rocam", "2.0 Duratec"] },
      { geracao: "2ª geração", anoInicio: 2012, anoFim: 2017, familia: "Ti-VCT", motores: ["1.6 Ti-VCT", "2.0 Ti-VCT"] },
      { geracao: "Final", anoInicio: 2017, anoFim: 2021, familia: "Ti-VCT", motores: ["1.5 Ti-VCT", "2.0 Ti-VCT AWD"] },
    ],
  },
  {
    montadora: "Renault",
    modelo: "Sandero",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2007, anoFim: 2011, familia: "Energy", motores: ["1.0 16V Energy", "1.6 16V Energy"] },
      { geracao: "Facelift", anoInicio: 2011, anoFim: 2014, familia: "Energy", motores: ["1.0 16V Energy", "1.6 16V Energy"] },
      { geracao: "2ª geração", anoInicio: 2014, anoFim: 2017, familia: "SCe", motores: ["1.0 12V SCe", "1.6 16V Energy"] },
      { geracao: "Final", anoInicio: 2017, anoFim: 2020, familia: "SCe", motores: ["1.0 12V SCe", "1.6 16V SCe"] },
    ],
  },
  {
    montadora: "Renault",
    modelo: "Logan",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2007, anoFim: 2011, familia: "Energy", motores: ["1.0 16V Energy", "1.6 16V Energy"] },
      { geracao: "Facelift", anoInicio: 2011, anoFim: 2013, familia: "Energy", motores: ["1.0 16V Energy", "1.6 16V Energy"] },
      { geracao: "2ª geração", anoInicio: 2013, anoFim: 2017, familia: "SCe", motores: ["1.0 12V SCe", "1.6 16V Energy"] },
      { geracao: "Final", anoInicio: 2017, anoFim: 2021, familia: "SCe", motores: ["1.0 12V SCe", "1.6 16V SCe"] },
    ],
  },
  {
    montadora: "Renault",
    modelo: "Duster",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2011, anoFim: 2015, familia: "Energy", motores: ["1.6 16V Energy", "2.0 16V"] },
      { geracao: "Facelift", anoInicio: 2015, anoFim: 2019, familia: "SCe", motores: ["1.6 16V SCe", "2.0 16V"] },
      { geracao: "2ª geração", anoInicio: 2019, anoFim: 2021, familia: "SCe", motores: ["1.6 16V SCe", "2.0 16V"] },
      { geracao: "Atual", anoInicio: 2021, anoFim: 2023, familia: "SCe", motores: ["1.6 16V SCe", "2.0 16V"] },
    ],
  },
  {
    montadora: "Hyundai",
    modelo: "HB20",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2012, anoFim: 2015, familia: "Kappa", motores: ["1.0 Kappa", "1.6 Gamma"] },
      { geracao: "Facelift", anoInicio: 2015, anoFim: 2019, familia: "Kappa", motores: ["1.0 Kappa", "1.6 Gamma"] },
      { geracao: "2ª geração", anoInicio: 2019, anoFim: 2021, familia: "Kappa TGDI", motores: ["1.0 Kappa TGDI", "1.6 Gamma"] },
      { geracao: "Atual", anoInicio: 2021, anoFim: 2023, familia: "Kappa TGDI", motores: ["1.0 Kappa TGDI", "1.6 Gamma"] },
    ],
  },
  {
    montadora: "Toyota",
    modelo: "Corolla",
    geracoes: [
      { geracao: "9ª geração", anoInicio: 2003, anoFim: 2008, familia: "VVT-i", motores: ["1.6 VVT-i", "1.8 VVT-i"] },
      { geracao: "10ª geração", anoInicio: 2008, anoFim: 2014, familia: "Dual VVT-i", motores: ["1.8 Dual VVT-i", "2.0 Dual VVT-i"] },
      { geracao: "11ª geração", anoInicio: 2014, anoFim: 2019, familia: "Dual VVT-i", motores: ["1.8 Dual VVT-i", "2.0 Dual VVT-i"] },
      { geracao: "12ª geração", anoInicio: 2019, anoFim: 2023, familia: "Dynamic Force", motores: ["2.0 Dynamic Force", "1.8 Hybrid Dynamic Force"] },
    ],
  },
  {
    montadora: "Honda",
    modelo: "Civic",
    geracoes: [
      { geracao: "7ª geração", anoInicio: 2001, anoFim: 2006, familia: "SOHC VTEC", motores: ["1.7 SOHC VTEC"] },
      { geracao: "8ª geração", anoInicio: 2006, anoFim: 2011, familia: "SOHC i-VTEC", motores: ["1.8 SOHC i-VTEC", "2.0 SOHC i-VTEC"] },
      { geracao: "9ª geração", anoInicio: 2012, anoFim: 2016, familia: "SOHC i-VTEC", motores: ["1.8 SOHC i-VTEC", "2.0 SOHC i-VTEC"] },
      { geracao: "10ª geração", anoInicio: 2016, anoFim: 2021, familia: "Earth Dreams", motores: ["2.0 Earth Dreams", "1.5 Turbo Earth Dreams"] },
    ],
  },
  {
    montadora: "Honda",
    modelo: "Fit",
    geracoes: [
      { geracao: "1ª geração", anoInicio: 2003, anoFim: 2008, familia: "SOHC i-DSI", motores: ["1.4 SOHC i-DSI", "1.5 SOHC VTEC"] },
      { geracao: "2ª geração", anoInicio: 2008, anoFim: 2014, familia: "SOHC i-VTEC", motores: ["1.4 SOHC i-VTEC", "1.5 SOHC i-VTEC"] },
      { geracao: "3ª geração", anoInicio: 2015, anoFim: 2020, familia: "Earth Dreams", motores: ["1.5 Earth Dreams"] },
      { geracao: "Final", anoInicio: 2020, anoFim: 2021, familia: "Earth Dreams", motores: ["1.5 Earth Dreams"] },
    ],
  },
  {
    montadora: "Volkswagen",
    modelo: "Up!",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2014, anoFim: 2016, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.0 12V TSI EA111"] },
      { geracao: "Facelift", anoInicio: 2016, anoFim: 2019, familia: "EA111", motores: ["1.0 12V MPI EA111", "1.0 12V TSI EA111"] },
      { geracao: "2ª fase", anoInicio: 2019, anoFim: 2021, familia: "EA211", motores: ["1.0 12V MPI EA211", "1.0 12V TSI EA211"] },
      { geracao: "Final", anoInicio: 2021, anoFim: 2023, familia: "EA211", motores: ["1.0 12V TSI EA211"] },
    ],
  },
  {
    montadora: "Fiat",
    modelo: "Mobi",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2016, anoFim: 2018, familia: "Firefly", motores: ["1.0 Firefly"] },
      { geracao: "Facelift 1", anoInicio: 2018, anoFim: 2020, familia: "Firefly", motores: ["1.0 Firefly"] },
      { geracao: "Facelift 2", anoInicio: 2020, anoFim: 2022, familia: "Firefly", motores: ["1.0 Firefly", "1.0 Firefly Turbo"] },
      { geracao: "Atual", anoInicio: 2022, anoFim: 2023, familia: "Firefly", motores: ["1.0 Firefly", "1.0 Firefly Turbo"] },
    ],
  },
  {
    montadora: "Chevrolet",
    modelo: "Spin",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2012, anoFim: 2016, familia: "SPE4", motores: ["1.8 SPE4"] },
      { geracao: "Facelift", anoInicio: 2016, anoFim: 2019, familia: "SPE4", motores: ["1.8 SPE4", "1.8 SPE4 Flexpower"] },
      { geracao: "2ª fase", anoInicio: 2019, anoFim: 2021, familia: "Family I", motores: ["1.8 Family I"] },
      { geracao: "Final", anoInicio: 2021, anoFim: 2023, familia: "Family I", motores: ["1.8 Family I"] },
    ],
  },
  {
    montadora: "Nissan",
    modelo: "March",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2011, anoFim: 2014, familia: "HR", motores: ["1.0 HR10DE", "1.6 HR16DE"] },
      { geracao: "Facelift", anoInicio: 2014, anoFim: 2017, familia: "HR", motores: ["1.0 HR10DE", "1.6 HR16DE"] },
      { geracao: "2ª fase", anoInicio: 2017, anoFim: 2020, familia: "HR", motores: ["1.0 HR10DE", "1.6 HR16DE"] },
      { geracao: "Final", anoInicio: 2020, anoFim: 2022, familia: "HR", motores: ["1.6 HR16DE"] },
    ],
  },
  {
    montadora: "Nissan",
    modelo: "Versa",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2011, anoFim: 2014, familia: "HR", motores: ["1.6 HR16DE"] },
      { geracao: "Facelift", anoInicio: 2014, anoFim: 2017, familia: "HR", motores: ["1.6 HR16DE"] },
      { geracao: "2ª fase", anoInicio: 2017, anoFim: 2020, familia: "HR", motores: ["1.6 HR16DE"] },
      { geracao: "Atual", anoInicio: 2020, anoFim: 2023, familia: "HR", motores: ["1.6 HR16DE"] },
    ],
  },
  {
    montadora: "Peugeot",
    modelo: "208",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2013, anoFim: 2016, familia: "PureTech", motores: ["1.2 PureTech", "1.6 THP"] },
      { geracao: "Facelift", anoInicio: 2016, anoFim: 2019, familia: "PureTech", motores: ["1.2 PureTech", "1.6 THP"] },
      { geracao: "2ª fase", anoInicio: 2019, anoFim: 2021, familia: "PureTech", motores: ["1.6 THP"] },
      { geracao: "Atual", anoInicio: 2021, anoFim: 2023, familia: "PureTech", motores: ["1.6 THP"] },
    ],
  },
  {
    montadora: "Citroën",
    modelo: "C3",
    geracoes: [
      { geracao: "1ª geração BR", anoInicio: 2003, anoFim: 2006, familia: "TU", motores: ["1.4 TU3", "1.6 TU5"] },
      { geracao: "2ª geração BR", anoInicio: 2006, anoFim: 2012, familia: "TU", motores: ["1.4 TU3", "1.6 16V"] },
      { geracao: "3ª geração", anoInicio: 2012, anoFim: 2017, familia: "PureTech", motores: ["1.5 8V", "1.6 16V"] },
      { geracao: "Atual", anoInicio: 2017, anoFim: 2023, familia: "PureTech", motores: ["1.6 PureTech"] },
    ],
  },
  {
    montadora: "Toyota",
    modelo: "Etios",
    geracoes: [
      { geracao: "Lançamento", anoInicio: 2012, anoFim: 2015, familia: "Dual VVT-i", motores: ["1.3 Dual VVT-i", "1.5 Dual VVT-i"] },
      { geracao: "Facelift", anoInicio: 2015, anoFim: 2019, familia: "Dual VVT-i", motores: ["1.3 Dual VVT-i", "1.5 Dual VVT-i"] },
      { geracao: "2ª fase", anoInicio: 2019, anoFim: 2021, familia: "Dual VVT-i", motores: ["1.5 Dual VVT-i"] },
      { geracao: "Final", anoInicio: 2021, anoFim: 2021, familia: "Dual VVT-i", motores: ["1.5 Dual VVT-i"] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Marcas de peça fictícias — nunca marcas reais existentes.
// ---------------------------------------------------------------------------
const MARCAS_PECA = ["Vergueiro", "Tietê", "Pirajuçara", "Jaraguá", "Ibirapuera", "Anhembi"];

// Prefixo de código por marca — só pra dar cara de catálogo de peças de verdade.
const PREFIXO_MARCA = {
  Vergueiro: "VG",
  Tietê: "TT",
  Pirajuçara: "PJ",
  Jaraguá: "JG",
  Ibirapuera: "IB",
  Anhembi: "AN",
};

// ---------------------------------------------------------------------------
// Modelos de peça por categoria. linkType "modelo" liga a peça a uma geração
// inteira (todas as motorizações); "motor" liga a uma família de motor.
// ---------------------------------------------------------------------------
const TEMPLATES = {
  "Suspensão": {
    linkType: "modelo",
    itens: [
      { nome: "Amortecedor dianteiro", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
      { nome: "Amortecedor traseiro", posicoes: ["Traseira"] },
      { nome: "Bandeja de suspensão dianteira", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
      { nome: "Bieleta da barra estabilizadora", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
      { nome: "Coxim do amortecedor dianteiro", posicoes: ["Dianteira"] },
      { nome: "Mola helicoidal dianteira", posicoes: ["Dianteira"] },
      { nome: "Pivô de suspensão", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
    ],
  },
  "Freio": {
    linkType: "modelo",
    itens: [
      { nome: "Pastilha de freio dianteira", posicoes: ["Dianteira"] },
      { nome: "Pastilha de freio traseira", posicoes: ["Traseira"] },
      { nome: "Disco de freio dianteiro ventilado", posicoes: ["Dianteira"] },
      { nome: "Disco de freio traseiro sólido", posicoes: ["Traseira"] },
      { nome: "Cilindro de roda traseiro", posicoes: ["Traseira"] },
      { nome: "Cabo de freio de mão", posicoes: [""] },
      { nome: "Flexível de freio dianteiro", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
    ],
  },
  "Embreagem": {
    linkType: "modelo",
    itens: [
      { nome: "Kit de embreagem completo", posicoes: [""] },
      { nome: "Disco de embreagem", posicoes: [""] },
      { nome: "Platô de embreagem", posicoes: [""] },
      { nome: "Rolamento de embreagem", posicoes: [""] },
      { nome: "Cabo de embreagem", posicoes: [""] },
    ],
  },
  "Transmissão": {
    linkType: "modelo",
    itens: [
      { nome: "Homocinética dianteira", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
      { nome: "Coifa da homocinética", posicoes: ["Dianteira esquerda", "Dianteira direita"] },
      { nome: "Coxim do câmbio", posicoes: [""] },
      { nome: "Sincronizador de 2ª e 3ª marcha", posicoes: [""] },
      { nome: "Retentor de câmbio", posicoes: [""] },
    ],
  },
  "Motor": {
    linkType: "motor",
    itens: [
      { nome: "Correia dentada", posicoes: [""], especificidade: "motor" },
      { nome: "Kit de correia dentada com tensor", posicoes: [""], especificidade: "motor" },
      { nome: "Bomba d'água", posicoes: [""], especificidade: "motor" },
      { nome: "Junta do cabeçote", posicoes: [""], especificidade: "motor" },
      { nome: "Coxim do motor", posicoes: ["Dianteira", "Traseira"], especificidade: "familia" },
      { nome: "Bico injetor", posicoes: [""], especificidade: "motor" },
      { nome: "Sensor de posição do virabrequim", posicoes: [""], especificidade: "familia" },
      { nome: "Válvula de admissão", posicoes: [""], especificidade: "motor" },
    ],
  },
  "Elétrica": {
    linkType: "motor",
    itens: [
      { nome: "Alternador", posicoes: [""], especificidade: "familia" },
      { nome: "Motor de arranque", posicoes: [""], especificidade: "familia" },
      { nome: "Sensor de rotação", posicoes: [""], especificidade: "motor" },
      { nome: "Bateria 60Ah", posicoes: [""], especificidade: "familia" },
      { nome: "Chicote do injetor", posicoes: [""], especificidade: "motor" },
      { nome: "Bobina de ignição", posicoes: [""], especificidade: "motor" },
      { nome: "Jogo de velas de ignição", posicoes: [""], especificidade: "motor" },
    ],
  },
  "Filtros": {
    linkType: "motor",
    itens: [
      { nome: "Filtro de óleo", posicoes: [""], especificidade: "motor" },
      { nome: "Filtro de ar", posicoes: [""], especificidade: "familia" },
      { nome: "Filtro de combustível", posicoes: [""], especificidade: "familia" },
      { nome: "Filtro de cabine", posicoes: [""], especificidade: "familia" },
    ],
  },
  "Arrefecimento": {
    linkType: "motor",
    itens: [
      { nome: "Radiador de água", posicoes: [""], especificidade: "motor" },
      { nome: "Válvula termostática", posicoes: [""], especificidade: "motor" },
      { nome: "Mangueira superior do radiador", posicoes: [""], especificidade: "motor" },
      { nome: "Mangueira inferior do radiador", posicoes: [""], especificidade: "motor" },
      { nome: "Ventoinha do radiador", posicoes: [""], especificidade: "familia" },
      { nome: "Reservatório de água", posicoes: [""], especificidade: "familia" },
    ],
  },
};

const FAIXA_PRECO = {
  "Suspensão": [120, 480],
  "Freio": [60, 340],
  "Embreagem": [220, 890],
  "Transmissão": [140, 620],
  "Motor": [45, 520],
  "Elétrica": [90, 780],
  "Filtros": [24, 78],
  "Arrefecimento": [55, 340],
};

// ---------------------------------------------------------------------------
// PRNG determinístico (mulberry32) — dados reproduzíveis entre rodadas.
// ---------------------------------------------------------------------------
function criarRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = criarRng(20260729);
const escolher = (arr) => arr[Math.floor(rng() * arr.length)];
const embaralhar = (arr) => {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};
const inteiroEntre = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

// ---------------------------------------------------------------------------
// Monta os combos (montadora, modelo, geração, ano_inicio, ano_fim, motor) —
// a tabela de aplicação sem o código de peça ainda.
// ---------------------------------------------------------------------------
const combos = [];
const grupos = []; // { montadora, modelo, geracao, anoInicio, anoFim, combos: [...] } — uma geração
const modelos = new Map(); // "Montadora|Modelo" -> combos de TODAS as gerações — usado pelas categorias de chassi
const familias = new Map(); // "Montadora|Familia" -> [combo, ...] — motor pode variar entre os combos
const motoresExatos = new Map(); // "Montadora|Motor exato" -> [combo, ...] — todos com a MESMA motorização

for (const m of MODELOS) {
  const chaveModelo = `${m.montadora}|${m.modelo}`;
  if (!modelos.has(chaveModelo)) modelos.set(chaveModelo, []);

  for (const g of m.geracoes) {
    const combosDoGrupo = g.motores.map((motor) => ({
      montadora: m.montadora,
      modelo: m.modelo,
      geracao: g.geracao,
      anoInicio: g.anoInicio,
      anoFim: g.anoFim,
      motor,
    }));
    combos.push(...combosDoGrupo);
    grupos.push({
      montadora: m.montadora,
      modelo: m.modelo,
      geracao: g.geracao,
      anoInicio: g.anoInicio,
      anoFim: g.anoFim,
      combos: combosDoGrupo,
    });
    modelos.get(chaveModelo).push(...combosDoGrupo);

    const chaveFamilia = `${m.montadora}|${g.familia}`;
    if (!familias.has(chaveFamilia)) familias.set(chaveFamilia, []);
    familias.get(chaveFamilia).push(...combosDoGrupo);

    for (const combo of combosDoGrupo) {
      const chaveMotor = `${combo.montadora}|${combo.motor}`;
      if (!motoresExatos.has(chaveMotor)) motoresExatos.set(chaveMotor, []);
      motoresExatos.get(chaveMotor).push(combo);
    }
  }
}

console.log(`Combos de veículo gerados: ${combos.length}`);
console.log(`Grupos (montadora+modelo+geração): ${grupos.length}`);
console.log(`Modelos distintos: ${modelos.size}`);
console.log(`Famílias de motor distintas: ${familias.size}`);
console.log(`Motorizações exatas distintas: ${motoresExatos.size}`);

// ---------------------------------------------------------------------------
// Gera peças + aplicações.
// ---------------------------------------------------------------------------
const pecas = [];
const aplicacoes = [];
const contadorPorMarca = {};

function proximoCodigo(marca) {
  contadorPorMarca[marca] = (contadorPorMarca[marca] ?? 0) + 1;
  const num = String(contadorPorMarca[marca]).padStart(4, "0");
  return `${PREFIXO_MARCA[marca]}-${num}`;
}

function gerarPreco(categoria) {
  const [min, max] = FAIXA_PRECO[categoria];
  const valor = min + rng() * (max - min);
  return Math.round(valor * 100) / 100;
}

function formatarPrecoBR(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function linhaAplicacao(codigoPeca, combo) {
  return {
    codigo_peca: codigoPeca,
    montadora: combo.montadora,
    modelo: combo.modelo,
    geracao: combo.geracao,
    ano_inicio: combo.anoInicio,
    ano_fim: combo.anoFim,
    motor: combo.motor,
  };
}

function criarPeca({ categoria, nomeBase, posicao }) {
  const marca = escolher(MARCAS_PECA);
  const codigo = proximoCodigo(marca);
  const disponivel = rng() < 0.9;
  const preco = gerarPreco(categoria);
  const peca = {
    codigo,
    nome: nomeBase,
    categoria,
    marca_peca: marca,
    posicao: posicao || "",
    preco: formatarPrecoBR(preco),
    disponivel: disponivel ? "sim" : "não",
    equivalencias: [],
  };
  pecas.push(peca);
  return peca;
}

// --- Categorias ligadas ao MODELO INTEIRO (todas as gerações e motorizações
// daquele modelo — peça de chassi como amortecedor ou platô costuma atravessar
// facelifts que não mudam a plataforma) ---
for (const categoria of Object.keys(TEMPLATES)) {
  const template = TEMPLATES[categoria];
  if (template.linkType !== "modelo") continue;

  for (const [, combosDoModelo] of modelos) {
    const subset = embaralhar(template.itens).slice(0, inteiroEntre(4, Math.min(7, template.itens.length)));
    for (const item of subset) {
      const posicao = escolher(item.posicoes);
      const peca = criarPeca({ categoria, nomeBase: item.nome, posicao });
      for (const combo of combosDoModelo) {
        aplicacoes.push(linhaAplicacao(peca.codigo, combo));
      }
    }
  }
}

// --- Categorias ligadas ao MOTOR: item "familia" cobre toda a família (atravessa
// modelos da mesma montadora que compartilham bloco); item "motor" cobre só a
// motorização exata — é o que faz "trocar só o motor" mudar o resultado com o
// mesmo modelo e ano. ---
const AMOSTRA_MOTOR_EXATO = 20;
for (const categoria of Object.keys(TEMPLATES)) {
  const template = TEMPLATES[categoria];
  if (template.linkType !== "motor") continue;

  for (const item of template.itens) {
    if (item.especificidade === "familia") {
      for (const [, combosDaFamilia] of familias) {
        const posicao = escolher(item.posicoes);
        const peca = criarPeca({ categoria, nomeBase: item.nome, posicao });
        for (const combo of combosDaFamilia) {
          aplicacoes.push(linhaAplicacao(peca.codigo, combo));
        }
      }
    } else {
      const gruposMotor = embaralhar([...motoresExatos.values()]).slice(0, AMOSTRA_MOTOR_EXATO);
      for (const combosDoMotor of gruposMotor) {
        const posicao = escolher(item.posicoes);
        const peca = criarPeca({ categoria, nomeBase: item.nome, posicao });
        for (const combo of combosDoMotor) {
          aplicacoes.push(linhaAplicacao(peca.codigo, combo));
        }
      }
    }
  }
}

console.log(`Peças geradas: ${pecas.length}`);
console.log(`Linhas de aplicação geradas: ${aplicacoes.length}`);

// ---------------------------------------------------------------------------
// Equivalências: dentro do mesmo grupo (categoria+nome+posição), marcas
// diferentes viram equivalentes umas das outras (1 a 2 por peça).
// ---------------------------------------------------------------------------
const gruposEquivalencia = new Map();
for (const p of pecas) {
  const chave = `${p.categoria}|${p.nome}|${p.posicao}`;
  if (!gruposEquivalencia.has(chave)) gruposEquivalencia.set(chave, []);
  gruposEquivalencia.get(chave).push(p);
}
for (const [, grupo] of gruposEquivalencia) {
  if (grupo.length < 2) continue;
  for (const p of grupo) {
    const outras = grupo.filter((o) => o.codigo !== p.codigo);
    const qtd = Math.min(outras.length, inteiroEntre(1, 2));
    p.equivalencias = embaralhar(outras)
      .slice(0, qtd)
      .map((o) => o.codigo);
  }
}

// ---------------------------------------------------------------------------
// Uma peça "órfã" de propósito por categoria — sem aplicação cadastrada, só
// pra provar que ela continua achável por código (regra de robustez).
// ---------------------------------------------------------------------------
for (const categoria of Object.keys(TEMPLATES)) {
  const item = TEMPLATES[categoria].itens[0];
  criarPeca({ categoria, nomeBase: `${item.nome} (avulsa, sem compatibilidade cadastrada)`, posicao: "" });
}

// ---------------------------------------------------------------------------
// Serialização CSV
// ---------------------------------------------------------------------------
function csvEscape(valor) {
  const str = String(valor ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function paraCsv(linhas, colunas) {
  const cabecalho = colunas.join(",");
  const corpo = linhas.map((linha) => colunas.map((c) => csvEscape(linha[c])).join(","));
  return [cabecalho, ...corpo].join("\n") + "\n";
}

const pecasCsv = paraCsv(
  pecas.map((p) => ({ ...p, equivalencias: p.equivalencias.join(";") })),
  ["codigo", "nome", "categoria", "marca_peca", "posicao", "preco", "disponivel", "equivalencias"]
);

const aplicacoesCsv = paraCsv(aplicacoes, [
  "codigo_peca",
  "montadora",
  "modelo",
  "geracao",
  "ano_inicio",
  "ano_fim",
  "motor",
]);

writeFileSync(path.join(process.cwd(), "pecas.csv"), pecasCsv, "utf-8");
writeFileSync(path.join(process.cwd(), "aplicacoes.csv"), aplicacoesCsv, "utf-8");

console.log("Escrito: pecas.csv e aplicacoes.csv");
