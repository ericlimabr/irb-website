export * from "./mockups"

/**
 * Home Page
 */
export const MORNING_LITURGY_TIME = "09h00"
export const AFTERNOON_LITURGY_TIME = "17h00"
export const WEEKLY_STUDY_TIME = "20h00"

export const SCHEDULE_DATA = [
  {
    day: "Domingos",
    dateDay: "DOM",
    dateMonth: "Semanal",
    eyebrow: "Culto",
    title: "Culto Matutino",
    meta: `Domingos · ${MORNING_LITURGY_TIME}`,
    desc: "Pregação expositiva, canto de salmos e hinos, oração e sacramentos.",
  },
  {
    day: "Domingos",
    dateDay: "DOM",
    dateMonth: "Semanal",
    eyebrow: "Educação",
    title: "Escola Dominical",
    meta: "Domingos · 10h20",
    desc: "Instrução bíblica para todas as idades antes do culto principal.",
  },
  {
    day: "Domingos",
    dateDay: "DOM",
    dateMonth: "Semanal",
    eyebrow: "Culto",
    title: "Culto Vespertino",
    meta: `Domingos · ${AFTERNOON_LITURGY_TIME}`,
    desc: "Pregação expositiva, canto de salmos e hinos, oração e sacramentos.",
  },
  {
    day: "Quintas",
    dateDay: "QUI",
    dateMonth: "Semanal",
    eyebrow: "Estudo",
    title: "Estudo Bíblico",
    meta: `Quintas · ${WEEKLY_STUDY_TIME}`,
    desc: "Estudo detalhado dos Salmos e aplicação à vida cristã.",
  },
  /*{
    dateDay: "15",
    dateMonth: "Mar",
    eyebrow: "Conferência",
    title: "Conferência de Teologia Reformada",
    meta: "Sábado · 09h00 — 17h00",
  },*/
]

/**
 * Domínio da igreja — fonte única. Hostname puro (sem protocolo) para
 * comparações de host; CHURCH_SITE_URL acrescenta o protocolo para links,
 * metadados e OG. Alterar aqui atualiza e-mail, subdomínios e URLs canônicas.
 */
export const CHURCH_DOMAIN = "irbrasilia.org"
export const CHURCH_SITE_URL = `https://${CHURCH_DOMAIN}`

/**
 * Sobre
 */
export const CHURCH_EMAIL = `contato@${CHURCH_DOMAIN}`

/**
 * Country + area code + number, digits only — the format wa.me expects.
 * This is the pastor's personal line (DDD 22, not Brasília's 61).
 */
export const CHURCH_WHATSAPP = "5522997879537"
export const CHURCH_WHATSAPP_GREETING =
  "Olá! Gostaria de saber mais sobre a Igreja Reformada de Brasília."

/**
 * Endereço — fonte única. Alterar aqui atualiza /contato, /sobre e o mapa.
 */
export const CHURCH_ADDRESS = {
  street: "St. Hoteleiro Projeção I s/nº",
  district: "Taguatinga",
  city: "Brasília",
  state: "DF",
  zip: "72015-025",
}

/** One line, for reading on the page. Not for geocoding — see below. */
export const CHURCH_ADDRESS_FULL = `${CHURCH_ADDRESS.street} — ${CHURCH_ADDRESS.district}, ${CHURCH_ADDRESS.city} - ${CHURCH_ADDRESS.state}, ${CHURCH_ADDRESS.zip}`

export const CHURCH_NAME = "Igreja Reformada de Brasília"

/**
 * O que o mapa procura. Lidera pelo nome: assim que a igreja estiver
 * cadastrada no Google Maps, a busca devolve o próprio local (com marcador
 * nomeado) em vez de um palpite do geocodificador sobre Setor
 * Hoteleiro/projeção/s/nº.
 * O endereço fica como reforço, em vírgulas e sem travessão.
 */
export const CHURCH_ADDRESS_QUERY = `${CHURCH_NAME}, ${CHURCH_ADDRESS.street}, ${CHURCH_ADDRESS.district}, ${CHURCH_ADDRESS.city} - ${CHURCH_ADDRESS.state}, ${CHURCH_ADDRESS.zip}`

/**
 * Ponto exato do templo, "lat,lng". Endereços de setor do DF (Setor
 * Hoteleiro, projeção, s/nº) são mal interpretados pelo geocodificador do
 * Google, então as coordenadas têm precedência sobre o texto do endereço
 * no mapa e na rota.
 * Para obter: Google Maps → botão direito no local → copiar coordenadas.
 * Vazio = volta a usar CHURCH_ADDRESS_QUERY.
 */
export const CHURCH_COORDS = "-15.8343599,-48.053391"

/**
 * Perguntas Frequentes — alimenta a página /perguntas-frequentes e o FAQPage
 * schema (components/seo/FaqJsonLd.tsx). Respostas em "definição primeiro":
 * começam pela resposta direta, formato que ranqueia bem e que as IAs citam.
 * Endereço e horários vêm dos consts acima, para não divergir do resto do site.
 */
export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "O que é uma Igreja Reformada?",
    answer:
      "Uma igreja reformada é uma igreja cristã protestante enraizada na Reforma do século XVI e definida por confissões de fé históricas. Ela sustenta a autoridade suprema das Escrituras, a soberania de Deus na salvação e a justificação somente pela fé — convicções resumidas nos cinco solas da Reforma: somente a Escritura, somente a graça, somente a fé, somente Cristo e glória somente a Deus. A Igreja Reformada de Brasília se identifica com essa herança.",
  },
  {
    question: "Qual a diferença entre igreja reformada e igreja presbiteriana?",
    answer:
      "Ambas são reformadas e compartilham as mesmas convicções centrais; a diferença está nas confissões que adotam e na origem. As igrejas presbiterianas, de origem britânica, adotam os Símbolos de Fé de Westminster. As igrejas reformadas continentais, de origem europeia, adotam as Três Formas de Unidade: a Confissão Belga, o Catecismo de Heidelberg e os Cânones de Dort. A Igreja Reformada de Brasília segue esta tradição reformada continental.",
  },
  {
    question: "O que são as Três Formas de Unidade?",
    answer:
      "São os três documentos confessionais das igrejas reformadas continentais: a Confissão Belga (1561), com 37 artigos que expõem a fé; o Catecismo de Heidelberg (1563), com 129 perguntas e respostas sobre o único consolo do cristão; e os Cânones de Dort (1619), que resumem a doutrina da graça soberana. Juntos, definem o que a igreja crê e ensina.",
  },
  {
    question: "A igreja é calvinista? O que são os cinco pontos (Cânones de Dort)?",
    answer:
      "Sim, no sentido histórico e confessional. Os cinco pontos do calvinismo, ou cinco pontos da graça, foram formulados no Sínodo de Dort (1618–1619) e ensinam que a salvação é obra de Deus do princípio ao fim: depravação total, eleição incondicional, expiação definida, graça eficaz e perseverança dos santos. Eles exaltam a soberania de Deus e a suficiência da sua graça.",
  },
  {
    question: "Como são os cultos e quais os horários?",
    answer: `Reunimo-nos aos domingos para o Culto Matutino às ${MORNING_LITURGY_TIME} e o Culto Vespertino às ${AFTERNOON_LITURGY_TIME}, com Escola Dominical às 10h20. Às quintas há Estudo Bíblico às ${WEEKLY_STUDY_TIME}. Os cultos têm pregação expositiva da Palavra, canto de salmos e hinos, oração e a administração dos sacramentos.`,
  },
  {
    question: "Onde fica a igreja e como chegar?",
    answer: `A Igreja Reformada de Brasília fica em ${CHURCH_ADDRESS_FULL}. Na página de contato há um mapa e a rota; se preferir, fale conosco pelo WhatsApp para orientações de como chegar.`,
  },
  {
    question: "Preciso ser membro para visitar? Como faço minha primeira visita?",
    answer:
      "Não é preciso ser membro nem avisar com antecedência: visitantes são bem-vindos em todos os cultos. Basta comparecer. Se quiser, mande uma mensagem pelo WhatsApp antes — teremos prazer em recebê-lo e orientar sobre horário e localização.",
  },
  {
    question: "Vocês cantam salmos? Como é a adoração?",
    answer:
      "Sim. A adoração é bíblica e reverente: canto de salmos e hinos, leitura e pregação expositiva das Escrituras, oração e a administração dos sacramentos. O propósito do culto é adorar a Deus conforme a sua Palavra.",
  },
  {
    question: "O que é pregação expositiva?",
    answer:
      "Pregação expositiva é o método em que o pregador explica o próprio texto bíblico dentro do seu contexto, deixando a passagem determinar o conteúdo da mensagem, em vez de partir de um tema escolhido de fora. É a forma central de pregação nos nossos cultos.",
  },
  {
    question: "Como entro em contato com a igreja?",
    answer:
      "Você pode falar conosco pelo WhatsApp ou pelo formulário na página de contato. Respondemos assim que possível e teremos prazer em ajudar com dúvidas sobre a fé, visitas ou horários de culto.",
  },
]

export const CHURCH_HISTORY_TIMELINE = [
  {
    year: "2015",
    title: "Fundação",
    desc: "Primeiros cultos em Brasília",
  },
  {
    year: "2017",
    title: "Organização",
    desc: "Estabelecimento do conselho",
  },
  {
    year: "2022",
    title: "Instituição",
    desc: "Deixamos de ser uma congregação",
  },
  {
    year: "2026",
    title: "Crescimento",
    desc: "Expansão dos ministérios",
  },
]

export const CHURCH_COUNSEL = [
  { name: "Pr. Marcel Tavares", role: "Pastor", initials: "MT" },
  { name: "Pr. Iraldo Luna", role: "Pastor", initials: "IL" },
  { name: "André Lima", role: "Presbítero", initials: "AL" },
  { name: "Thiago Montenegro", role: "Presbítero", initials: "TM" },
  { name: "William Bessa", role: "Diácono", initials: "WB" },
]

/**
 * Consifissões
 */
/**
 * Canons of Dort.
 *
 * The Canons are organised in FOUR chapters covering five heads of doctrine —
 * the third and fourth heads were treated together in the original document.
 * `tulip` cross-references the later English mnemonic in TULIP_DATA, whose
 * ordering (T-U-L-I-P) is not the ordering of the Canons themselves.
 */
export const DORT_CHAPTERS = [
  {
    head: "I",
    tulip: "U",
    title: "Da Eleição e Reprovação Divinas",
    articles: 18,
    desc: "A eleição não se funda em fé ou obras previstas, mas no beneplácito soberano de Deus.",
  },
  {
    head: "II",
    tulip: "L",
    title: "Da Morte de Cristo e da Redenção Humana por Ela",
    articles: 9,
    desc: "O valor infinito da morte de Cristo e sua eficácia para aqueles que o Pai lhe deu.",
  },
  {
    head: "III/IV",
    tulip: "T · I",
    title: "Da Corrupção Humana e da Conversão a Deus",
    articles: 17,
    desc: "A incapacidade total do homem e a obra sobrenatural do Espírito na conversão.",
  },
  {
    head: "V",
    tulip: "P",
    title: "Da Perseverança dos Santos",
    articles: 15,
    desc: "Os eleitos jamais caem total ou finalmente da graça de Deus.",
  },
]

export {
  DORT_ARTICLES,
  DORT_REJECTIONS,
  DORT_CONCLUSION,
} from "./confessions/dort"
export type {
  DortArticle,
  DortError,
  DortRejection,
  DortConclusion,
} from "./confessions/dort"

export const TULIP_DATA = [
  {
    letter: "T",
    latin: "Corruptio",
    title: "Depravação Total",
    verse: "Rm 3.10–12",
    desc: "O homem, em seu estado natural, está morto em delitos e pecados, totalmente incapaz de contribuir para sua própria salvação.",
  },
  {
    letter: "U",
    latin: "Electio",
    title: "Eleição Incondicional",
    verse: "Ef 1.4–5",
    desc: "Deus, antes da fundação do mundo, elegeu um povo para si, não com base em qualquer mérito previsto, mas segundo o beneplácito de sua vontade.",
  },
  {
    letter: "L",
    latin: "Expiatio",
    title: "Expiação Definida",
    verse: "Jo 10.15",
    desc: "Cristo morreu eficazmente por seu povo escolhido, assegurando plenamente a salvação de todos aqueles por quem intercede.",
  },
  {
    letter: "I",
    latin: "Gratia",
    title: "Graça Irresistível",
    verse: "Jo 6.37",
    desc: "O Espírito Santo aplica eficazmente a redenção aos eleitos, renovando seus corações e trazendo-os à fé e ao arrependimento.",
  },
  {
    letter: "P",
    latin: "Perseverantia",
    title: "Perseverança dos Santos",
    verse: "Jo 10.28–29",
    desc: "Aqueles a quem Deus elegeu, Cristo redimiu e o Espírito regenerou, jamais cairão total ou finalmente da graça.",
  },
]

export const TIMELINE_DATA = [
  { year: "325", title: "Concílio de Nicéia", highlight: true },
  { year: "450", title: "Concílio de Calcedônia", highlight: true },
  { year: "1517", title: "95 Teses de Lutero", highlight: false },
  { year: "1536", title: "Institutas de Calvino", highlight: false },
  { year: "1561", title: "Confissão Belga", highlight: true },
  { year: "1563", title: "Catecismo de Heidelberg", highlight: true },
  { year: "1566", title: "2ª Confissão Helvética", highlight: false },
  { year: "1618", title: "Sínodo de Dort", highlight: false },
  { year: "1619", title: "Cânones de Dort", highlight: true },
  { year: "1681", title: "Publicação NT, Almeida", highlight: false },
  { year: "1694", title: "Tradução completa AT, Almeida", highlight: false },
  { year: "1753", title: "Publicação da Biblia em Português", highlight: true },
]

/**
 * `from`/`to` are the article numbers each thematic group covers, so a given
 * article can be mapped to its group without re-stating the ranges.
 */
export const BELGIC_CONFESSION_CHAPTERS = [
  {
    range: "I–VIII",
    from: 1,
    to: 8,
    title: "Deus e Trindade",
    desc: "A natureza de Deus, a revelação e as Escrituras.",
  },
  {
    range: "IX–XI",
    from: 9,
    to: 11,
    title: "Pessoas Divinas",
    desc: "A doutrina da Trindade e os testemunhos bíblicos.",
  },
  {
    range: "XII–XV",
    from: 12,
    to: 15,
    title: "Criação e Queda",
    desc: "A criação, providência, pecado original e corrupção.",
  },
  {
    range: "XVI–XXIV",
    from: 16,
    to: 24,
    title: "Salvação",
    desc: "Eleição, redenção, justificação e santificação.",
  },
  {
    range: "XXV–XXIX",
    from: 25,
    to: 29,
    title: "A Igreja",
    desc: "Marcas da verdadeira igreja, governo e disciplina.",
  },
  {
    range: "XXX–XXXV",
    from: 30,
    to: 35,
    title: "Governo & Culto",
    desc: "Ministros, sacramentos e o governo eclesiástico.",
  },
  {
    range: "XXXVI–XXXVII",
    from: 36,
    to: 37,
    title: "Estado & Escatologia",
    desc: "O magistrado civil e o julgamento final.",
  },
]

export { BELGIC_CONFESSION_ARTICLES } from "./confessions/belgic"
export type { BelgicArticle } from "./confessions/belgic"

export const HEIDELBERG_CATECHISM_SECTIONS = [
  {
    part: "I",
    title: "Miséria",
    range: "Dom. I–IV · Prgs. 1–11",
    question: "Quão grande é o teu pecado e miséria?",
    bg: "bg-navy-800",
  },
  {
    part: "II",
    title: "Redenção",
    range: "Dom. V–XXXI · Prgs. 12–85",
    question: "Como és livre de tua miséria?",
    bg: "bg-navy-700",
  },
  {
    part: "III",
    title: "Gratidão",
    range: "Dom. XXXII–LII · Prgs. 86–129",
    question: "Como agradecemos a Deus?",
    bg: "bg-navy-600",
  },
]

export { HEIDELBERG_CATECHISM_DATA } from "./confessions/heidelberg"
export type { HeidelbergSunday, HeidelbergQA } from "./confessions/heidelberg"

/**
 * Route titles used by the back bar — both for the page it sits on and for
 * labelling the page it returns to. Unlisted routes fall back to "Voltar".
 */
export const PAGE_TITLES: Record<string, string> = {
  "/": "Início",
  "/sobre": "Sobre a Igreja",
  "/confissoes": "Três Formas de Unidade",
  "/catecismo": "Catecismo de Heidelberg",
  "/confissao-belga": "Confissão Belga",
  "/canones-de-dort": "Cânones de Dort",
  "/doutrina": "Doutrina Reformada",
  "/ministerios": "Ministérios",
  "/contato": "Contato",
  "/galeria": "Galeria",
  "/media": "Sermões & Mídia",
  "/agenda": "Agenda",
  "/biblioteca": "Biblioteca",
  "/blog": "Blog",
  "/blog/a-soberania-de-deus-na-eleicao": "A Soberania de Deus na Eleição",
}

/**
 * Ministérios — single source of truth.
 *
 * Rendered in two shapes: the home page lists each as a compact horizontal
 * card (`tag` + `title` + `summary`), while /ministerios renders the full
 * block (`desc` + `cta`). Flipping `listable` hides a ministry from BOTH.
 */
interface ChurchMinistry {
  tag: string
  title: string
  summary: string
  desc: string
  cta: string
  listable: boolean
  /** Where the CTA leads. Defaults to WhatsApp with the ministry named. */
  href?: string
  /** Photo for the /ministerios block. Falls back to the gradient when absent. */
  image?: string
}

export const CHURCH_MINISTRIES: ChurchMinistry[] = [
  {
    tag: "Educação",
    title: "Catequese",
    summary: "Formação confessional",
    desc: "Programa de instrução confessional para novos membros e jovens. Estudamos as Três Formas de Unidade, os fundamentos da doutrina reformada e a aplicação prática da fé.",
    cta: "Participar da Catequese",
    listable: true,
  },
  {
    tag: "Estudo",
    title: "Grupos de Estudo Bíblico",
    summary: "Estudo bíblico semanal",
    desc: "Encontros semanais para estudo aprofundado das Escrituras em pequenos grupos. Método expositivo, livro a livro, com ênfase na teologia bíblica e aplicação à vida cristã.",
    cta: "Entrar em um Grupo",
    listable: true,
    image: "/galery/1/IMG-20260312-WA0083.jpg",
  },
  {
    tag: "Assistência",
    title: "Diaconia & Misericórdia",
    summary: "Serviço ao próximo",
    desc: "Ministério de misericórdia dedicado ao cuidado prático da congregação e da comunidade — apoio a famílias necessitadas, visitas hospitalares e ações de compaixão.",
    cta: "Contribuir",
    listable: false,
  },
  {
    tag: "Famílias",
    title: "Ministério Familiar",
    summary: "Famílias na aliança",
    desc: "Apoio às famílias na tradição reformada — criação dos filhos na aliança, catequese familiar, aconselhamento matrimonial e comunhão entre famílias da congregação.",
    cta: "Saber Mais",
    listable: false,
  },
]

/**
 * Testimonials — real member citations. Rendered in random order by the
 * Testimonials section (components/layout/Testimonials.tsx).
 */
export const TESTIMONIALS = [
  {
    quote: "Exposição fiel das Escrituras, culto centrado na Palavra de Deus!",
    name: "Letícia Côrtes",
  },
  {
    quote:
      "Igreja fiel, confessional! Pela graça de Deus o culto prestado na IRB não passa daquilo que Ele mesmo ordenou nas Sagradas Escrituras. Sintam-se bem-vindos.",
    name: "Bruno Lima",
  },
  {
    quote:
      "Uma igreja com foco na Palavra de Deus, formada por pecadores que confiam somente no Senhor Jesus Cristo como sua justiça perante Deus; e assim buscam viver para glorificar Aquele que os comprou. Uma igreja hospitaleira, fiel e simples. Ser membro é realmente levado à sério.",
    name: "André Lima",
  },
]

/**
 * Agenda
 */
