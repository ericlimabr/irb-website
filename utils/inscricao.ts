import {
  CONFERENCE_PIX_CENTS,
  CONFERENCE_PRICE_CENTS,
  CONFERENCE_PRICE_LABEL,
  CONFERENCE_DAY_CHOICES,
} from "@/const"

/**
 * Contas e rótulos da inscrição, puros de propósito: o formulário (cliente)
 * mostra o total enquanto a pessoa escolhe, e a action (servidor) grava e
 * manda o e-mail. Se cada lado fizesse a sua própria conta, a tela e o e-mail
 * poderiam divergir em um centavo, que é justamente o que identifica o Pix.
 */

/**
 * Total em centavos: adultos a R$ 20, mais os 7 centavos fixos da conferência.
 * Eles entram uma vez só, não por adulto, e por isso o total nunca é redondo.
 */
export function inscricaoTotalCents(adultos: number): number {
  return adultos * CONFERENCE_PRICE_CENTS + CONFERENCE_PIX_CENTS
}

/** "2 adultos a R$ 20, e 1 criança que não paga". */
export function pessoasLabel(adultos: number, criancas: number): string {
  const a = `${adultos} ${adultos > 1 ? "adultos" : "adulto"} a ${CONFERENCE_PRICE_LABEL}`
  if (!criancas) return a
  const c =
    criancas > 1
      ? `${criancas} crianças que não pagam`
      : `${criancas} criança que não paga`
  return `${a}, e ${c}`
}

/** Rótulo dos dias, do mesmo lugar de onde saem os botões do formulário. */
export function diasLabel(dias: string): string {
  return (
    CONFERENCE_DAY_CHOICES.find((d) => d.value === dias)?.label ??
    CONFERENCE_DAY_CHOICES[0].label
  )
}

/**
 * De onde a pessoa vem, por extenso. Os mesmos rótulos no e-mail interno e na
 * planilha exportada, para a igreja não ler duas palavras para a mesma coisa.
 */
const VINCULO_ESCRITO: Record<string, string> = {
  MEMBRO: "Membro ou congregado desta igreja",
  OUTRA_IGREJA: "De outra igreja",
  CONVIDADO: "Convidado por alguém",
  SEM_IGREJA: "Ainda não frequenta igreja",
}

export function vinculoLabel(vinculo: string): string {
  return VINCULO_ESCRITO[vinculo] ?? vinculo
}

/** "R$ 20,07" a partir de 2007 centavos. Mesma formatação nos dois lados. */
export function brl(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`
}
