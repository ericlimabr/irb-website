export const website_config_variables = {
  email: {
    active: true,
  },
  blog: {
    active: false,
  },
  media: {
    active: false,
  },
  agenda: {
    active: false,
  },
  library: {
    active: false,
  },
  // A pagina /conferencia entra no sitemap e pede indexacao. Ligada em
  // 19/10/2026: a chave Pix esta no ambiente de producao (inscricao de teste
  // gerou o BR Code na tela) e a conferencia e em 7 e 8 de novembro.
  conferencia: {
    active: true,
  },
}
