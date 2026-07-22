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
 * Sobre
 */
export const CHURCH_EMAIL = "contato@irb.org.br"

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
  street: "SMSE Conj. 13 Lote 03 Casa 01",
  district: "Samambaia",
  city: "Brasília",
  state: "DF",
  zip: "72310-213",
}

/** One line, for reading on the page. Not for geocoding — see below. */
export const CHURCH_ADDRESS_FULL = `${CHURCH_ADDRESS.street} — ${CHURCH_ADDRESS.district}, ${CHURCH_ADDRESS.city} - ${CHURCH_ADDRESS.state}, ${CHURCH_ADDRESS.zip}`

export const CHURCH_NAME = "Igreja Reformada de Brasília"

/**
 * O que o mapa procura. Lidera pelo nome: assim que a igreja estiver
 * cadastrada no Google Maps, a busca devolve o próprio local (com marcador
 * nomeado) em vez de um palpite do geocodificador sobre SMSE/conjunto/lote.
 * O endereço fica como reforço, em vírgulas e sem travessão.
 */
export const CHURCH_ADDRESS_QUERY = `${CHURCH_NAME}, ${CHURCH_ADDRESS.street}, ${CHURCH_ADDRESS.district}, ${CHURCH_ADDRESS.city} - ${CHURCH_ADDRESS.state}, ${CHURCH_ADDRESS.zip}`

/**
 * Ponto exato do templo, "lat,lng". Endereços do DF (SMSE, conjunto, lote)
 * são mal interpretados pelo geocodificador do Google, então as coordenadas
 * têm precedência sobre o texto do endereço no mapa e na rota.
 * Para obter: Google Maps → botão direito no local → copiar coordenadas.
 * Vazio = volta a usar CHURCH_ADDRESS_QUERY.
 */
export const CHURCH_COORDS = ""

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
    title: "Estabelecimento",
    desc: "Deixamos de ser um congregação",
  },
  {
    year: "2026",
    title: "Crescimento",
    desc: "Expansão dos ministérios",
  },
]

export const CHURCH_COUNSEL = [
  { name: "Pr. Marcel Tavares", role: "Pastor", initials: "MT" },
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

/**
 * Articles of the Canons of Dort.
 *
 * As with the Belgic Confession, `summary` is an editorial paraphrase and NOT
 * the canonical text — the actual wording must come from an authoritative
 * Portuguese translation before publication. Numbering restarts within each
 * chapter, so `head` + `number` together identify an article.
 *
 * Each chapter also closes with a Rejection of Errors (Rejeição dos Erros),
 * which is not yet represented here.
 */
export const DORT_ARTICLES = [
  {
    head: "I",
    number: 1,
    title: "A justiça de Deus",
    summary:
      "Todos pecaram em Adão e se tornaram réus da maldição e da morte eterna. Deus não cometeria injustiça alguma se deixasse todo o gênero humano no pecado e sob a condenação.",
    refs: "Rm 3.19 · Rm 3.23 · Rm 6.23",
  },
  {
    head: "I",
    number: 6,
    title: "O eterno decreto de Deus",
    summary:
      "Que uns, no tempo, recebam o dom da fé e outros não, procede do eterno decreto de Deus, segundo o qual Ele abranda os corações dos eleitos e deixa os demais em sua própria malícia.",
    refs: "At 15.18 · Ef 1.11 · Rm 9.18",
  },
  {
    head: "I",
    number: 7,
    title: "A eleição",
    summary:
      "A eleição é o propósito imutável de Deus pelo qual, antes da fundação do mundo, escolheu em Cristo certo número de homens para a salvação — por pura graça e segundo o beneplácito de sua vontade, não porque fossem melhores ou mais dignos que outros.",
    refs: "Ef 1.4–6 · Rm 8.30",
  },
  {
    head: "I",
    number: 15,
    title: "A reprovação",
    summary:
      "Nem todos são eleitos: Deus, em seu eterno decreto, passou por outros, deixando-os na miséria em que por culpa própria se lançaram, e não lhes concedendo a fé salvadora. Nisto não é de modo algum autor do pecado, mas Juiz justo.",
    refs: "Rm 9.18 · Rm 11.7",
  },
  {
    head: "II",
    number: 3,
    title: "O valor infinito da morte de Cristo",
    summary:
      "A morte do Filho de Deus é sacrifício e satisfação única e perfeitíssima pelos pecados, de valor e preço infinitos, abundantemente suficiente para expiar os pecados do mundo inteiro.",
    refs: "1Jo 2.2",
  },
  {
    head: "II",
    number: 8,
    title: "A eficácia da morte de Cristo",
    summary:
      "Foi vontade de Deus que Cristo, pelo sangue da cruz, remisse eficazmente todos aqueles — e somente aqueles — que desde a eternidade foram eleitos e dados a Ele pelo Pai.",
    refs: "Jo 10.15 · Jo 17.9 · Ef 5.25",
  },
  {
    head: "III/IV",
    number: 1,
    title: "O homem criado e caído",
    summary:
      "O homem foi criado à imagem de Deus, reto em todas as suas afeições. Por instigação do diabo e por sua própria vontade privou-se desses dons, atraindo sobre si cegueira, trevas e perversidade de juízo.",
    refs: "Gn 1.26–27 · Ef 4.24 · Gn 3.6",
  },
  {
    head: "III/IV",
    number: 3,
    title: "A incapacidade total",
    summary:
      "Todos os homens são concebidos em pecado e nascem filhos da ira, incapazes de qualquer bem salvífico e mortos em seus pecados. Sem a graça regeneradora do Espírito Santo não podem nem querem voltar-se a Deus.",
    refs: "Ef 2.1–5 · Jo 3.5 · Jo 15.5",
  },
  {
    head: "III/IV",
    number: 11,
    title: "A obra da regeneração",
    summary:
      "Deus não apenas faz com que o evangelho seja pregado externamente: Ele abre o coração, penetra ao mais íntimo do homem, circuncida o coração, infunde novas qualidades na vontade e a torna, de morta, viva.",
    refs: "At 16.14 · Ez 36.26–27",
  },
  {
    head: "III/IV",
    number: 12,
    title: "A regeneração é obra sobrenatural",
    summary:
      "Esta regeneração não se opera apenas por persuasão externa. É obra sobrenatural, poderosíssima e ao mesmo tempo suavíssima, que não anula a vontade nem a violenta, mas a vivifica e a inclina.",
    refs: "Ef 1.19 · Fp 2.13",
  },
  {
    head: "V",
    number: 1,
    title: "Os remanescentes do pecado",
    summary:
      "Aqueles a quem Deus chama e regenera são livrados do domínio e da escravidão do pecado, mas não inteiramente, nesta vida, da carne e do corpo do pecado.",
    refs: "Rm 7.18–23",
  },
  {
    head: "V",
    number: 3,
    title: "A fraqueza dos fiéis",
    summary:
      "Por causa dos remanescentes da corrupção e das tentações do mundo, os convertidos não poderiam permanecer na graça se fossem abandonados às próprias forças.",
    refs: "1Pe 5.8 · Sl 51",
  },
  {
    head: "V",
    number: 8,
    title: "A perseverança é obra de Deus",
    summary:
      "Não por seus próprios méritos ou forças, mas pela gratuita misericórdia de Deus, os eleitos não caem total nem finalmente da graça, nem se perdem definitivamente.",
    refs: "Jo 10.28–29 · Fp 1.6",
  },
]

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

/**
 * Articles of the Belgic Confession.
 *
 * `summary` is an editorial paraphrase, NOT the confessional text — the wording
 * of the articles themselves still has to be taken from an authoritative
 * Portuguese translation before this page can claim to reproduce them.
 * Only a subset is present so far; the page renders whatever is listed here.
 */
export const BELGIC_CONFESSION_ARTICLES = [
  {
    number: 1,
    title: "Que há um só Deus",
    summary:
      "Há um só Deus, ser único e simples, espiritual, eterno, incompreensível, invisível, imutável, infinito, todo-poderoso, perfeitamente sábio, justo e bom — fonte transbordante de todo bem.",
    refs: "Dt 6.4 · 1Co 8.6",
  },
  {
    number: 2,
    title: "Como Deus se dá a conhecer",
    summary:
      "Conhecemos a Deus por dois meios: pela criação, conservação e governo do mundo, que diante de nossos olhos é como um livro elegantíssimo; e, mais clara e plenamente, por sua santa e divina Palavra.",
    refs: "Sl 19.1–2 · Rm 1.20 · Hb 1.1",
  },
  {
    number: 3,
    title: "Da Palavra escrita de Deus",
    summary:
      "A Palavra de Deus não veio por vontade humana: homens santos falaram movidos pelo Espírito Santo, e depois Deus quis que ela fosse posta por escrito para nós.",
    refs: "2Pe 1.21 · 2Tm 3.16",
  },
  {
    number: 4,
    title: "Os livros canônicos",
    summary:
      "A Sagrada Escritura compreende os livros do Antigo e do Novo Testamento, aqui enumerados, contra os quais nada se pode alegar.",
    refs: "Ef 2.20 · Ap 22.18–19",
  },
  {
    number: 5,
    title: "A autoridade da Escritura",
    summary:
      "Recebemos estes livros como santos e canônicos não porque a igreja os aceite, mas porque o próprio Espírito Santo testifica em nossos corações que procedem de Deus.",
    refs: "Jo 10.27 · 1Ts 2.13",
  },
  {
    number: 6,
    title: "Livros canônicos e apócrifos",
    summary:
      "Distinguimos os livros canônicos dos apócrifos: estes podem ser lidos com proveito, mas deles não se pode extrair prova alguma em matéria de fé.",
    refs: "2Tm 3.16–17",
  },
  {
    number: 7,
    title: "A suficiência da Escritura",
    summary:
      "A Escritura contém plenamente a vontade de Deus e tudo quanto é necessário à salvação. Não é lícito acrescentar-lhe nem tirar-lhe coisa alguma, nem igualar a ela costume, autoridade ou concílio.",
    refs: "Gl 1.8 · 2Tm 3.16–17 · Dt 12.32",
  },
  {
    number: 8,
    title: "Deus é um em essência e três em pessoas",
    summary:
      "Segundo esta verdade, cremos em um só Deus, que é uma só essência, na qual há três pessoas realmente distintas e desde a eternidade: o Pai, o Filho e o Espírito Santo.",
    refs: "Mt 28.19 · 2Co 13.13",
  },
  {
    number: 16,
    title: "Da eleição eterna",
    summary:
      "Estando toda a descendência de Adão caída em perdição, Deus mostrou-se misericordioso, elegendo em Jesus Cristo aqueles que, por seu eterno e imutável conselho, escolheu por pura bondade — sem qualquer consideração de suas obras.",
    refs: "Rm 9.11–16 · Ef 1.4",
  },
  {
    number: 22,
    title: "Da justificação pela fé",
    summary:
      "O Espírito Santo acende em nós a verdadeira fé, que abraça Jesus Cristo com todos os seus méritos. A fé é o instrumento pelo qual permanecemos unidos a Ele; a justiça é dele, não nossa.",
    refs: "Rm 3.28 · Ef 2.8",
  },
  {
    number: 29,
    title: "Das marcas da verdadeira igreja",
    summary:
      "As marcas pelas quais se reconhece a verdadeira igreja são três: a pregação pura do evangelho, a administração pura dos sacramentos como Cristo os instituiu, e o exercício da disciplina eclesiástica na correção dos pecados.",
    refs: "Ef 2.20 · Mt 18.15–17",
  },
  {
    number: 37,
    title: "Do juízo final",
    summary:
      "Cremos que, cumprido o tempo ordenado pelo Senhor, Cristo virá do céu corporalmente e com glória para se declarar Juiz de vivos e mortos — consolo grande para os fiéis e terror para os ímpios.",
    refs: "Mt 25.31–46 · 2Ts 1.7–10",
  },
]

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
 * Agenda
 */
