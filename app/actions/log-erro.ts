"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getUser } from "@/utils/getUser"

/**
 * Leitura e baixa do log de falhas. Quem escreve é lib/log-erro.ts, de dentro
 * das actions públicas; aqui só a igreja mexe, e toda função exige sessão.
 */

/** Teto de linhas na tela. Log de erro cresce rápido quando algo quebra. */
const TETO = 200

export async function getLogErros() {
  if (!(await getUser())) return []
  return await prisma.logErro.findMany({
    orderBy: { createdAt: "desc" },
    take: TETO,
  })
}

export async function contaErrosNaoVistos(): Promise<number> {
  if (!(await getUser())) return 0
  try {
    return await prisma.logErro.count({ where: { vistoEm: null } })
  } catch {
    return 0
  }
}

/** Marca uma falha como vista, sem apagar nada: o log é histórico. */
export async function marcaErroVisto(formData: FormData) {
  if (!(await getUser())) return
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await prisma.logErro.update({
    where: { id },
    data: { vistoEm: new Date() },
  })
  revalidatePath("/admin/erros")
}

/** Dá baixa em tudo que está sem baixa, para a tela voltar ao zero. */
export async function marcaTodosVistos() {
  if (!(await getUser())) return
  await prisma.logErro.updateMany({
    where: { vistoEm: null },
    data: { vistoEm: new Date() },
  })
  revalidatePath("/admin/erros")
}
