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

  /**
   * Este endereço é peça de portfólio antes de ser site de negócio, e desde
   * 08/09/2026 o metadado diz isso. A página já declarava a ficção em letra
   * visível; título, descrição e cartão de link não declaravam — então os
   * dados inventados circulavam sem ressalva em resultado de busca e em
   * prévia de link, que é a camada que o autor não controla depois que o
   * buscador guarda.
   *
   * `competencia` é a mesma linha que a peça carrega no manifesto do hub.
   * Repetida aqui de propósito: enquanto as duas superfícies não lerem do
   * mesmo arquivo, o texto idêntico é o que impede que elas divirjam.
   */
  portfolio: {
    sufixo: "peça de portfólio",
    ressalva: "Negócio fictício — peça de portfólio de Gabriel Barreto.",
    competencia:
      "Busca em cascata sobre catálogo real, com duas fontes atrás de uma interface só.",
    hub: "https://aether-data-steel.vercel.app",
  },
} as const;

export function whatsappHref(mensagem?: string): string {
  const texto = encodeURIComponent(mensagem ?? site.whatsapp.mensagemPadrao);
  return `https://wa.me/${site.whatsapp.numero}?text=${texto}`;
}
