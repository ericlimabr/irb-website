"use server"

import { revalidatePath, updateTag } from "next/cache"
import {
  InscricaoComoSoube,
  InscricaoDias,
  InscricaoVinculo,
} from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  inscricoesEncerradasAgora,
  TAG_INSCRICOES,
} from "@/lib/inscricoes-estado"
import { getUser } from "@/utils/getUser"
import { isValidEmail, sanitizeEmail } from "@/utils/strings"
import { churchPixPayload, pixQrDataUrl, pixQrPng, PIX_KEY } from "@/lib/pix"
import { sendInscricaoConfirmationEmail } from "@/lib/mail"
import { avisaNoWhatsApp } from "@/lib/whatsapp"
import { registraErro } from "@/lib/log-erro"
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
  ISCA_CAMPO,
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
  | {
      success: false
      error: string
      /** Verdadeiro quando a saída da pessoa é falar com a igreja. */
      falarComAIgreja?: boolean
    }

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
  // Isca de robô: caixa de marcar escondida, que pessoa nenhuma vê nem marca.
  //
  // Ela NÃO RECUSA MAIS NADA, de propósito, e const/isca.ts conta a história
  // inteira: a isca barrou gente de verdade duas vezes, primeiro pelo nome do
  // campo e depois pelo preenchimento automático do celular, que acha campo de
  // texto escondido mesmo sem conhecer o nome dele. Palpite não pode ficar
  // entre uma pessoa e a inscrição dela. Quem defende de robô aqui é o limite
  // por e-mail, logo abaixo, que conta linhas no banco em vez de chutar.
  //
  // O campo continua existindo como sinal: se vier marcado, a inscrição segue
  // em frente e fica uma linha de aviso pedindo para a igreja conferir se
  // aquela inscrição é de gente.
  const iscaMarcada = formData.get(ISCA_CAMPO)
  if (iscaMarcada) {
    await registraErro({
      origem: "inscricao",
      codigo: "ISCA_MARCADA",
      nivel: "AVISO",
      mensagem:
        "A isca de robô veio marcada e a inscrição seguiu em frente de " +
        "propósito. Confira se esta inscrição é de gente antes de dar baixa " +
        "no pagamento.",
      pessoa: String(formData.get("nome") ?? "").trim() || null,
      contato: String(formData.get("email") ?? "").trim() || null,
      causa: `valor recebido no campo da isca: ${String(iscaMarcada).slice(0, 200)}`,
    })
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
  // Encerrada é encerrada, inclusive para quem deixou a página aberta antes
  // do botão ser clicado, e para quem monta o envio à mão. A leitura aqui
  // nunca vem de cache, e se ela falhar o erro sobe para o catch de baixo, que
  // recusa a inscrição: aceitar depois do encerramento é pior do que pedir
  // para tentar de novo.
  //
  // A leitura fica no seu próprio try porque ela acontece ANTES do try grande
  // lá embaixo: sem isto, um erro aqui escapa da action inteira, a promessa no
  // navegador é rejeitada e a pessoa fica olhando o botão travado, sem
  // mensagem nenhuma. Agora o erro é gravado e avisado, e a pessoa é mandada
  // para o WhatsApp da igreja.
  try {
    if (await inscricoesEncerradasAgora()) {
      return {
        success: false,
        error:
          "As inscrições estão encerradas. Fale com a igreja se ainda quiser participar.",
      }
    }
  } catch (erro) {
    await registraErro({
      origem: "inscricao",
      codigo: "ESTADO_DAS_INSCRICOES_ILEGIVEL",
      mensagem:
        "Não deu para ler no banco se as inscrições estão abertas, e por isso " +
        "nenhuma inscrição está sendo aceita agora.",
      causa: erro,
      pessoa: nome || null,
      contato: email || null,
    })
    return {
      success: false,
      error:
        "A inscrição está fora do ar neste momento. Fale com a igreja pelo " +
        "WhatsApp e nós inscrevemos você.",
      falarComAIgreja: true,
    }
  }
  if (!PIX_KEY) {
    // Sem chave não existe Pix que preste: é melhor não inscrever ninguém do
    // que entregar um código que não paga a igreja.
    await registraErro({
      origem: "inscricao",
      codigo: "PIX_KEY_AUSENTE",
      mensagem:
        "Falta a variável PIX_KEY no ambiente: ninguém consegue se inscrever " +
        "até ela voltar.",
      pessoa: nome || null,
      contato: email || null,
    })
    return {
      success: false,
      error:
        "A inscrição está temporariamente indisponível. Fale com a igreja pelo WhatsApp.",
    }
  }
  // Se a contagem falhar, a inscrição segue: barrar quem não fez nada é pior
  // do que deixar passar uma repetição. O erro fica registrado.
  try {
    if (await isRateLimited(email)) {
      return {
        success: false,
        error:
          "Já recebemos inscrições deste e-mail. Tente novamente em 1 hora.",
      }
    }
  } catch (erro) {
    await registraErro({
      origem: "inscricao",
      codigo: "LIMITE_POR_EMAIL_ILEGIVEL",
      mensagem:
        "Não deu para contar as inscrições recentes deste e-mail. A inscrição " +
        "seguiu em frente sem o limite.",
      nivel: "AVISO",
      causa: erro,
      contato: email || null,
    })
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

    if (!emailEnviado) {
      await registraErro({
        origem: "inscricao",
        codigo: "EMAIL_NAO_ENVIADO",
        mensagem:
          `A inscrição ${String(inscricao.numero).padStart(4, "0")} foi gravada, ` +
          "mas o e-mail com o QR Code não saiu. A pessoa viu o código na tela; " +
          "quem quiser o e-mail precisa receber na mão.",
        nivel: "AVISO",
        pessoa: nome,
        contato: email,
      })
    }

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
    await registraErro({
      origem: "inscricao",
      codigo: "GRAVACAO_FALHOU",
      mensagem:
        "A inscrição não foi gravada. Quem estava na tela recebeu um pedido " +
        "para tentar de novo.",
      causa: error,
      pessoa: nome || null,
      contato: email || null,
    })
    return {
      success: false,
      error:
        "Não foi possível concluir a inscrição. Tente de novo em instantes, " +
        "ou fale com a igreja pelo WhatsApp.",
      falarComAIgreja: true,
    }
  }
}

/** Lista do admin, da mais recente para a mais antiga. */
export async function getInscricoes() {
  if (!(await getUser())) return []
  return await prisma.inscricao.findMany({ orderBy: { numero: "desc" } })
}

/**
 * Encerra ou reabre as inscrições. É o botão do admin.
 *
 * Grava no banco e derruba na hora o que estava pronto em cache: o rótulo que
 * a página pública usa para ler o estado, a própria página e a lista do admin.
 * Sem isso o botão mudaria o banco e a página continuaria dizendo o contrário
 * até o cache vencer por conta própria.
 */
export async function setInscricoesEncerradas(encerrar: boolean) {
  if (!(await getUser())) return { error: "Não autorizado." }

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
      update: { conferenciaEncerrada: encerrar },
      create: { id, conferenciaEncerrada: encerrar },
    })
  } catch (error) {
    console.error("Erro ao mudar o estado das inscrições:", error)
    return { error: "Não foi possível mudar o estado das inscrições." }
  }

  // `updateTag` e não `revalidateTag`: estamos dentro de uma action, e ele dá
  // leitura do que acabou de ser escrito. Assim a própria tela do admin já
  // volta com o estado novo, em vez de mostrar o anterior por um instante.
  updateTag(TAG_INSCRICOES)
  revalidatePath(CONFERENCE_PATH)
  revalidatePath("/admin/inscricoes")
  return { success: true as const, encerrada: encerrar }
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
