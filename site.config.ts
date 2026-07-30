export const site = {
  name: "Anhanguera Autopeças",
  shortName: "Anhanguera",
  tagline: "Diga o carro. A peça certa aparece.",
  promise: "Diga o carro. A peça certa aparece.",
  descricao:
    "Distribuidora de linha leve em Osasco/SP. Balcão de manhã, entrega de tarde para oficinas da Grande São Paulo.",
  bairro: "Presidente Altino",
  cidade: "Osasco",
  uf: "SP",
  endereco: {
    logradouro: "Avenida dos Autonomistas, 3140",
    complemento: "Presidente Altino",
    cidadeUf: "Osasco/SP",
    cep: "06090-010",
    mapsQuery: "Avenida dos Autonomistas 3140 Presidente Altino Osasco",
  },
  telefone: "(11) 4226-7810",
  telefoneHref: "tel:+551142267810",
  whatsapp: {
    numero: "5511976543210",
    display: "(11) 97654-3210",
    mensagemPadrao: "Oi! Preciso de uma peça e queria confirmar disponibilidade.",
  },
  horario: [
    { dias: "Segunda a sexta", turno: "7h30 às 18h" },
    { dias: "Sábado", turno: "8h às 12h30" },
    { dias: "Domingo", turno: "fechado" },
  ],
  nav: [
    { href: "/", label: "Início" },
    { href: "/pecas", label: "Peças" },
    { href: "/atendimento", label: "Atendimento" },
  ],
  url: "https://distribuidora-autopecas.vercel.app",
  locale: "pt_BR",
} as const;

export function whatsappHref(mensagem?: string): string {
  const texto = encodeURIComponent(mensagem ?? site.whatsapp.mensagemPadrao);
  return `https://wa.me/${site.whatsapp.numero}?text=${texto}`;
}
