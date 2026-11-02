"use server"

import { revalidatePath, updateTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import { TAG_MANUTENCAO } from "@/lib/manutencao"
import { getUser } from "@/utils/getUser"
import { registraErro } from "@/lib/log-erro"

/**
 * Tira o site do ar, ou devolve. É o botão do admin.
 *
 * Só o dono (utils/dono.ts). O painel não tem papéis, e esta é a segunda
 * exceção depois da tela de usuários: derrubar o site inteiro é a ação mais
 * larga que existe aqui, e quem responde pelo site é quem a aciona. Trocar
 * para "qualquer sessão" é apagar a linha do `ehDono` abaixo.
 *
 * Grava no banco e derruba na hora o que estava pronto em cache: o rótulo que
 * as páginas públicas usam para ler o estado, e as próprias rotas públicas.
 * Sem isso o botão mudaria o banco e o site continuaria no ar até o cache
 * vencer por conta própria.
 */
export async function setSiteEmManutencao(ativar: boolean) {
  const atual = await getUser()
  if (!atual?.ehDono) return { error: "Não autorizado." }

  const id = process.env.GLOBAL_CONFIG_ID
  if (!id) {
    console.error("GLOBAL_CONFIG_ID ausente: não há onde gravar o estado.")
    return {
      error:
        "Falta a configuração GLOBAL_CONFIG_ID no ambiente. Sem ela não há onde gravar o estado.",
    }
  }

  try {
    await prisma.globalSettings.upsert({
      where: { id },
      update: { maintenanceMode: ativar },
      create: { id, maintenanceMode: ativar },
    })
  } catch (error) {
    console.error("Erro ao mudar o estado de manutenção:", error)
    return { error: "Não foi possível mudar o estado do site." }
  }

  // Fica registrado em Falhas do site como aviso, não como erro: tirar o site
  // do ar é decisão, e não defeito. Mas é a decisão de maior alcance do
  // painel, e dias depois ninguém lembra quando foi nem quem fez.
  await registraErro({
    origem: "admin",
    codigo: ativar ? "SITE_EM_MANUTENCAO" : "SITE_DE_VOLTA_AO_AR",
    nivel: "AVISO",
    avisar: false,
    mensagem: ativar
      ? `Site posto em manutenção por ${atual.email ?? "conta sem e-mail"}.`
      : `Site devolvido ao ar por ${atual.email ?? "conta sem e-mail"}.`,
  })

  // `updateTag` e não `revalidateTag`: estamos dentro de uma action, e ele dá
  // leitura do que acabou de ser escrito. Assim a própria tela do admin já
  // volta com o estado novo, em vez de mostrar o anterior por um instante.
  updateTag(TAG_MANUTENCAO)
  // "layout" porque o portão mora nos layouts públicos, e o que precisa ser
  // montado de novo é a árvore toda, não uma página.
  revalidatePath("/", "layout")
  revalidatePath("/admin/manutencao")
  return { success: true as const, manutencao: ativar }
}
