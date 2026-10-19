import "server-only"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * As inscrições da conferência estão abertas ou encerradas.
 *
 * O estado mora no banco, e não em `config/index.ts`, porque quem fecha é a
 * igreja clicando no admin, no dia em que ela decidir. Bandeira de código
 * precisaria de deploy, e no dia do aperto ninguém vai querer depender disso.
 *
 * São duas leituras de propósito, e a diferença entre elas é o ponto deste
 * arquivo: a página pública pode responder de cache, porque ela é servida
 * pronta; a gravação da inscrição NÃO pode, porque aceitar uma inscrição
 * depois de encerrada é um erro que só se descobre quando a pessoa cobra a
 * vaga.
 */

/** O rótulo do cache. O botão do admin invalida por aqui. */
export const TAG_INSCRICOES = "conferencia-estado-das-inscricoes"

/**
 * Sem rede de proteção: quem chama é a gravação, e lá um erro de leitura tem
 * de interromper a inscrição em vez de deixá-la passar.
 *
 * A falta de `GLOBAL_CONFIG_ID` é o único caso que não interrompe: é ausência
 * de configuração, não falha momentânea, e recusar toda inscrição por causa
 * dela seria pior do que manter as inscrições abertas.
 */
async function leDoBanco(): Promise<boolean> {
  const id = process.env.GLOBAL_CONFIG_ID
  if (!id) {
    console.error("GLOBAL_CONFIG_ID ausente: inscrições tratadas como abertas.")
    return false
  }
  const config = await prisma.globalSettings.findUnique({
    where: { id },
    select: { conferenciaEncerrada: true },
  })
  return config?.conferenciaEncerrada ?? false
}

/**
 * Para a página pública. Em cache, e o botão do admin derruba o cache na hora,
 * então o encerramento aparece imediatamente.
 *
 * O prazo de 60 segundos não é para o botão: é para o caso em que ninguém
 * invalida nada. Este cache sobrevive ao build e é restaurado entre deploys,
 * então um deploy feito depois do encerramento poderia reaproveitar a resposta
 * antiga e republicar a página com o formulário aberto. Com prazo, uma entrada
 * velha é relida do banco em vez de reaproveitada. O mesmo vale para quem
 * mudar a coluna direto no banco, sem passar pelo botão.
 *
 * É também tolerante a falha: banco fora do ar deixa a página como ela estava,
 * aberta, em vez de anunciar um encerramento que ninguém decidiu.
 */
export const inscricoesEncerradas = unstable_cache(
  async () => {
    try {
      return await leDoBanco()
    } catch (error) {
      console.error("Falha ao ler o estado das inscrições:", error)
      return false
    }
  },
  [TAG_INSCRICOES],
  { tags: [TAG_INSCRICOES], revalidate: 60 },
)

/** Para a gravação. Sempre do banco, e o erro sobe. */
export const inscricoesEncerradasAgora = leDoBanco
