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

export const BELGIC_CONFESSION_CHAPTERS = [
  {
    range: "I–VIII",
    title: "Deus e Trindade",
    desc: "A natureza de Deus, a revelação e as Escrituras.",
  },
  {
    range: "IX–XI",
    title: "Pessoas Divinas",
    desc: "A doutrina da Trindade e os testemunhos bíblicos.",
  },
  {
    range: "XII–XV",
    title: "Criação e Queda",
    desc: "A criação, providência, pecado original e corrupção.",
  },
  {
    range: "XVI–XXIV",
    title: "Salvação",
    desc: "Eleição, redenção, justificação e santificação.",
  },
  {
    range: "XXV–XXIX",
    title: "A Igreja",
    desc: "Marcas da verdadeira igreja, governo e disciplina.",
  },
  {
    range: "XXX–XXXV",
    title: "Governo & Culto",
    desc: "Ministros, sacramentos e o governo eclesiástico.",
  },
  {
    range: "XXXVI–XXXVII",
    title: "Estado & Escatologia",
    desc: "O magistrado civil e o julgamento final.",
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
 * Agenda
 */
