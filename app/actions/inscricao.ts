"use server"

import { revalidatePath } from "next/cache"
import {
  InscricaoComoSoube,
  InscricaoDias,
  InscricaoVinculo,
} from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getUser } from "@/utils/getUser"
import { isValidEmail, sanitizeEmail } from "@/utils/strings"
import { churchPixPayload, pixQrDataUrl, pixQrPng, PIX_KEY } from "@/lib/pix"
import { sendInscricaoConfirmationEmail } from "@/lib/mail"
import { avisaNoWhatsApp } from "@/lib/whatsapp"
import { mapsDirectionsUrl } from "@/utils/maps"
import { SITE_URL } from "@/utils/siteUrl"
import {
  brl,
  comoSoubeLabel,
  diasLabel,
  inscricaoTotalCents,
  pessoasLabel,
  vinculoLabel,
} from "@/utils/inscricao"
import {
  CONFERENCE_CHURCH_MAX,
  CONFERENCE_EDITION,
  CONFERENCE_MAX_ADULTS,
  CONFERENCE_MAX_CHILDREN,
  CONFERENCE_PATH,
  CONFERENCE_PIX_CENTS,
  CONFERENCE_TIE_ASKS_CHURCH,
} from "@/const"

/**
 * Inscrição na 2ª Conferência Reformada.
 *
 * O pagamento é Pix sem intermediário: ninguém avisa que caiu. A inscrição
 * nasce AGUARDANDO e quem a marca como paga é a igreja, conferindo o extrato
 * pelo NOME DE QUEM PAGA. Os 7 centavos do valor não identificam a pessoa:
 * são iguais em toda inscrição e só marcam que aquele Pix é da conferência.
 *
 * O `txid` vai no BR Code com o número da inscrição, e alguns bancos o
 * repassam para o extrato de quem recebe. Como só alguns, ele é ajuda, não
 * garantia, e por isso o formulário insiste no nome do pagador.
 */

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

export type InscricaoResult =
  | {
      success: true
      numero: number
      valor: number
      centavos: number
      brCode: string
      qr: string
      pessoas: string
      dias: string
      emailEnviado: boolean
    }
  | { success: false; error: string }

async function isRateLimited(email: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
  const count = await prisma.inscricao.count({
    where: { email, createdAt: { gte: since } },
  })
  return count >= RATE_LIMIT_MAX
}

/** Lê um inteiro do formulário, preso entre min e max. */
function inteiro(valor: FormDataEntryValue | null, min: number, max: number) {
  const n = Number.parseInt(String(valor ?? ""), 10)
  if (Number.isNaN(n)) return min
  return Math.min(Math.max(n, min), max)
}

function ehDias(v: string): v is InscricaoDias {
  return v in InscricaoDias
}

function ehVinculo(v: string): v is InscricaoVinculo {
  return v in InscricaoVinculo
}

function ehComoSoube(v: string): v is InscricaoComoSoube {
  return v in InscricaoComoSoube
}

export async function submitInscricao(
  formData: FormData,
): Promise<InscricaoResult> {
  // Isca de robô: campo escondido no formulário, que pessoa nenhuma preenche.
  // Responde como sucesso de propósito, para o robô não aprender a diferença.
  const botTrap = formData.get("website")
  if (botTrap) {
    return { success: false, error: "Não foi possível concluir a inscrição." }
  }

  const nome = String(formData.get("nome") ?? "").trim()
  const email = sanitizeEmail(String(formData.get("email") ?? ""))
  const whatsapp = String(formData.get("whatsapp") ?? "").trim()
  const pagadorBruto = String(formData.get("pagador") ?? "").trim()
  const diasBruto = String(formData.get("dias") ?? "")
  const vinculoBruto = String(formData.get("vinculo") ?? "")
  const igrejaBruto = String(formData.get("igreja") ?? "")
    .trim()
    .slice(0, CONFERENCE_CHURCH_MAX)
  const comoSoubeBruto = String(formData.get("comoSoube") ?? "").trim()

  const adultos = inteiro(formData.get("adultos"), 1, CONFERENCE_MAX_ADULTS)
  const criancas = inteiro(formData.get("criancas"), 0, CONFERENCE_MAX_CHILDREN)

  if (!nome || !email || !whatsapp) {
    return { success: false, error: "Preencha nome, WhatsApp e e-mail." }
  }
  if (nome.length < 3) {
    return { success: false, error: "Escreva o seu nome completo." }
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "Confira o e-mail: ele parece incompleto." }
  }
  // DDD + linha dão 10 dígitos no mínimo, ignorando +55, espaço e parêntese.
  if ((whatsapp.match(/\d/g) ?? []).length < 10) {
    return { success: false, error: "Informe um número de WhatsApp com DDD." }
  }
  if (!ehDias(diasBruto) || !ehVinculo(vinculoBruto)) {
    return { success: false, error: "Escolha os dias e de onde você vem." }
  }
  // A igreja só é gravada no vínculo que a pergunta: em qualquer outro, a
  // pergunta não apareceu na tela, e o que vier com o formulário é sobra de
  // quem trocou a escolha depois de digitar, ou de quem montou o envio à mão.
  const igreja =
    vinculoBruto === CONFERENCE_TIE_ASKS_CHURCH && igrejaBruto
      ? igrejaBruto
      : null
  // Resposta fora da lista é tratada como resposta nenhuma. A pergunta é
  // opcional, então vazio aqui é um resultado legítimo, não um erro.
  const comoSoube = ehComoSoube(comoSoubeBruto) ? comoSoubeBruto : null
  if (!PIX_KEY) {
    // Sem chave não existe Pix que preste: é melhor não inscrever ninguém do
    // que entregar um código que não paga a igreja.
    console.error("PIX_KEY ausente: inscrição recusada antes de gravar.")
    return {
      success: false,
      error:
        "A inscrição está temporariamente indisponível. Fale com a igreja pelo WhatsApp.",
    }
  }
  if (await isRateLimited(email)) {
    return {
      success: false,
      error: "Já recebemos inscrições deste e-mail. Tente novamente em 1 hora.",
    }
  }

  try {
    const inscricao = await prisma.inscricao.create({
      data: {
        nome,
        email,
        whatsapp,
        adultos,
        criancas,
        dias: diasBruto,
        vinculo: vinculoBruto,
        igreja,
        comoSoube,
        pagador: pagadorBruto || null,
      },
    })

    const centavos = CONFERENCE_PIX_CENTS
    const valor = inscricaoTotalCents(adultos)
    const txid = `CONF${String(inscricao.numero).padStart(4, "0")}`

    await prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { centavos, valor, txid },
    })

    const brCode = churchPixPayload(valor, txid)
    const [qr, qrPng] = await Promise.all([
      pixQrDataUrl(brCode),
      pixQrPng(brCode),
    ])

    const pessoas = pessoasLabel(adultos, criancas)
    const dias = diasLabel(diasBruto)

    // Os dois envios saem juntos: o e-mail para quem se inscreveu e o aviso
    // no WhatsApp para a igreja. Se qualquer um falhar, a inscrição continua
    // válida: ela já está gravada, e o admin mostra tudo.
    const [{ success: emailEnviado }] = await Promise.all([
      sendInscricaoConfirmationEmail({
        nome,
        email,
        dias,
        pessoas,
        valor,
        brCode,
        qr: qrPng,
        agendaUrl: `${SITE_URL}${CONFERENCE_PATH}/agenda`,
        mapsUrl: mapsDirectionsUrl(),
      }),
      avisaNoWhatsApp(
        [
          `Inscrição ${String(inscricao.numero).padStart(4, "0")} na ${CONFERENCE_EDITION}`,
          "",
          nome,
          pessoas,
          `${dias} · ${vinculoLabel(vinculoBruto)}${igreja ? `, ${igreja}` : ""}`,
          ...(comoSoube ? [`Soube: ${comoSoubeLabel(comoSoube)}`] : []),
          `${brl(valor)} por Pix, aguardando pagamento`,
          "",
          `${SITE_URL}/admin/inscricoes`,
        ].join("\n"),
      ),
    ])

    revalidatePath("/admin/inscricoes")

    return {
      success: true,
      numero: inscricao.numero,
      valor,
      centavos,
      brCode,
      qr,
      pessoas,
      dias,
      emailEnviado,
    }
  } catch (error) {
    console.error("Erro ao gravar inscrição da conferência:", error)
    return {
      success: false,
      error:
        "Não foi possível concluir a inscrição. Tente de novo em instantes.",
    }
  }
}

/** Lista do admin, da mais recente para a mais antiga. */
export async function getInscricoes() {
  if (!(await getUser())) return []
  return await prisma.inscricao.findMany({ orderBy: { numero: "desc" } })
}

/** Marca uma inscrição como paga, ou desfaz a marcação. */
export async function setInscricaoPaga(id: string, paga: boolean) {
  if (!(await getUser())) return
  await prisma.inscricao.update({
    where: { id },
    data: {
      status: paga ? "PAGA" : "AGUARDANDO",
      pagoEm: paga ? new Date() : null,
    },
  })

  revalidatePath("/admin/inscricoes")
}

/**
 * A mesma marcação, no formato que um <form> do admin envia. Deixa a lista
 * funcionar sem JavaScript no cliente.
 */
export async function toggleInscricaoPaga(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const paga = formData.get("paga") === "1"
  if (!id) return
  await setInscricaoPaga(id, paga)
}

/**
 * Apaga uma inscrição, de vez. Quem chama é o botão da lixeira do admin, que
 * só chega aqui depois do modal de confirmação.
 *
 * Não existe volta, e nem lixeira: a linha sai do banco. O número dela também
 * não volta a ser usado, porque `numero` é sequência do banco. Se a pessoa já
 * tinha pago, apagar não devolve dinheiro nenhum: apaga só o registro.
 */
export async function deleteInscricao(id: string) {
  if (!(await getUser())) return { error: "Não autorizado." }
  if (!id) return { error: "Inscrição não informada." }

  try {
    await prisma.inscricao.delete({ where: { id } })
    revalidatePath("/admin/inscricoes")
    return { success: true as const }
  } catch (error) {
    console.error("Erro ao apagar inscrição:", error)
    return { error: "Não foi possível apagar a inscrição." }
  }
}
