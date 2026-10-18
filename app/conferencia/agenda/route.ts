import {
  conferenceGoogleCalendarUrl,
  conferenceIcsBody,
} from "@/utils/calendar"

/**
 * "Adicionar à minha agenda" da conferência, com a mesma detecção por
 * User-Agent de /campanha/agenda: Apple recebe o arquivo .ics, que abre no
 * Apple Calendar; o resto vai para o Google Agenda.
 *
 * As datas são fixas (7 e 8 de novembro de 2026), então aqui nada depende do
 * momento da requisição e a rota pode ser estática.
 */
export function GET(request: Request) {
  const ua = request.headers.get("user-agent") ?? ""
  const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua)

  if (isApple) {
    return new Response(conferenceIcsBody(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="conferencia-irb.ics"',
      },
    })
  }

  return Response.redirect(conferenceGoogleCalendarUrl(), 302)
}
