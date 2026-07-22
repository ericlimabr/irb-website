"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { PostType, PostStatus, Prisma } from "@prisma/client"
import { getUser } from "@/utils/getUser"

const postSchema = z.object({
  title: z.string().min(5, "Título muito curto (mín. 5 caracteres)"),
  slug: z.string().min(3, "Slug inválido (mín. 3 caracteres)"),
  content: z.string().min(10, "Conteúdo muito curto (mín. 10 caracteres)"),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  type: z.nativeEnum(PostType),
  status: z.nativeEnum(PostStatus),
  tagIds: z.array(z.string()).optional(),
  authorId: z.string().optional().nullable(),
  authorName: z.string().min(1, "Nome do autor é obrigatório"),
})

export async function createPost(formData: FormData) {
  if (!(await getUser())) return { error: "Não autorizado" }

  const tagIdsRaw = formData.get("tagIds")
  const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw as string) : []

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    status: formData.get("status"),
    tagIds,
    authorId: formData.get("authorId"),
    authorName: formData.get("authorName") || "Igreja IRB",
  }

  const validated = postSchema.safeParse(rawData)

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  try {
    const { tagIds, ...postData } = validated.data

    await prisma.post.create({
      data: {
        ...postData,
        tags: { connect: tagIds?.map((id: string) => ({ id })) || [] },
        publishedAt: postData.status === "PUBLISHED" ? new Date() : null,
      },
    })

    revalidatePath("/admin/publicacoes")
    revalidatePath("/blog")

    return { success: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: "Este slug já está em uso. Escolha um título diferente.",
        }
      }
    }
    return { error: "Erro interno ao salvar a publicação." }
  }
}

export async function updatePost(id: string, formData: FormData) {
  if (!(await getUser())) return { error: "Não autorizado" }

  const tagIdsRaw = formData.get("tagIds")
  const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw as string) : []

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    type: formData.get("type"),
    status: formData.get("status"),
    tagIds,
    authorName: formData.get("authorName"),
  }

  const validated = postSchema.partial().safeParse(rawData)

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  try {
    const currentPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    })

    const { tagIds, ...postData } = validated.data

    await prisma.post.update({
      where: { id },
      data: {
        ...(postData as Prisma.PostUpdateInput),
        tags: { set: [], connect: tagIds?.map((id: string) => ({ id })) || [] },
        publishedAt:
          postData.status === "PUBLISHED"
            ? currentPost?.publishedAt || new Date()
            : null,
      },
    })

    revalidatePath("/admin/publicacoes")
    revalidatePath(`/blog/${validated.data.slug}`)

    return { success: true }
  } catch {
    return { error: "Erro interno ao atualizar a publicação." }
  }
}

export async function deletePost(id: string) {
  if (!(await getUser())) return { error: "Não autorizado" }

  try {
    await prisma.post.delete({ where: { id } })
    revalidatePath("/admin/publicacoes")
    revalidatePath("/blog")
    return { success: true }
  } catch {
    return { error: "Erro ao excluir a publicação." }
  }
}
