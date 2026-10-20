"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { sanitizeEmail } from "@/utils/strings"
import { sendContactNotificationEmail } from "@/lib/mail"
import { getUser } from "@/utils/getUser"
import { registraErro } from "@/lib/log-erro"
import { ISCA_CAMPO } from "@/const"

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

async function isRateLimited(email: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
  const count = await prisma.contactMessage.count({
    where: { email, createdAt: { gte: since } },
  })
  return count >= RATE_LIMIT_MAX
}

export async function submitContactForm(formData: FormData) {
  // Isca de robô. Aqui a resposta é "enviado" de propósito, para o robô não
  // aprender a diferença, e é justamente por isso que o registro abaixo
  // importa: se a isca pegar uma pessoa, ela acha que mandou a mensagem e
  // ninguém nunca recebeu. O texto vai para `detalhe` para não se perder, e a
  // igreja lê em /admin/erros. O campo se chamava `website` até 20/10/2026,
  // nome que gerenciador de senha preenche sozinho; o novo está em
  // const/isca.ts.
  if (formData.get(ISCA_CAMPO)) {
    await registraErro({
      origem: "contato",
      codigo: "ISCA_PREENCHIDA",
      mensagem:
        "A isca de robô veio preenchida no formulário de contato. Se foi uma " +
        "pessoa, ela acha que a mensagem foi enviada, e a mensagem está aqui " +
        "embaixo, em detalhe.",
      pessoa: String(formData.get("name") ?? "").trim() || null,
      contato: String(formData.get("email") ?? "").trim() || null,
      causa: [
        `assunto: ${String(formData.get("subject") ?? "")}`,
        `whatsapp: ${String(formData.get("whatsapp") ?? "")}`,
        `mensagem: ${String(formData.get("message") ?? "")}`,
      ].join("\n"),
    })
    return { success: true }
  }

  const name = formData.get("name") as string
  const email = sanitizeEmail(formData.get("email") as string)
  const whatsapp = ((formData.get("whatsapp") as string) ?? "").trim()
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !whatsapp || !subject || !message) {
    return { success: false, error: "Campos obrigatórios ausentes." }
  }

  // WhatsApp is required: expect a real number (at least 10 digits — DDD +
  // line), ignoring formatting like +55, spaces, parentheses and dashes.
  if ((whatsapp.match(/\d/g) ?? []).length < 10) {
    return { success: false, error: "Informe um número de WhatsApp válido." }
  }

  if (await isRateLimited(email)) {
    return {
      success: false,
      error: "Muitas tentativas. Tente novamente em 1 hora.",
    }
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, whatsapp, subject, message },
    })
    await sendContactNotificationEmail({
      name,
      email,
      whatsapp,
      subject,
      message,
    })
    return { success: true }
  } catch (erro) {
    await registraErro({
      origem: "contato",
      codigo: "MENSAGEM_NAO_GRAVADA",
      mensagem:
        "Uma mensagem do formulário de contato não foi gravada nem enviada por " +
        "e-mail. Quem escreveu recebeu um pedido para tentar de novo.",
      causa: erro,
      pessoa: name || null,
      contato: email || null,
    })
    return { success: false, error: "Erro ao processar sua mensagem." }
  }
}

export async function countUnreadMessages(id?: string) {
  if (!(await getUser())) return 0
  return await prisma.contactMessage.count({
    where: { read: false, ...(id && { id: { not: id } }) },
  })
}

export async function getContactMessages() {
  if (!(await getUser())) return []
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getMessageAndMarkAsRead(id: string) {
  if (!(await getUser())) return null
  return await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  })
}

export async function markMessageAsUnread(id: string) {
  if (!(await getUser())) return
  await prisma.contactMessage.update({ where: { id }, data: { read: false } })
  revalidatePath("/admin/mensagens")
  redirect("/admin/mensagens")
}

export async function deleteContactMessage(id: string) {
  if (!(await getUser())) return
  await prisma.contactMessage.delete({ where: { id } })
  revalidatePath("/admin/mensagens")
  redirect("/admin/mensagens")
}
