import "server-only"
import { createHash } from "node:crypto"
import { cookies, headers } from "next/headers"
import { registraErro } from "@/lib/log-erro"
import { CONSENT_COOKIE } from "@/utils/analytics"

/**
 * Meta Conversions API: o mesmo evento do pixel, mandado pelo servidor.
 *
 * Por que existe: o pixel do navegador perde evento. Bloqueador de anúncio,
 * Safari, aba fechada antes da tag disparar e cookie de terceiro bloqueado
 * fazem a conversão não chegar. A Conversions API manda o evento daqui, do
 * servidor, direto para o Meta, e por isso ele chega sempre.
 *
 * O evento daqui NÃO substitui o do navegador: os dois vão, e o Meta junta os
 * dois num só quando `event_name` e `event_id` são iguais nas duas pontas.
 * É esse `event_id` que impede a contagem em dobro, e é por isso que ele sai
 * daqui para o navegador (`InscricaoResult.eventId`) e de lá para a tag da GTM.
 *
 * Três regras valem aqui, as mesmas de lib/log-erro.ts:
 *
 * 1. Nada neste arquivo lança erro. Medição que quebra não pode derrubar uma
 *    inscrição: ninguém deixa de se inscrever porque o Meta estava fora do ar.
 * 2. Nada sai sem o aceite do banner de cookies. O pixel do navegador já é
 *    travado no consentimento pela GTM; aqui a trava é o cookie `irb_consent_v2`
 *    lido no servidor, e, para a baixa do pagamento, o que ficou gravado na
 *    inscrição. Sem aceite, nenhum byte sai.
 * 3. Contato vai embaralhado. E-mail, telefone e nome saem em SHA-256, que é
 *    o que o Meta espera e o que ele mesmo manda fazer: o texto puro nunca
 *    atravessa a rede.
 */

/** Pixel da igreja. É ID público, vai no HTML de toda página. */
const PIXEL_ID = process.env.META_PIXEL_ID?.trim() || "2253501382066542"
const TOKEN = process.env.META_CAPI_TOKEN?.trim() || ""
/** v26.0 era a mais nova aceita pela Graph API em 29/10/2026. */
const VERSAO = process.env.META_CAPI_API_VERSION?.trim() || "v26.0"
/** Só em teste: manda o evento para a aba "Eventos de teste" do painel. */
const CODIGO_DE_TESTE = process.env.META_CAPI_TEST_EVENT_CODE?.trim() || ""

/** Teto de espera. Medição não segura resposta de ninguém. */
const TIMEOUT_MS = 5000

export type EventoMeta = "CompleteRegistration" | "Purchase"

/**
 * O que o navegador de quem se inscreveu nos contou. Vale uma barbaridade
 * para o Meta casar o evento com o anúncio: `fbp` é o cookie que o pixel
 * escreve, e `fbc` guarda o clique no anúncio (`fbclid`) quando houve um.
 */
export type ContextoDoNavegador = {
  ip: string | null
  userAgent: string | null
  fbp: string | null
  fbc: string | null
  /** O banner estava aceito neste exato momento. */
  consentiu: boolean
}

export type PessoaDoEvento = {
  email?: string | null
  telefone?: string | null
  nome?: string | null
}

export type EnvioDeEvento = {
  nome: EventoMeta
  /** Chave de junção com o evento do navegador. Estável, nunca aleatória. */
  eventId: string
  /** Em centavos, como o banco guarda. A conversão para real é feita aqui. */
  valorEmCentavos?: number
  pessoa: PessoaDoEvento
  navegador?: Partial<Omit<ContextoDoNavegador, "consentiu">>
  /** Sem isto verdadeiro, nada sai. */
  consentiu: boolean
  /** Endereço da página de onde o evento nasceu, quando foi na web. */
  sourceUrl?: string | null
  /** Nome legível do que foi comprado ou registrado, para o painel do Meta. */
  conteudo?: string
  /**
   * "website" quando a pessoa estava no site; "system_generated" quando quem
   * registrou foi a igreja, horas depois, conferindo o extrato. A baixa do Pix
   * é esse segundo caso: não há navegador nenhum envolvido nela.
   */
  actionSource?: "website" | "system_generated"
}

function sha256(valor: string): string {
  return createHash("sha256").update(valor, "utf8").digest("hex")
}

/** Minúsculas, sem espaço nas pontas. É a normalização que o Meta pede. */
function embaralhaEmail(email: string): string | null {
  const limpo = email.trim().toLowerCase()
  return limpo.includes("@") ? sha256(limpo) : null
}

/**
 * Telefone em dígitos, com código do país na frente. O formulário recebe
 * "(61) 99999-9999", e sem o 55 o Meta não casa o número com ninguém.
 */
function embaralhaTelefone(telefone: string): string | null {
  const digitos = telefone.replace(/\D/g, "")
  if (digitos.length < 10) return null
  const comPais = digitos.startsWith("55") ? digitos : `55${digitos}`
  return sha256(comPais)
}

/** Minúsculas, sem acento e sem pontuação: a regra de nome do Meta. */
function normalizaNome(parte: string): string {
  return parte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
}

function embaralhaNome(nome: string): { fn?: string[]; ln?: string[] } {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return {}
  const primeiro = normalizaNome(partes[0])
  const ultimo = partes.length > 1 ? normalizaNome(partes[partes.length - 1]) : ""
  return {
    ...(primeiro ? { fn: [sha256(primeiro)] } : {}),
    ...(ultimo ? { ln: [sha256(ultimo)] } : {}),
  }
}

/**
 * Lê o navegador de quem está enviando o formulário AGORA. Só serve dentro de
 * uma requisição da pessoa: na baixa do pagamento, quem está no navegador é a
 * igreja, e usar isto lá misturaria os dois.
 */
export async function contextoDoNavegador(): Promise<ContextoDoNavegador> {
  try {
    const [h, c] = await Promise.all([headers(), cookies()])
    // Atrás da Vercel o IP de quem visita vem no x-forwarded-for, e o
    // primeiro da lista é a pessoa; os outros são proxies.
    const encaminhado = h.get("x-forwarded-for")?.split(",")[0]?.trim()
    return {
      ip: encaminhado || h.get("x-real-ip") || null,
      userAgent: h.get("user-agent") || null,
      fbp: c.get("_fbp")?.value ?? null,
      fbc: c.get("_fbc")?.value ?? null,
      consentiu: c.get(CONSENT_COOKIE)?.value === "granted",
    }
  } catch {
    // Fora de requisição (build, cron) não há navegador nenhum para ler, e
    // sem consentimento lido nada sai: é o lado seguro do erro.
    return {
      ip: null,
      userAgent: null,
      fbp: null,
      fbc: null,
      consentiu: false,
    }
  }
}

/** O envio está configurado? Sem token não existe Conversions API. */
export function capiConfigurada(): boolean {
  return Boolean(TOKEN && PIXEL_ID)
}

/**
 * Manda um evento para o Meta. Devolve verdadeiro quando o Meta confirmou o
 * recebimento. Nunca lança, e nunca avisa no WhatsApp: falha de medição vai
 * para /admin/erros e espera lá, porque ela não impede ninguém de se inscrever
 * e não vale acordar quem recebe o aviso de inscrição.
 */
export async function enviaEvento(envio: EnvioDeEvento): Promise<boolean> {
  if (!envio.consentiu) return false
  if (!capiConfigurada()) return false

  const { pessoa, navegador } = envio
  const em = pessoa.email ? embaralhaEmail(pessoa.email) : null
  const ph = pessoa.telefone ? embaralhaTelefone(pessoa.telefone) : null
  const partesDoNome = pessoa.nome ? embaralhaNome(pessoa.nome) : {}

  const user_data: Record<string, unknown> = {
    ...(em ? { em: [em] } : {}),
    ...(ph ? { ph: [ph] } : {}),
    ...partesDoNome,
    ...(navegador?.fbp ? { fbp: navegador.fbp } : {}),
    ...(navegador?.fbc ? { fbc: navegador.fbc } : {}),
    ...(navegador?.ip ? { client_ip_address: navegador.ip } : {}),
    ...(navegador?.userAgent ? { client_user_agent: navegador.userAgent } : {}),
  }

  // Sem nenhuma chave de casamento o evento chega e não serve para nada: o
  // Meta não tem como dizer de quem ele é.
  if (Object.keys(user_data).length === 0) return false

  const actionSource = envio.actionSource ?? "website"
  const custom_data: Record<string, unknown> = {
    ...(envio.valorEmCentavos != null
      ? { currency: "BRL", value: envio.valorEmCentavos / 100 }
      : {}),
    ...(envio.conteudo ? { content_name: envio.conteudo } : {}),
  }

  const corpo = {
    data: [
      {
        event_name: envio.nome,
        event_time: Math.floor(Date.now() / 1000),
        event_id: envio.eventId,
        action_source: actionSource,
        // O Meta recusa event_source_url em evento que não é de web.
        ...(actionSource === "website" && envio.sourceUrl
          ? { event_source_url: envio.sourceUrl }
          : {}),
        user_data,
        ...(Object.keys(custom_data).length > 0 ? { custom_data } : {}),
      },
    ],
    ...(CODIGO_DE_TESTE ? { test_event_code: CODIGO_DE_TESTE } : {}),
  }

  try {
    const resposta = await fetch(
      `https://graph.facebook.com/${VERSAO}/${PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // O token vai no cabeçalho, e não na URL: endereço entra em log de
          // servidor e de proxy, cabeçalho não.
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(corpo),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      },
    )

    if (!resposta.ok) {
      const texto = await resposta.text().catch(() => "")
      await registraErro({
        origem: "meta-capi",
        codigo: "META_CAPI_RECUSOU",
        nivel: "AVISO",
        mensagem:
          `O Meta recusou o evento ${envio.nome} (${envio.eventId}). A inscrição ` +
          "não foi afetada: só a medição desse evento ficou faltando.",
        // A resposta do Meta vem com o motivo, e não com dado de pessoa.
        causa: `HTTP ${resposta.status}: ${texto.slice(0, 1000)}`,
        avisar: false,
      })
      return false
    }

    return true
  } catch (erro) {
    await registraErro({
      origem: "meta-capi",
      codigo: "META_CAPI_SEM_RESPOSTA",
      nivel: "AVISO",
      mensagem:
        `O evento ${envio.nome} (${envio.eventId}) não chegou ao Meta. A ` +
        "inscrição não foi afetada: só a medição desse evento ficou faltando.",
      causa: erro,
      avisar: false,
    })
    return false
  }
}
