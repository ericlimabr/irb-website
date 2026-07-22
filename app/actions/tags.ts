"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getUser } from "@/utils/getUser"

const tagSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  slug: z.string().min(2, "Slug inválido"),
})

export async function createTag(formData: FormData) {
  if (!(await getUser())) return { error: "Não autorizado" }

  const validated = tagSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  })

  if (!validated.success)
    return { error: validated.error.flatten().fieldErrors }

  try {
    await prisma.tag.upsert({
      where: { name: validated.data.name },
      update: { slug: validated.data.slug },
      create: { name: validated.data.name, slug: validated.data.slug },
    })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch {
    return { error: "Erro ao salvar no banco de dados." }
  }
}

export async function deleteTag(id: string) {
  if (!(await getUser())) return { error: "Não autorizado" }

  try {
    await prisma.tag.delete({ where: { id } })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch {
    return { error: "Erro ao excluir categoria." }
  }
}
