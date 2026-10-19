import { prisma } from "@/lib/prisma"
import { getUser } from "@/utils/getUser"
import { montaXlsx, type ColunaExcel, type ValorDeCelula } from "@/lib/xlsx"
import { comoSoubeLabel, diasLabel, vinculoLabel } from "@/utils/inscricao"

/**
 * A lista de inscrições em Excel, no lugar da planilha do Drive.
 *
 * Esta rota é um arquivo, não uma tela: o botão do admin aponta para cá e o
 * navegador baixa. A planilha é CÓPIA do banco, feita no instante do clique,
 * e por isso nunca fica desatualizada nem precisa de botão de reenviar.
 *
 * Exige sessão, como a lista. Rota não passa pelo layout do admin, então a
 * conferência de quem está logado é feita aqui dentro.
 */

export const dynamic = "force-dynamic"

const SITUACAO: Record<string, string> = {
  AGUARDANDO: "Aguardando pagamento",
  PAGA: "Paga",
  CANCELADA: "Cancelada",
}

const COLUNAS: ColunaExcel[] = [
  { titulo: "Nº", formato: "inteiro", largura: 7 },
  { titulo: "Recebida em", formato: "dataHora", largura: 17 },
  { titulo: "Nome", largura: 30 },
  { titulo: "E-mail", largura: 30 },
  { titulo: "WhatsApp", largura: 18 },
  { titulo: "Adultos", formato: "inteiro", largura: 9 },
  { titulo: "Crianças", formato: "inteiro", largura: 9 },
  { titulo: "Pessoas", formato: "inteiro", largura: 9 },
  { titulo: "Dias", largura: 24 },
  { titulo: "De onde vem", largura: 32 },
  { titulo: "Qual igreja", largura: 30 },
  { titulo: "Como ficou sabendo", largura: 26 },
  { titulo: "Quem paga o Pix", largura: 26 },
  { titulo: "Valor", formato: "dinheiro", largura: 12 },
  { titulo: "Identificador do Pix", largura: 20 },
  { titulo: "Situação", largura: 20 },
  { titulo: "Paga em", formato: "dataHora", largura: 17 },
]

/** Data no nome do arquivo, para duas exportações não se confundirem. */
function hojeEmBrasilia(): string {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
  return p
}

export async function GET() {
  if (!(await getUser())) {
    return new Response("Não autorizado.", { status: 401 })
  }

  const inscricoes = await prisma.inscricao.findMany({
    orderBy: { numero: "asc" },
  })

  const linhas: ValorDeCelula[][] = inscricoes.map((i) => [
    i.numero,
    i.createdAt,
    i.nome,
    i.email,
    i.whatsapp,
    i.adultos,
    i.criancas,
    i.adultos + i.criancas,
    diasLabel(i.dias),
    vinculoLabel(i.vinculo),
    // As duas colunas ficam vazias quando a pergunta não foi feita ou não foi
    // respondida. Vazio é informação: dizer "Não informado" seria resposta.
    i.igreja ?? "",
    comoSoubeLabel(i.comoSoube),
    i.pagador ?? "",
    // Em reais, como número: assim a coluna soma no Excel. O banco guarda
    // centavos inteiros justamente para a conta não arredondar errado.
    Number((i.valor / 100).toFixed(2)),
    i.txid ?? "",
    SITUACAO[i.status] ?? i.status,
    i.pagoEm,
  ])

  const arquivo = montaXlsx({
    nomeDaAba: "Inscrições",
    colunas: COLUNAS,
    linhas,
  })

  return new Response(new Uint8Array(arquivo), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="inscricoes-conferencia-${hojeEmBrasilia()}.xlsx"`,
      "Content-Length": String(arquivo.length),
      // Lista que muda a cada inscrição: nada de cache em lugar nenhum.
      "Cache-Control": "no-store",
    },
  })
}
