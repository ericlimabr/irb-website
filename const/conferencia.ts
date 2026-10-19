/**
 * 2ª Conferência Reformada — fonte única dos dados do evento.
 *
 * A página /conferencia, o e-mail de confirmação, o arquivo de agenda e o
 * lembrete da véspera leem tudo daqui. Mudar um horário ou um título em um
 * lugar só faria a página contradizer o e-mail que a pessoa recebeu.
 *
 * O que ainda NÃO está confirmado pela igreja está anotado em
 * docs/conferencia-inscricoes.md, e nada aqui afirma mais do que já se sabe.
 */

export const CONFERENCE_EDITION = "2ª Conferência Reformada"
export const CONFERENCE_TITLE = "O Livro da Criação"
export const CONFERENCE_SUBTITLE =
  "Lendo o mundo de Deus e vivendo para a sua glória"
export const CONFERENCE_PATH = "/conferencia"

/** Rótulo lido na página. As datas em instante estão em CONFERENCE_DAYS. */
export const CONFERENCE_DATES_LABEL = "7 e 8 de novembro de 2026"
/** Sem o ano, para a barra presa no pé da tela, onde o espaço é curto. */
export const CONFERENCE_DATES_SHORT = "7 e 8 de novembro"

/**
 * Preço. R$ 20 por pessoa de 12 anos em diante; até 11 anos não paga.
 * Guardado em centavos porque é assim que o valor do Pix é montado, e
 * centavo em ponto flutuante arredonda errado.
 */
export const CONFERENCE_PRICE_CENTS = 2000
export const CONFERENCE_PRICE_LABEL = "R$ 20"
/**
 * Os centavos do Pix. São FIXOS em 7, e marcam que aquele Pix é da
 * conferência: não identificam a pessoa. Quem identifica no extrato é o nome
 * de quem paga, e é por isso que o formulário pergunta por ele quando o Pix
 * sai da conta de outra pessoa. A conta é sempre 20 × adultos + 0,07.
 */
export const CONFERENCE_PIX_CENTS = 7

export const CONFERENCE_PAYING_AGE = 12
export const CONFERENCE_FREE_AGE_LIMIT = 11

/** Tetos dos dois seletores do formulário. */
export const CONFERENCE_MAX_ADULTS = 8
export const CONFERENCE_MAX_CHILDREN = 5

/**
 * Os dois dias como instante UTC. Brasília é UTC-3 fixo (o horário de verão
 * acabou em 2019), então 16h30 local = 19h30 UTC, sem VTIMEZONE.
 */
export const CONFERENCE_DAYS = [
  {
    key: "sabado",
    label: "Sábado, 7 de novembro",
    note: "das 16h30 às 20h30",
    start: new Date(Date.UTC(2026, 10, 7, 19, 30)),
    end: new Date(Date.UTC(2026, 10, 7, 23, 30)),
  },
  {
    key: "domingo",
    label: "Domingo, 8 de novembro",
    note: "no culto matutino, 09h00",
    start: new Date(Date.UTC(2026, 10, 8, 12, 0)),
    end: new Date(Date.UTC(2026, 10, 8, 14, 0)),
  },
] as const

/** O tema, do Artigo 2 da Confissão Belga. */
export const CONFERENCE_THEME = {
  heading: "A criação é um livro, e ele se lê com o outro Livro",
  intro:
    "O título desta conferência vem do Artigo 2 da Confissão Belga, que não fala de um livro apenas. Fala de dois, e na ordem.",
  quote:
    "Nós o conhecemos por dois meios. Primeiro: pela criação, preservação e governo do Universo, exposto aos nossos olhos como o mais magnífico dos livros, no qual todas as criaturas grandes e pequenas são como as muitas letras que nos levam a reconhecer claramente os atributos invisíveis de Deus. Segundo: Ele se faz conhecer mais clara e plenamente através da Sua Santa e Divina Palavra.",
  quoteSource: "Confissão Belga, Artigo 2",
  steps: [
    {
      term: "O mundo",
      text: "A primeira palestra lê o livro da criação e mostra como a origem do mundo decide o modo como vemos o próprio mundo.",
    },
    {
      term: "O texto",
      text: "A segunda vai ao texto de Gênesis, e ao que acontece com a fé quando ele é reinterpretado para caber na evolução.",
    },
    {
      term: "A vida",
      text: "A terceira sai da leitura para o viver: os mandatos da criação e a vida inteira que pertence ao Criador.",
    },
  ],
} as const

/**
 * As três mensagens. A terceira não é palestra em horário à parte: é a
 * pregação do culto matutino de domingo, e a etiqueta diz isso.
 */
export const CONFERENCE_LECTURES = [
  {
    number: 1,
    title: "O Livro da Criação: Deus, o Criador e a realidade que Ele fez",
    says: "Como a doutrina da criação confronta as cosmovisões contemporâneas.",
    thesis:
      "A maneira como entendemos a origem do mundo determina a maneira como entendemos o próprio mundo.",
    when: "Sábado, 17h15",
    speaker: "Dr. Hamilton Barbosa",
    tag: null,
  },
  {
    number: 2,
    title:
      "Quando o Livro da Criação é relido: Gênesis, criação e evolucionismo teísta",
    says: "O que o texto de Gênesis afirma, e o que acontece com a fé quando ele é reinterpretado.",
    thesis:
      "Não basta perguntar se evolução e fé podem coexistir; precisamos perguntar que tipo de teologia resulta dessa conciliação.",
    when: "Sábado, 18h40",
    speaker: "Dr. Hamilton Barbosa",
    tag: null,
  },
  {
    number: 3,
    title: "Vivendo na Perspectiva de Deus: os mandatos da criação",
    says: "Chamados a servir a Deus no mundo que Ele criou.",
    thesis:
      "Quem lê corretamente o livro da criação reconhece que sua vida toda pertence ao Criador.",
    when: "Domingo, 09h00, no culto matutino",
    speaker: "Pr. Jônatas Cunha",
    tag: "pregação no culto",
  },
] as const

/**
 * Os preletores. A bio diz só o que já se sabe: a busca não achou currículo de
 * nenhum dos dois, e o texto que eles mesmos costumam enviar ainda não chegou.
 */
export const CONFERENCE_SPEAKERS = [
  {
    name: "Dr. Hamilton Barbosa",
    role: "Presbítero",
    church: "Igreja Presbiteriana do Brasil, Anápolis (GO)",
    bio: "Doutor, professor universitário e presbítero da Igreja Presbiteriana do Brasil em Anápolis, em Goiás. Conduz as duas palestras de sábado, e elas se completam: a primeira abre o campo, mostrando como a doutrina da criação responde às visões de mundo de hoje; a segunda se concentra no texto de Gênesis e no que acontece com a teologia quando ele é relido para caber na evolução.",
    photo: "/conferencia/hamilton-barbosa.jpg",
  },
  {
    name: "Pr. Jônatas Cunha",
    role: "Pastor",
    church: "II Igreja Presbiteriana do Brasil, Samambaia Sul (DF)",
    bio: "Pastor da Segunda Igreja Presbiteriana do Brasil em Samambaia Sul, no Distrito Federal. Fecha os dois dias pregando no culto matutino de domingo, sobre os mandatos da criação: o que muda na vida de quem lê o livro da criação corretamente e reconhece que ela pertence inteira ao Criador.",
    photo: "/conferencia/jonatas-cunha.jpg",
  },
] as const

/**
 * A programação dos dois dias. `highlight` marca os blocos de ensino.
 * O intervalo e a mesa redonda são os blocos que absorvem atraso, então as
 * palestras começam na hora.
 */
export const CONFERENCE_SCHEDULE = [
  {
    day: "7",
    dayLabel: "Sábado · novembro · das 16h30 às 20h30",
    blocks: [
      {
        time: "16h30",
        title: "Credenciamento",
        detail: null,
        length: "30 min",
        highlight: false,
      },
      {
        time: "17h00",
        title: "Abertura, oração e louvor",
        detail: null,
        length: "15 min",
        highlight: false,
      },
      {
        time: "17h15",
        title: "Palestra 1",
        detail: "O Livro da Criação: Deus, o Criador e a realidade que Ele fez",
        length: "60 min",
        highlight: true,
      },
      {
        time: "18h15",
        title: "Intervalo e café",
        detail: null,
        length: "25 min",
        highlight: false,
      },
      {
        time: "18h40",
        title: "Palestra 2",
        detail:
          "Quando o Livro da Criação é relido: Gênesis, criação e evolucionismo teísta",
        length: "60 min",
        highlight: true,
      },
      {
        time: "19h40",
        title: "Mesa redonda",
        detail: "Perguntas do público",
        length: "35 min",
        highlight: false,
      },
      {
        time: "20h15",
        title: "Encerramento e oração final",
        detail: null,
        length: "15 min",
        highlight: false,
      },
    ],
  },
  {
    day: "8",
    dayLabel: "Domingo · novembro · no culto matutino",
    blocks: [
      {
        time: "09h00",
        title: "Culto matutino com a pregação",
        detail:
          "Vivendo na Perspectiva de Deus: os mandatos da criação, com o Pr. Jônatas Cunha",
        length: "Pregação",
        highlight: true,
      },
      {
        time: "10h20",
        title: "Escola Dominical",
        detail: "A igreja segue a programação normal do domingo",
        length: "Como sempre",
        highlight: false,
      },
    ],
  },
] as const

/** Para quem é. */
export const CONFERENCE_AUDIENCE = [
  {
    term: "Membros e congregados",
    text: "Dois dias de ensino para a igreja crescer na fé e no serviço, que é a razão de ser desta conferência.",
  },
  {
    term: "Quem não é da igreja",
    text: "Você não precisa ser membro, nem presbiteriano, nem reformado. Chegue, sente onde quiser e ouça.",
  },
  {
    term: "Quem tem dúvidas sobre a fé",
    text: "O assunto é a origem do mundo e o que ela significa. Se você está em dúvida, este é um bom lugar para trazer a sua pergunta, e há uma mesa redonda no fim do sábado para isso.",
  },
] as const

/** Os dias que a pessoa escolhe no formulário, na ordem em que aparecem. */
export const CONFERENCE_DAY_CHOICES = [
  { value: "AMBOS", label: "Sábado e domingo" },
  { value: "SABADO", label: "Só sábado" },
  { value: "DOMINGO", label: "Só domingo" },
] as const

/** De onde a pessoa vem. */
export const CONFERENCE_TIE_CHOICES = [
  { value: "MEMBRO", label: "Membro ou congregado desta igreja" },
  { value: "OUTRA_IGREJA", label: "De outra igreja" },
  { value: "CONVIDADO", label: "Convidado por alguém" },
  { value: "SEM_IGREJA", label: "Ainda não frequento nenhuma igreja" },
] as const

/**
 * O vínculo que faz o formulário perguntar qual é a igreja. Está aqui, e não
 * escrito à mão no componente, para a pergunta e o enum do banco não se
 * separarem se um dia o rótulo mudar.
 */
export const CONFERENCE_TIE_ASKS_CHURCH = "OUTRA_IGREJA"

/** Teto do nome da igreja, igual ao da coluna na planilha exportada. */
export const CONFERENCE_CHURCH_MAX = 120

/**
 * Como a pessoa ficou sabendo da conferência.
 *
 * A pergunta NÃO tem resposta padrão, e é por isso que o seletor abre vazio:
 * um padrão aqui registraria uma origem que ninguém informou, e a igreja
 * tomaria por divulgação o que foi só a primeira opção da lista. Quem não
 * responde deixa a coluna vazia, e vazio se lê como vazio.
 */
export const CONFERENCE_SOURCE_CHOICES = [
  { value: "IGREJA", label: "Nos avisos da igreja" },
  { value: "CONVITE", label: "Alguém me convidou" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "GOOGLE", label: "Procurando no Google" },
  { value: "OUTRO", label: "De outro jeito" },
] as const
