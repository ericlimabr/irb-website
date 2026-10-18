import "server-only"

/**
 * Aviso no WhatsApp quando chega uma inscrição.
 *
 * Quem entrega é o CallMeBot: a pessoa autoriza o número uma vez, conversando
 * com o bot, e recebe uma chave. Daí para a frente é uma chamada GET. Não há
 * conta da Meta, número de empresa nem aprovação de modelo de mensagem no
 * meio, e é por isso que serve aqui: aviso interno para a igreja, não canal de
 * atendimento de ninguém.
 *
 * O aviso é CÓPIA, igual à exportação em Excel: o original é o banco. Se o
 * CallMeBot estiver fora do ar, a inscrição continua válida e ninguém perde
 * nada além do toque no celular. Por isso nada aqui lança erro.
 *
 * O que vai na mensagem é de propósito o mínimo para alguém decidir se vai
 * olhar o admin: número, nome, quantas pessoas, dias e valor. E-mail e
 * telefone de quem se inscreveu NÃO vão. WhatsApp é tela de bloqueio, prévia
 * de notificação e aparelho emprestado; esses dados ficam onde já estão, atrás
 * do login do admin.
 */

/**
 * Um número por chave, na mesma ordem. Com uma vírgula em cada variável, o
 * aviso passa a sair para dois celulares:
 *
 *   WHATSAPP_ALERT_PHONE=556100000000,556111111111
 *   WHATSAPP_ALERT_APIKEY=111111,222222
 */
function destinos(): { telefone: string; chave: string }[] {
  const telefones = (process.env.WHATSAPP_ALERT_PHONE ?? "")
    .split(",")
    .map((t) => t.replace(/\D+/g, ""))
    .filter(Boolean)
  const chaves = (process.env.WHATSAPP_ALERT_APIKEY ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)

  if (telefones.length !== chaves.length) {
    console.error(
      `WhatsApp: ${telefones.length} número(s) para ${chaves.length} chave(s). ` +
        "Cada número tem a sua, e as duas listas andam na mesma ordem. Nada enviado.",
    )
    return []
  }

  return telefones.map((telefone, i) => ({ telefone, chave: chaves[i] }))
}

export function whatsappConfigurado(): boolean {
  return destinos().length > 0
}

/** Quanto esperar o CallMeBot antes de desistir e seguir sem o aviso. */
const TETO_MS = 8000

/**
 * Manda o aviso para todos os números configurados. Devolve para quantos foi.
 * Nunca lança: quem chama não precisa se proteger.
 */
export async function avisaNoWhatsApp(texto: string): Promise<number> {
  const lista = destinos()
  if (lista.length === 0) return 0

  const idas = lista.map(async ({ telefone, chave }) => {
    const url = new URL("https://api.callmebot.com/whatsapp.php")
    url.searchParams.set("phone", telefone)
    url.searchParams.set("apikey", chave)
    url.searchParams.set("text", texto)

    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(TETO_MS) })
      const corpo = (await r.text()).trim()
      // O bot responde em HTML, e no erro a palavra ERROR aparece no corpo
      // mesmo com status 200. O fim dos quatro últimos dígitos é o bastante
      // para saber de qual número se trata, sem escrever o número no log.
      const fim = telefone.slice(-4)
      if (!r.ok || /error/i.test(corpo)) {
        console.error(
          `WhatsApp recusou o aviso para ...${fim}:`,
          corpo.replace(/<[^>]*>/g, " ").slice(0, 200),
        )
        return false
      }
      return true
    } catch (erro) {
      console.error(
        `WhatsApp não respondeu para ...${telefone.slice(-4)}:`,
        erro instanceof Error ? erro.message : erro,
      )
      return false
    }
  })

  const resultados = await Promise.all(idas)
  return resultados.filter(Boolean).length
}
