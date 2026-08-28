import { googleCalendarUrl, icsBody } from "@/utils/calendar"

// Calcula o próximo domingo a cada requisição — a data nunca congela no build.
export const dynamic = "force-dynamic"

/**
 * Rota única de "adicionar à agenda", com detecção de dispositivo pelo
 * User-Agent:
 *
 * - Apple (iPhone/iPad/Mac) → serve o arquivo `.ics`, que abre no Apple
 *   Calendar (e é servido de verdade, confiável no iOS).
 * - Todo o resto (Android, desktop) → redireciona pro Google Agenda.
 *
 * O SO é uma pista forte do calendário provável, não garantia (ex.: alguém no
 * Windows usando Outlook cairia no Google). Para o público mobile da campanha
 * o acerto é altíssimo. O `.ics` ainda é importável no Google, então ninguém
 * fica sem opção.
 *
 * O clique neste link é medido como `Schedule` do Meta na GTM, pelo mesmo
 * padrão de gatilho por URL do WhatsApp e do Maps.
 */
export function GET(request: Request) {
  const ua = request.headers.get("user-agent") ?? ""
  const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua)

  if (isApple) {
    return new Response(icsBody(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="culto-irb.ics"',
      },
    })
  }

  return Response.redirect(googleCalendarUrl(), 302)
}
