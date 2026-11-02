import { CONFERENCE_DAYS } from "@/const"

/**
 * Quantos dias faltam para a conferência, e o rótulo que a tela mostra.
 *
 * A conta é feita em dias de calendário de Brasília, e não em múltiplos de 24
 * horas: para quem olha o painel, "amanhã" é amanhã mesmo às 23h de hoje. Por
 * isso as duas datas são reduzidas ao dia (ano, mês, dia) no fuso de Brasília
 * antes da subtração.
 */

const DIA_MS = 24 * 60 * 60 * 1000

/** O instante reduzido ao começo do dia dele em Brasília, como UTC. */
function diaEmBrasilia(quando: Date): number {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(quando)
  const [ano, mes, dia] = partes.split("-").map(Number)
  return Date.UTC(ano, mes - 1, dia)
}

export type ContagemConferencia = {
  /** Negativo depois que o último dia passou. */
  dias: number
  /** "5 dias", "amanhã", "é hoje". Vazio quando já passou. */
  rotulo: string
  /** Falso depois do último dia: a tela deixa de falar do evento. */
  vigente: boolean
}

export function contagemDaConferencia(
  agora: Date = new Date(),
): ContagemConferencia {
  const primeiro = CONFERENCE_DAYS[0]?.start
  const ultimo = CONFERENCE_DAYS[CONFERENCE_DAYS.length - 1]?.end
  if (!primeiro || !ultimo) return { dias: 0, rotulo: "", vigente: false }

  const hoje = diaEmBrasilia(agora)
  const dias = Math.round((diaEmBrasilia(primeiro) - hoje) / DIA_MS)

  if (agora.getTime() > ultimo.getTime()) {
    return { dias, rotulo: "", vigente: false }
  }
  if (dias <= 0) return { dias, rotulo: "é hoje", vigente: true }
  if (dias === 1) return { dias, rotulo: "amanhã", vigente: true }
  return { dias, rotulo: `${dias} dias`, vigente: true }
}
