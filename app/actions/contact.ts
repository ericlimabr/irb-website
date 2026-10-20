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
  // Isca de robô. Ela NÃO RECUSA MAIS NADA, e const/isca.ts explica por quê:
  // o campo barrou gente de verdade duas vezes na inscrição, e aqui o estrago
  // era pior, porque a resposta era "enviado" e a mensagem não chegava a
  // ninguém. Agora a mensagem é gravada e enviada normalmente, e a isca só
  // deixa um aviso no log para a igreja desconfiar da mensagem.
  const iscaMarcada = formData.get(ISCA_CAMPO)
  if (iscaMarcada) {
    await registraErro({
      origem: "contato",
      codigo: "ISCA_MARCADA",
      nivel: "AVISO",
      mensagem:
        "A isca de robô veio marcada no formulário de contato. A mensagem foi " +
        "enviada normalmente; desconfie dela antes de responder.",
      pessoa: String(formData.get("name") ?? "").trim() || null,
      contato: String(formData.get("email") ?? "").trim() || null,
      causa: `valor recebido no campo da isca: ${String(iscaMarcada).slice(0, 200)}`,
    })
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
