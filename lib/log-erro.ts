import "server-only"
import { prisma } from "@/lib/prisma"
import { avisaNoWhatsApp } from "@/lib/whatsapp"
import { SITE_URL } from "@/utils/siteUrl"

/**
 * Log de falhas do site, com aviso no WhatsApp.
 *
 * Por que existe: até 20/10/2026 a única forma de saber que o site tinha
 * quebrado era alguém reclamar. Foi assim que descobrimos que o campo-isca
 * dos formulários estava recusando pessoas de verdade: uma irmã avisou. O
 * `console.error` que já havia no código só aparece no painel da Vercel, que
 * ninguém olha de hora em hora e que expira.
 *
 * Como funciona: cada falha vira uma linha em LogErro e, se merecer, um
 * aviso no WhatsApp pelo mesmo CallMeBot que avisa das inscrições.
 *
 * Três regras valem aqui:
 *
 * 1. Nada neste arquivo lança erro. Quem chama está no meio de uma falha; o
 *    registro dela não pode virar uma segunda falha.
 * 2. Nome e contato da pessoa vão para o banco, nunca para o WhatsApp. O
 *    WhatsApp é tela de bloqueio e aparelho emprestado, e a regra é a mesma
 *    do aviso de inscrição em lib/whatsapp.ts.
 * 3. Aviso tem janela de silêncio por código. Se o banco cair, cada visita
 *    falha, e sem a janela o celular tocaria sem parar.
 */

/** Quanto tempo o mesmo código fica calado depois de avisar. */
const JANELA_DE_SILENCIO_MS = 10 * 60 * 1000

/** Teto do texto da exceção gravado em `detalhe`. */
const TETO_DETALHE = 4000

/**
 * Última vez que cada código avisou, nesta instância do servidor. Na Vercel
 * cada instância tem a sua, por isso a contagem no banco logo abaixo também
 * é consultada: a memória é a defesa que sobra quando o banco é o problema.
 */
const ultimoAviso = new Map<string, number>()

export type NivelDeErro = "AVISO" | "ERRO"

export type ErroParaRegistrar = {
  /** Em que parte do site: "inscricao", "contato", "admin". */
  origem: string
  /** Código curto e estável, em maiúsculas com underscore. */
  codigo: string
  /** A falha em português, para quem lê o admin e o WhatsApp. */
  mensagem: string
  nivel?: NivelDeErro
  /** A exceção, quando houve uma. Vira texto com classe, frase e pilha. */
  causa?: unknown
  /** Nome que a pessoa digitou, se o formulário já tinha chegado nele. */
  pessoa?: string | null
  /** E-mail ou telefone que ela digitou. Só o banco vê. */
  contato?: string | null
  /** Falso para gravar sem tocar o celular de ninguém. */
  avisar?: boolean
}

function texto(causa: unknown): string | null {
  if (causa == null) return null
  if (causa instanceof Error) {
    const corpo = [`${causa.name}: ${causa.message}`, causa.stack ?? ""]
      .join("\n")
      .trim()
    return corpo.slice(0, TETO_DETALHE)
  }
  try {
    return JSON.stringify(causa).slice(0, TETO_DETALHE)
  } catch {
    return String(causa).slice(0, TETO_DETALHE)
  }
}

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

/**
 * Já avisamos este código agora há pouco? Primeiro a memória desta instância,
 * que responde sem banco. Depois o banco, que enxerga as outras instâncias.
 * Na dúvida o aviso sai: perder um aviso é pior do que repetir um.
 */
async function estaNaJanelaDeSilencio(codigo: string): Promise<boolean> {
  const marca = ultimoAviso.get(codigo)
  if (marca && Date.now() - marca < JANELA_DE_SILENCIO_MS) return true

  try {
    const desde = new Date(Date.now() - JANELA_DE_SILENCIO_MS)
    const quantos = await prisma.logErro.count({
      where: { codigo, avisados: { gt: 0 }, createdAt: { gte: desde } },
    })
    return quantos > 0
  } catch {
    return false
  }
}

/**
 * Grava a falha e, quando for o caso, avisa no WhatsApp. Nunca lança.
 * Devolve para quantos celulares o aviso saiu, para quem quiser conferir.
 */
export async function registraErro(
  entrada: ErroParaRegistrar,
): Promise<number> {
  const {
    origem,
    codigo,
    mensagem,
    nivel = "ERRO",
    causa,
    pessoa = null,
    contato = null,
    avisar = true,
  } = entrada

  const detalhe = texto(causa)

  // O console continua: é o que a Vercel mostra na hora, e é o único canal
  // que sobra se o banco e o CallMeBot estiverem os dois fora do ar.
  console.error(`[${origem}/${codigo}] ${mensagem}`, detalhe ?? "")

  let avisados = 0
  if (avisar && !(await estaNaJanelaDeSilencio(codigo))) {
    const linhas = [
      nivel === "ERRO"
        ? "⚠️ Falha no site da igreja"
        : "ℹ️ Aviso do site da igreja",
      `${origem} · ${codigo}`,
      "",
      mensagem,
      ...(pessoa ? [`Pessoa: ${pessoa}`] : []),
      `${agoraEmBrasilia()} (horário de Brasília)`,
      "",
      `${SITE_URL}/admin/erros`,
    ]
    avisados = await avisaNoWhatsApp(linhas.join("\n"))
    if (avisados > 0) ultimoAviso.set(codigo, Date.now())
  }

  try {
    await prisma.logErro.create({
      data: {
        origem,
        codigo,
        nivel,
        mensagem,
        detalhe,
        pessoa,
        contato,
        avisados,
      },
    })
  } catch (falha) {
    // O banco é justamente o que costuma cair. O aviso já saiu, e o console
    // guarda o resto; não há mais nada a fazer daqui sem virar recursão.
    console.error(
      "LogErro não pôde ser gravado:",
      falha instanceof Error ? falha.message : falha,
    )
  }

  return avisados
}
