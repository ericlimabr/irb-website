import "server-only"
import { prisma } from "@/lib/prisma"
import { avisaNoWhatsApp } from "@/lib/whatsapp"
import { SITE_URL } from "@/utils/siteUrl"

/**
 * Aviso no WhatsApp quando um convidado passa a ter acesso ao painel.
 *
 * Por que existe: convidar alguém, hoje, é dar acesso inteiro ao painel, e o
 * convite é assíncrono. Entre o seu clique em "convidar" e a pessoa estar
 * dentro podem passar horas ou dias, e ninguém ficaria olhando a tela de
 * usuários para saber quando aconteceu.
 *
 * Qual é o momento avisado: quando a pessoa ESCREVE A SENHA, em
 * app/actions/auth.ts, e não quando ela clica no link do e-mail. O clique só
 * abre uma sessão de passagem; é a senha que faz o acesso existir daí para
 * frente. Quem clica no link e desiste antes de criar a senha não gera aviso,
 * e também não consegue voltar.
 *
 * Diferente de lib/log-erro.ts em dois pontos, de propósito:
 *
 * 1. Não tem janela de silêncio. Se você convidar três pessoas e as três
 *    aceitarem na mesma hora, são três avisos. Aqui cada evento conta um por
 *    um, e perder um seria perder a notícia de um acesso.
 * 2. O endereço da conta VAI na mensagem. A regra de lib/whatsapp.ts, de
 *    manter contato fora do WhatsApp, protege quem se inscreve na conferência.
 *    Aqui o endereço é a própria identidade do acesso concedido: sem ele o
 *    aviso não serve para nada, porque você não saberia qual conta entrou nem
 *    qual revogar.
 *
 * Nada aqui lança erro: a pessoa está no meio de criar a senha, e o aviso não
 * pode atrapalhar isso.
 */

/** Data e hora de Brasília, que é o fuso de quem lê o aviso. */
function agoraEmBrasilia(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())
}

export type ConvidadoQueEntrou = {
  email: string | null
  /** O nome que ela mesma escreveu, ou o que você digitou no convite. */
  nome: string | null
}

export async function avisaConviteAceito(
  quem: ConvidadoQueEntrou,
): Promise<void> {
  const quemFoi = quem.nome?.trim() || quem.email || "Alguém"

  const linhas = [
    "🔑 Novo acesso ao painel da igreja",
    "",
    `${quemFoi} aceitou o convite e criou a senha.`,
    ...(quem.email && quem.email !== quemFoi ? [`Conta: ${quem.email}`] : []),
    "",
    "Esse acesso vê o painel inteiro, menos usuários e manutenção.",
    `${agoraEmBrasilia()} (horário de Brasília)`,
    "",
    `${SITE_URL}/admin/usuarios`,
  ]

  let avisados = 0
  try {
    avisados = await avisaNoWhatsApp(linhas.join("\n"))
  } catch (falha) {
    console.error(
      "Aviso de convite aceito não saiu:",
      falha instanceof Error ? falha.message : falha,
    )
  }

  // O registro fica junto das falhas porque é a linha do tempo que o painel
  // já mostra. A gravação é direta, e não por registraErro, para guardar
  // quantos celulares receberam de fato este aviso.
  try {
    await prisma.logErro.create({
      data: {
        origem: "admin",
        codigo: "CONVITE_ACEITO",
        nivel: "AVISO",
        mensagem: `${quemFoi} aceitou o convite e criou a senha do painel.`,
        contato: quem.email,
        avisados,
      },
    })
  } catch (falha) {
    console.error(
      "Convite aceito não pôde ser registrado:",
      falha instanceof Error ? falha.message : falha,
    )
  }
}
