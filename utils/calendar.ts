import { CHURCH_ADDRESS_QUERY } from "@/const"

/**
 * Próximo domingo às 09h (Culto Matutino), como instante UTC.
 *
 * Brasília é UTC-3 fixo (o Brasil extinguiu o horário de verão em 2019), então
 * 09h local = 12h UTC, sem precisar de VTIMEZONE. Calculado a cada chamada: a
 * rota de agenda roda por requisição, então a data nunca congela no build.
 *
 * Regra de borda: se hoje já é domingo e ainda não deu 9h (horário de
 * Brasília), o alvo é hoje; caso contrário, o próximo domingo.
 */
export function nextSundayService(): { start: Date; end: Date } {
  const now = new Date()
  // "Agora" em Brasília: desloca o instante em -3h e lê os componentes UTC.
  const br = new Date(now.getTime() - 3 * 3600_000)
  const dow = br.getUTCDay() // 0 = domingo
  const hour = br.getUTCHours()

  let add = (7 - dow) % 7
  if (dow === 0 && hour >= 9) add = 7

  const alvo = new Date(br.getTime() + add * 86_400_000)
  const y = alvo.getUTCFullYear()
  const m = alvo.getUTCMonth()
  const d = alvo.getUTCDate()

  // 09h Brasília = 12h UTC; culto de ~2h.
  return {
    start: new Date(Date.UTC(y, m, d, 12, 0, 0)),
    end: new Date(Date.UTC(y, m, d, 14, 0, 0)),
  }
}

/** Carimbo iCalendar/Google em UTC: `20260830T120000Z`. */
function icalStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

const EVENT_TITLE = "Culto · Igreja Reformada de Brasília"
const EVENT_NOTE =
  "Venha nos visitar! Visitantes são bem-vindos, sem necessidade de avisar antes."

/**
 * URL do Google Agenda com o Culto Matutino do próximo domingo já preenchido.
 * O endereço vai no campo `location` (vira link de mapa dentro do evento).
 */
export function googleCalendarUrl(): string {
  const { start, end } = nextSundayService()
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${icalStamp(start)}/${icalStamp(end)}`,
    location: CHURCH_ADDRESS_QUERY,
    details: EVENT_NOTE,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Escapa vírgula, ponto-e-vírgula, barra invertida e quebra de linha (RFC 5545). */
function escapeICS(value: string): string {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n")
}

/**
 * Corpo de um arquivo .ics com o Culto Matutino do próximo domingo. O endereço
 * vai no LOCATION (vira link de mapa no app de calendário).
 */
export function icsBody(): string {
  const { start, end } = nextSundayService()
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IRB//Campanha//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:culto-${icalStamp(start)}@irbrasilia.org`,
    `DTSTAMP:${icalStamp(new Date())}`,
    `DTSTART:${icalStamp(start)}`,
    `DTEND:${icalStamp(end)}`,
    `SUMMARY:${escapeICS(EVENT_TITLE)}`,
    `LOCATION:${escapeICS(CHURCH_ADDRESS_QUERY)}`,
    `DESCRIPTION:${escapeICS(EVENT_NOTE)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
