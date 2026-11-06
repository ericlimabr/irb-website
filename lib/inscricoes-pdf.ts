import "server-only"
import { montaPdf, type ColunaPdf } from "@/lib/pdf"
import { diasLabel, vinculoLabel } from "@/utils/inscricao"
import { CONFERENCE_DATES_LABEL, CONFERENCE_EDITION } from "@/const"

/**
 * A lista de inscritos em PDF, para imprimir e levar.
 *
 * ESTE é o gerador. O botão do admin e o envio por e-mail chamam esta mesma
 * função, e por isso a folha que a igreja baixa e a que chega na caixa de
 * entrada são a mesma folha, nunca duas versões parecidas.
 *
 * O que NÃO entra, de propósito: valor, situação do pagamento, quem faz o Pix
 * e o identificador do Pix. Em 05/11/2026 ficou decidido que a conferência não
 * cobra nada, e uma folha impressa dizendo "Aguardando pagamento · R$ 20,07"
 * ao lado do nome de quem vai contradiz o que o site e o e-mail de confirmação
 * dizem hoje. Essas colunas continuam na exportação em Excel, que é a via de
 * conciliação; esta aqui é a lista de quem vem.
 *
 * As colunas de igreja e de como ficou sabendo ficam VAZIAS quando a pergunta
 * não foi feita ou não foi respondida, igual à planilha: vazio é informação, e
 * escrever "Não informado" seria inventar resposta que ninguém deu.
 */

/**
 * O que o gerador precisa de cada inscrição. É de propósito menor do que a
 * linha do banco: assim a função não depende do cliente do Prisma e serve
 * tanto à rota do admin quanto a um script fora do Next.
 */
export interface InscricaoParaPdf {
  numero: number
  createdAt: Date
  nome: string
  email: string
  whatsapp: string
  adultos: number
  criancas: number
  dias: string
  vinculo: string
  igreja: string | null
}

/**
 * As dez colunas e a largura de cada uma, em pontos. A soma mais o espaço
 * entre elas tem de caber na folha A4 em paisagem, que dá 778 pontos úteis
 * com a margem do lib/pdf.ts. Somadas dão 722, e os nove vãos de 6 dão 54.
 */
const COLUNAS: ColunaPdf[] = [
  { titulo: "Nº", largura: 20 },
  { titulo: "Nome", largura: 134 },
  { titulo: "E-mail", largura: 112 },
  { titulo: "WhatsApp", largura: 74 },
  { titulo: "Adultos", largura: 40, alinhamento: "direita" },
  { titulo: "Crianças", largura: 42, alinhamento: "direita" },
  { titulo: "Dias", largura: 66 },
  { titulo: "De onde vem", largura: 100 },
  { titulo: "Qual igreja", largura: 80 },
  { titulo: "Recebida em", largura: 54 },
]

const RECEBIDA = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

/** "06/11 10h35": curto porque a coluna é estreita, e sem ano porque a folha já tem a data. */
function recebidaEm(d: Date): string {
  const partes: Record<string, string> = {}
  for (const p of RECEBIDA.formatToParts(d)) partes[p.type] = p.value
  return `${partes.day}/${partes.month} ${partes.hour}h${partes.minute}`
}

/** O nome do arquivo, com a data, para duas folhas não se confundirem. */
export function nomeDoArquivoPdf(geradoEm = new Date()): string {
  const dia = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(geradoEm)
  return `inscritos-conferencia-${dia}.pdf`
}

export function montaPdfDeInscritos(
  inscricoes: InscricaoParaPdf[],
  geradoEm = new Date(),
): Buffer {
  const adultos = inscricoes.reduce((s, i) => s + i.adultos, 0)
  const criancas = inscricoes.reduce((s, i) => s + i.criancas, 0)

  const linhas = inscricoes.map((i) => [
    String(i.numero).padStart(3, "0"),
    i.nome,
    i.email,
    i.whatsapp,
    String(i.adultos),
    // Zero criança fica em branco: a coluna fica legível e quem procura
    // criança acha na hora, em vez de varrer uma fileira de zeros.
    i.criancas ? String(i.criancas) : "",
    diasLabel(i.dias),
    vinculoLabel(i.vinculo),
    i.igreja ?? "",
    recebidaEm(i.createdAt),
  ])

  return montaPdf({
    titulo: "Lista de inscritos",
    subtitulo: `${CONFERENCE_EDITION} · ${CONFERENCE_DATES_LABEL}`,
    resumo: [
      { rotulo: "Inscrições", valor: String(inscricoes.length) },
      { rotulo: "Pessoas esperadas", valor: String(adultos + criancas) },
      { rotulo: "Adultos", valor: String(adultos) },
      { rotulo: "Crianças", valor: String(criancas) },
    ],
    colunas: COLUNAS,
    linhas,
    rodape:
      "Uso interno da igreja. Esta folha sai do banco no instante em que é gerada e tem o contato de quem se inscreveu.",
    orientacao: "paisagem",
    geradoEm,
  })
}
