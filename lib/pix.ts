import "server-only"
import QRCode from "qrcode"

/**
 * BR Code do Pix (o "copia e cola") e o QR correspondente.
 *
 * O formato é o EMV®QRCPS do Banco Central: uma sequência de campos
 * `IILLvalor`, onde II é o identificador de dois dígitos, LL o tamanho do
 * valor em dois dígitos, e o último campo é o CRC de todo o resto. Nada aqui
 * fala com banco nenhum: o código é montado localmente e quem confirma o
 * pagamento é a igreja, olhando o extrato.
 *
 * A chave vem de PIX_KEY, no ambiente. Enquanto a igreja não informar a chave
 * dela, montar o código é um erro declarado, e não um código que parece bom e
 * paga para o lugar errado.
 */

/** Um campo EMV. O tamanho é o do valor, em dois dígitos. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, "0") + valor
}

/**
 * CRC-16/CCITT-FALSE: polinômio 0x1021, resto inicial 0xFFFF, sem reflexão.
 * É o que o BR Code exige no campo 63, calculado sobre a cadeia inteira já
 * com "6304" no fim.
 */
export function crc16(payload: string): string {
  let resto = 0xffff
  for (let i = 0; i < payload.length; i++) {
    resto ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      resto =
        resto & 0x8000
          ? ((resto << 1) ^ 0x1021) & 0xffff
          : (resto << 1) & 0xffff
    }
  }
  return resto.toString(16).toUpperCase().padStart(4, "0")
}

/**
 * Remove acento e qualquer caractere que o campo EMV não aceita. Mantém o
 * sublinhado e NÃO força maiúscula: o nome e a cidade saem exatamente como o
 * banco da igreja os emite no QR dela, onde o nome vem como
 * "IGREJA_REFORMADA_DE_BRASI", com sublinhado e truncado em 25.
 */
function limpa(texto: string, limite: number): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ._-]/g, "")
    .trim()
    .slice(0, limite)
}

/** Identificador da transação: só letra e número, no máximo 25. */
export function sanitizeTxid(txid: string): string {
  return txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25)
}

export interface PixPayloadInput {
  /** Chave Pix de quem recebe. */
  key: string
  /** Nome do recebedor, até 25 caracteres. */
  merchantName: string
  /** Cidade do recebedor, até 15 caracteres. */
  merchantCity: string
  /** Valor em centavos. Centavo em ponto flutuante arredonda errado. */
  amountCents: number
  /** Identificador da transação, campo 62. */
  txid: string
}

export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amountCents,
  txid,
}: PixPayloadInput): string {
  if (!key) throw new Error("Chave Pix ausente: defina PIX_KEY no ambiente.")
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error(`Valor inválido para o Pix: ${amountCents}`)
  }

  const valor = (amountCents / 100).toFixed(2)
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", key)

  const semCrc =
    campo("00", "01") +
    // 12: QR com valor, para uma cobrança só. 11 seria reutilizável.
    campo("01", "12") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", valor) +
    campo("58", "BR") +
    campo("59", limpa(merchantName, 25)) +
    campo("60", limpa(merchantCity, 15)) +
    campo("62", campo("05", sanitizeTxid(txid))) +
    "6304"

  return semCrc + crc16(semCrc)
}

/**
 * Os dados de quem recebe, do ambiente.
 *
 * A chave NÃO tem valor padrão de propósito: um padrão aqui seria um Pix que
 * parece funcionar e paga para outra conta. Enquanto PIX_KEY estiver vazia, a
 * inscrição falha com recado claro. Nome e cidade têm padrão porque errá-los
 * não manda dinheiro para o lugar errado, só mostra um rótulo diferente do
 * cadastro do banco.
 */
export const PIX_KEY = process.env.PIX_KEY ?? ""
export const PIX_MERCHANT_NAME =
  process.env.PIX_MERCHANT_NAME ?? "IGREJA REFORMADA"
export const PIX_MERCHANT_CITY = process.env.PIX_MERCHANT_CITY ?? "BRASILIA"

/** BR Code da igreja para um valor e um identificador. */
export function churchPixPayload(amountCents: number, txid: string): string {
  return buildPixPayload({
    key: PIX_KEY,
    merchantName: PIX_MERCHANT_NAME,
    merchantCity: PIX_MERCHANT_CITY,
    amountCents,
    txid,
  })
}

/** QR do BR Code como data URL PNG, para ir na página e no e-mail. */
export async function pixQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 420,
    color: { dark: "#000000", light: "#FFFFFF" },
  })
}

/**
 * QR do BR Code como PNG cru, para o e-mail. Cliente de e-mail (o Gmail entre
 * eles) ignora `src="data:..."`, então na mensagem o QR vai como anexo
 * embutido por cid, e não como data URL.
 */
export async function pixQrPng(payload: string): Promise<Buffer> {
  return QRCode.toBuffer(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 420,
    color: { dark: "#000000", light: "#FFFFFF" },
  })
}
