import "server-only"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * O site está no ar ou em manutenção.
 *
 * Mesmo desenho de lib/inscricoes-estado.ts, e pelo mesmo motivo: quem tira o
 * site do ar é a igreja clicando no admin, no dia em que ela decidir. Bandeira
 * de código precisaria de deploy, e no dia do aperto ninguém vai querer
 * depender disso.
 *
 * A coluna `maintenanceMode` já existia em GlobalSettings desde o começo do
 * projeto, com interruptor na tela de configurações, mas nenhuma página lia o
 * valor: ligar o interruptor não mudava nada no site. Este arquivo é a leitura
 * que faltava.
 *
 * São duas leituras de propósito: a pública pode responder de cache, porque a
 * página é servida pronta; a tela do admin NÃO, porque ela é o painel de
 * controle e tem de mostrar o que vale agora.
 */

/** O rótulo do cache. O botão do admin invalida por aqui. */
export const TAG_MANUTENCAO = "site-em-manutencao"

/**
 * Sem rede de proteção: quem chama é a tela do admin, e lá um erro de leitura
 * tem de aparecer em vez de virar um estado inventado.
 *
 * A falta de `GLOBAL_CONFIG_ID` é o único caso que não interrompe: é ausência
 * de configuração, não falha momentânea, e derrubar o site por causa dela
 * seria o pior resultado possível.
 */
async function leDoBanco(): Promise<boolean> {
  const id = process.env.GLOBAL_CONFIG_ID
  if (!id) {
    console.error("GLOBAL_CONFIG_ID ausente: site tratado como no ar.")
    return false
  }
  const config = await prisma.globalSettings.findUnique({
    where: { id },
    select: { maintenanceMode: true },
  })
  return config?.maintenanceMode ?? false
}

/**
 * Para as páginas públicas. Em cache, e o botão do admin derruba o cache na
 * hora, então a mudança aparece imediatamente.
 *
 * O prazo de 60 segundos não é para o botão: é para o caso em que ninguém
 * invalida nada, como uma mudança feita direto no banco, ou um deploy que
 * restaure uma entrada antiga de antes da decisão.
 *
 * É tolerante a falha, e aqui a direção importa: banco fora do ar deixa o site
 * NO AR. O contrário tiraria o site do ar por um soluço de rede, que é
 * exatamente o acidente que não pode acontecer.
 */
export const siteEmManutencao = unstable_cache(
  async () => {
    try {
      return await leDoBanco()
    } catch (error) {
      console.error("Falha ao ler o estado de manutenção:", error)
      return false
    }
  },
  [TAG_MANUTENCAO],
  { tags: [TAG_MANUTENCAO], revalidate: 60 },
)

/** Para a tela do admin. Sempre do banco, e o erro sobe. */
export const siteEmManutencaoAgora = leDoBanco
