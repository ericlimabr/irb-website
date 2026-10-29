import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Beacon de medição do banner de consentimento (LGPD).
 *
 * Chamado pelo `CookieConsent` quando o banner APARECE e quando o usuário
 * ACEITA/RECUSA — ou seja, para gente que ainda não consentiu. Por isso o que
 * gravamos é agregado e SEM PII (ver modelo `ConsentEvent`): o IP e o
 * User-Agent são LIDOS aqui só para derivar contexto grosseiro (país, tipo de
 * dispositivo, se é o navegador in-app do FB/IG) e NÃO são persistidos.
 *
 * Melhor esforço: qualquer falha é engolida com 204 — medição nunca pode
 * quebrar a experiência de quem só quer decidir sobre cookies.
 */
export const dynamic = "force-dynamic"

const VALID_TYPES = new Set(["shown", "accept", "reject"])

/**
 * Deriva "mobile" | "tablet" | "desktop" do User-Agent (categoria grossa).
 *
 * A ordem importa, e ela foi corrigida em 29/10/2026. A regra de tablet inclui
 * `Android` sem a palavra `Mobile`, e é EXATAMENTE assim que o navegador
 * embutido do Facebook e do Instagram se apresenta no Android. O resultado era
 * que 98 das 101 exibições contadas como "tablet" eram WebView de aplicativo:
 * o painel do admin mostrava tablet onde não havia tablet nenhum. Por isso o
 * teste de app vem primeiro, e dentro de app Android é celular.
 */
function deviceFromUA(ua: string): string {
  if (isInAppUA(ua)) {
    if (/iPad/i.test(ua)) return "tablet"
    return /Macintosh|Windows NT|X11/i.test(ua) ? "desktop" : "mobile"
  }
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet"
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return "mobile"
  return "desktop"
}

/** Navegador embutido de app (Instagram, Facebook, etc.) via marcadores no UA. */
function isInAppUA(ua: string): boolean {
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|Pinterest|Snapchat|MicroMessenger/i.test(
    ua,
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string
      source?: string
      campaign?: string
      path?: string
      retomada?: boolean
    }

    const type = body.type
    if (!type || !VALID_TYPES.has(type)) {
      return new Response(null, { status: 400 })
    }

    const ua = request.headers.get("user-agent") ?? ""
    // País pelo header do edge (Vercel), sem tocar no IP em si.
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null

    // Sanitiza o texto vindo do cliente: valores curtos e enumerados.
    const source =
      body.source === "campaign" || body.source === "organic" ? body.source : null
    const campaign = body.campaign ? String(body.campaign).slice(0, 120) : null
    const path = body.path ? String(body.path).slice(0, 200) : null

    await prisma.consentEvent.create({
      data: {
        type,
        source,
        campaign,
        path,
        device: deviceFromUA(ua),
        inApp: isInAppUA(ua),
        // Segunda chamada: a barra compacta que reaparece para quem não
        // decidiu. Separa o que o banner original ganhou do que só veio porque
        // perguntamos de novo.
        retomada: body.retomada === true,
        country,
      },
    })

    return new Response(null, { status: 204 })
  } catch {
    // Banco ausente/instável ou corpo inválido: não é problema do usuário.
    return new Response(null, { status: 204 })
  }
}
