import "server-only"
import { prisma } from "@/lib/prisma"

/**
 * Tudo o que a visão geral do painel mostra.
 *
 * DUAS REGRAS NASCERAM DO ERRO DE 02/11/2026, quando a tela anunciou "0 falhas
 * sem baixa" existindo duas:
 *
 * 1. POUCAS CONSULTAS. A versão anterior disparava quinze contagens em
 *    paralelo, uma por número. Com o cliente do Prisma sendo recriado a cada
 *    acesso (ver lib/prisma.ts), aquilo abria um pool de conexões por
 *    contagem, e o pooler do Supabase recusava parte delas. Agora cada grupo
 *    de números sai de UMA consulta: `groupBy` devolve contagem e soma por
 *    categoria de uma vez.
 * 2. ZERO NÃO É RESPOSTA PARA FALHA. Quando uma leitura não dá certo, o grupo
 *    inteiro volta `null` e a tela mostra travessão e avisa. Antes, todo erro
 *    virava zero em silêncio, que é o pior resultado possível: a igreja lê
 *    "nada pendente" quando há coisa pendente.
 */

/** Executa a leitura, e se ela falhar devolve null depois de registrar. */
async function leitura<T>(
  nome: string,
  f: () => Promise<T>,
): Promise<T | null> {
  try {
    return await f()
  } catch (erro) {
    // Vai para o log da Vercel. Não entra em LogErro de propósito: a visão
    // geral é lida justamente para conferir falhas, e gravar uma falha a cada
    // abertura da tela encheria a lista com o próprio sintoma.
    console.error(`[painel] falha ao ler ${nome}:`, erro)
    return null
  }
}

export type Movimento = {
  id: string
  quando: Date
  /** O que aconteceu, em uma frase. */
  texto: string
  /** A informação secundária, mais apagada na tela. */
  detalhe: string
  href: string
}

/** O primeiro nome, que é o quanto basta para reconhecer a linha. */
function primeiroNome(nome: string): string {
  const p = nome.trim().split(/\s+/)[0]
  return p ? p.charAt(0).toUpperCase() + p.slice(1) : "Alguém"
}

/**
 * Os últimos acontecimentos de verdade, de três tabelas, misturados em ordem
 * de tempo. A tela antiga tinha uma lista fixa escrita no código ("Sermão:
 * Romanos 8:28", "A Fé Reformada e os Sacramentos"), que nunca existiu em
 * lugar nenhum: era enfeite com cara de dado.
 */
async function ultimosMovimentos(): Promise<Movimento[]> {
  const inscricoes =
    (await leitura("últimas inscrições", () =>
      prisma.inscricao.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          createdAt: true,
          nome: true,
          adultos: true,
          criancas: true,
          status: true,
        },
      }),
    )) ?? []

  const mensagens =
    (await leitura("últimas mensagens", () =>
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          createdAt: true,
          name: true,
          subject: true,
          read: true,
        },
      }),
    )) ?? []

  const falhas =
    (await leitura("últimas falhas", () =>
      prisma.logErro.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          createdAt: true,
          mensagem: true,
          nivel: true,
          vistoEm: true,
        },
      }),
    )) ?? []

  const tudo: Movimento[] = [
    ...inscricoes.map((i) => {
      const pessoas = i.adultos + i.criancas
      return {
        id: `insc-${i.id}`,
        quando: i.createdAt,
        texto: `Inscrição de ${primeiroNome(i.nome)}`,
        detalhe:
          (pessoas > 1 ? `${pessoas} pessoas, ` : "") +
          (i.status === "PAGA" ? "já paga" : "aguardando o Pix"),
        href: "/admin/inscricoes",
      }
    }),
    ...mensagens.map((m) => ({
      id: `msg-${m.id}`,
      quando: m.createdAt,
      texto: `Mensagem de ${primeiroNome(m.name)}`,
      detalhe: m.read ? m.subject : `${m.subject}, ainda não lida`,
      href: `/admin/mensagens/${m.id}`,
    })),
    ...falhas.map((f) => ({
      id: `erro-${f.id}`,
      quando: f.createdAt,
      texto: f.nivel === "AVISO" ? "Aviso do site" : "Falha no site",
      detalhe: f.vistoEm ? `${f.mensagem}, com baixa` : f.mensagem,
      href: "/admin/erros",
    })),
  ]

  return tudo
    .sort((a, b) => b.quando.getTime() - a.quando.getTime())
    .slice(0, 6)
}

/** Mensagens de contato: total e não lidas, numa consulta. */
async function lerMensagens() {
  return leitura("mensagens", async () => {
    const grupos = await prisma.contactMessage.groupBy({
      by: ["read"],
      _count: { _all: true },
    })
    const lidas = grupos.find((g) => g.read)?._count._all ?? 0
    const naoLidas = grupos.find((g) => !g.read)?._count._all ?? 0
    return { naoLidas, total: lidas + naoLidas }
  })
}

/**
 * Falhas do site: total e sem baixa. São duas contagens porque `vistoEm` é
 * data, e agrupar por data traria uma linha por instante em vez de duas.
 */
async function lerFalhas() {
  return leitura("falhas", async () => {
    const [total, semBaixa] = await Promise.all([
      prisma.logErro.count(),
      prisma.logErro.count({ where: { vistoEm: null } }),
    ])
    return { total, semBaixa }
  })
}

/** Inscrições: contagem, gente e dinheiro por situação, numa consulta. */
async function lerInscricoes() {
  return leitura("inscrições", async () => {
    const grupos = await prisma.inscricao.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { valor: true, adultos: true, criancas: true },
    })

    /*
      CANCELADA É UM TERCEIRO ESTADO, e isto aqui já errou uma vez: a conta
      `aguardando = total - pagas` jogava inscrição cancelada no balcão de
      "aguardando Pix", e somava o valor dela em "a receber" como se a igreja
      ainda esperasse aquele dinheiro. A tela de Inscrições sempre tratou os
      três separados, e é com ela que estes números precisam bater.
    */
    const de = (status: string) => grupos.find((g) => g.status === status)
    const aguardandoG = de("AGUARDANDO")
    const pagasG = de("PAGA")

    const total = grupos.reduce((t, g) => t + g._count._all, 0)
    const pessoas = grupos.reduce(
      (t, g) => t + (g._sum.adultos ?? 0) + (g._sum.criancas ?? 0),
      0,
    )

    return {
      total,
      pagas: pagasG?._count._all ?? 0,
      aguardando: aguardandoG?._count._all ?? 0,
      canceladas: de("CANCELADA")?._count._all ?? 0,
      pessoas,
      recebidoCentavos: pagasG?._sum.valor ?? 0,
      aReceberCentavos: aguardandoG?._sum.valor ?? 0,
    }
  })
}

/**
 * Consentimento de cookies: três consultas, uma por recorte (todas, navegador
 * de dentro do app, segunda chamada). Antes eram oito contagens soltas.
 */
async function lerConsentimento() {
  return leitura("consentimento", async () => {
    const porTipo = (
      linhas: { type: string; _count: { _all: number } }[],
      tipo: string,
    ) => linhas.find((l) => l.type === tipo)?._count._all ?? 0

    const [todas, noApp, segunda] = await Promise.all([
      prisma.consentEvent.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.consentEvent.groupBy({
        by: ["type"],
        where: { inApp: true },
        _count: { _all: true },
      }),
      prisma.consentEvent.groupBy({
        by: ["type"],
        where: { retomada: true },
        _count: { _all: true },
      }),
    ])

    const exibido = porTipo(todas, "shown")
    const aceitou = porTipo(todas, "accept")
    const recusou = porTipo(todas, "reject")

    return {
      exibido,
      aceitou,
      recusou,
      // "Ignorou" não é evento gravado: sai por subtração.
      ignorou: Math.max(0, exibido - aceitou - recusou),
      appExibido: porTipo(noApp, "shown"),
      appAceitou: porTipo(noApp, "accept"),
      segundaExibido: porTipo(segunda, "shown"),
      segundaDecidiu: porTipo(segunda, "accept") + porTipo(segunda, "reject"),
    }
  })
}

export async function resumoDoPainel() {
  // Em série, e não em paralelo: são leituras pequenas, e disparar tudo de uma
  // vez contra o pooler do Supabase é justamente o que derrubava parte delas.
  const mensagens = await lerMensagens()
  const falhas = await lerFalhas()
  const inscricoes = await lerInscricoes()
  const consentimento = await lerConsentimento()
  const movimentos = await ultimosMovimentos()

  const naoLidos: string[] = []
  if (!mensagens) naoLidos.push("mensagens")
  if (!falhas) naoLidos.push("falhas do site")
  if (!inscricoes) naoLidos.push("inscrições")
  if (!consentimento) naoLidos.push("consentimento")

  return { mensagens, falhas, inscricoes, consentimento, movimentos, naoLidos }
}

export type ResumoDoPainel = Awaited<ReturnType<typeof resumoDoPainel>>
