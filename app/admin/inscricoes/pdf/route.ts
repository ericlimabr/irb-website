import { prisma } from "@/lib/prisma"
import { getUser } from "@/utils/getUser"
import { montaPdfDeInscritos, nomeDoArquivoPdf } from "@/lib/inscricoes-pdf"

/**
 * A lista de inscritos em PDF, para imprimir e levar para o credenciamento.
 *
 * Esta rota é um arquivo, não uma tela, igual à de Excel ao lado: o botão do
 * admin aponta para cá e o navegador baixa. A folha é CÓPIA do banco, feita no
 * instante do clique, e por isso nunca fica desatualizada.
 *
 * Quem monta a folha é lib/inscricoes-pdf.ts, e não esta rota. É o mesmo
 * gerador que o envio por e-mail usa, para as duas folhas não divergirem.
 *
 * Exige sessão, como a lista. Rota não passa pelo layout do admin, então a
 * conferência de quem está logado é feita aqui dentro.
 */

export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await getUser())) {
    return new Response("Não autorizado.", { status: 401 })
  }

  // Só as colunas que a folha usa: o que não é impresso não precisa sair do
  // banco, e isto é dado pessoal de quem se inscreveu.
  const inscricoes = await prisma.inscricao.findMany({
    orderBy: { numero: "asc" },
    select: {
      numero: true,
      createdAt: true,
      nome: true,
      email: true,
      whatsapp: true,
      adultos: true,
      criancas: true,
      dias: true,
      vinculo: true,
      igreja: true,
    },
  })

  const arquivo = montaPdfDeInscritos(inscricoes)

  return new Response(new Uint8Array(arquivo), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeDoArquivoPdf()}"`,
      "Content-Length": String(arquivo.length),
      // Lista que muda a cada inscrição: nada de cache em lugar nenhum.
      "Cache-Control": "no-store",
    },
  })
}
