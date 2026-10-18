/**
 * O que acontece com cada campo enquanto a pessoa digita.
 *
 * Tudo aqui é função pura, sem React e sem DOM, por dois motivos: dá para
 * conferir caso por caso, e a mesma regra pode ser usada em outro formulário
 * depois. Quem mexe no cursor é o componente, com `telefoneDigitado`.
 *
 * Nenhuma destas funções recusa nada. Formatar não é validar: quem decide se
 * o telefone tem dígito suficiente é o servidor, que é o único lugar onde a
 * regra não pode ser contornada.
 */

export function soDigitos(valor: string): string {
  return valor.replace(/\D+/g, "")
}

/**
 * O telefone do jeito que a igreja o lê: (61) 9 0000-0000 no celular e
 * (61) 3000-0000 no fixo. Ele se monta aos poucos, conforme os dígitos entram.
 *
 * Também aceita número colado de outro lugar: o +55 da frente e o zero do
 * "061" caem fora, porque vêm de quem copiou do WhatsApp ou da agenda.
 */
export function mascaraTelefone(bruto: string): string {
  let d = soDigitos(bruto)

  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2)
  if (d.length >= 11 && d.startsWith("0")) d = d.slice(1)
  d = d.slice(0, 11)

  if (d.length <= 2) return d ? `(${d}` : ""

  const ddd = d.slice(0, 2)
  const resto = d.slice(2)

  if (resto.length <= 4) return `(${ddd}) ${resto}`
  if (resto.length <= 8)
    return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`
  // Nove dígitos: o 9 da frente fica sozinho, como no cartão do WhatsApp.
  return `(${ddd}) ${resto[0]} ${resto.slice(1, 5)}-${resto.slice(5)}`
}

/** Onde o cursor deve parar: logo depois do n-ésimo dígito do texto formatado. */
function cursorDepoisDoDigito(formatado: string, quantos: number): number {
  if (quantos <= 0) return 0
  let vistos = 0
  for (let i = 0; i < formatado.length; i++) {
    if (formatado[i] >= "0" && formatado[i] <= "9") {
      vistos++
      if (vistos === quantos) return i + 1
    }
  }
  return formatado.length
}

/**
 * Uma tecla no campo de telefone: devolve o texto formatado e onde o cursor
 * fica. Chamar isto é o que evita os dois incômodos de máscara mal feita.
 *
 * O primeiro é o cursor saltar para o fim quando se corrige um dígito no meio.
 * Ele é resolvido contando dígitos, não caracteres: o cursor volta para depois
 * do mesmo dígito em que estava.
 *
 * O segundo é o apagar que não apaga. Com o cursor depois do ") ", o backspace
 * come o separador, a máscara o escreve de novo e o número nunca diminui. Aqui,
 * apagar em cima de separador apaga o dígito anterior, que é o que a pessoa
 * estava tentando fazer.
 */
export function telefoneDigitado(
  anterior: string,
  bruto: string,
  caret: number,
): { valor: string; cursor: number } {
  const antesDoCursor = soDigitos(bruto.slice(0, caret))
  let quantos = antesDoCursor.length

  const apagou = bruto.length < anterior.length
  const mesmosDigitos = soDigitos(bruto).length === soDigitos(anterior).length

  let digitos = soDigitos(bruto)
  if (apagou && mesmosDigitos && quantos > 0) {
    digitos = digitos.slice(0, quantos - 1) + digitos.slice(quantos)
    quantos -= 1
  }

  const valor = mascaraTelefone(digitos)
  return { valor, cursor: cursorDepoisDoDigito(valor, quantos) }
}

/** Começo de palavra: início do texto, ou depois de espaço, hífen ou apóstrofo. */
const INICIO_DE_PALAVRA = /(^|[\s'’-])(\p{L})/gu

/**
 * Nome com as iniciais em maiúscula, enquanto se digita.
 *
 * Mexe só na primeira letra de cada palavra, e no mais deixa o que foi
 * digitado: quem escreve tudo em maiúscula continua em maiúscula, e o texto
 * nunca muda de tamanho, então o cursor não precisa de conserto.
 */
export function mascaraNome(bruto: string): string {
  return bruto.replace(
    INICIO_DE_PALAVRA,
    (_, antes: string, letra: string) =>
      antes + letra.toLocaleUpperCase("pt-BR"),
  )
}

/**
 * As palavrinhas que ficam em minúscula no meio de um nome brasileiro. Nunca
 * na primeira posição: "Da Silva Ltda" seria estranho, mas "Dê" começando o
 * nome de alguém é nome mesmo.
 */
const PARTICULAS = new Set([
  "de",
  "da",
  "das",
  "do",
  "dos",
  "e",
  "di",
  "du",
  "del",
  "van",
  "von",
  "y",
])

/**
 * O acerto final, quando a pessoa sai do campo: espaço sobrando sai e as
 * partículas voltam para minúscula. Isto só acontece aqui, e não a cada tecla,
 * porque no meio da digitação a palavra ainda não terminou: quem está
 * escrevendo "Dedé" passa por "De", e não é partícula nenhuma.
 */
export function arrumaNome(bruto: string): string {
  const limpo = bruto.trim().replace(/\s+/g, " ")

  // Quem escreveu o nome inteiro em maiúscula fez de propósito. Baixar o "DE"
  // no meio de "MARIA DE SOUZA" não arruma nada, só estraga.
  const tudoMaiusculo = /\p{Lu}/u.test(limpo) && !/\p{Ll}/u.test(limpo)
  if (tudoMaiusculo) return limpo

  return limpo.split(" ")
    .map((p, i) => {
      const minuscula = p.toLocaleLowerCase("pt-BR")
      if (i > 0 && PARTICULAS.has(minuscula)) return minuscula
      return p
    })
    .join(" ")
}

/**
 * E-mail sem espaço e em minúscula. O teclado do celular põe maiúscula na
 * primeira letra por conta própria, e um espaço entra fácil ao colar.
 */
export function mascaraEmail(bruto: string): string {
  return bruto.replace(/\s+/g, "").toLowerCase()
}
