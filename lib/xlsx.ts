import "server-only"
import { deflateRawSync } from "node:zlib"

/**
 * Escreve uma planilha .xlsx de verdade, do zero.
 *
 * Um .xlsx é um arquivo .zip com alguns XML dentro. É isso que este arquivo
 * monta: o XML das células e o zip em volta. Nenhuma biblioteca nova entra no
 * projeto por causa disto, e o Excel, o LibreOffice e o Google Sheets abrem o
 * resultado do mesmo jeito.
 *
 * Por que não um .csv: no .csv o Excel resolve sozinho o que é número, data e
 * dinheiro, e erra. "R$ 20,07" vira texto, 07/11 vira data americana, e o
 * telefone perde o zero da frente. Aqui cada coluna declara o que é, e chega
 * formatada.
 */

/** Data e hora sempre no fuso de Brasília, como no resto do site. */
const FUSO = "America/Sao_Paulo"

const PARTES_DA_DATA = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
})

export type ValorDeCelula = string | number | Date | null | undefined

/** O que a coluna guarda. Decide o formato com que o Excel a mostra. */
export type FormatoDeColuna = "texto" | "inteiro" | "dinheiro" | "dataHora"

export interface ColunaExcel {
  titulo: string
  formato?: FormatoDeColuna
  /** Largura em caracteres, do jeito que o Excel conta. */
  largura?: number
}

export interface PlanilhaExcel {
  /** Nome da aba. O Excel corta em 31 caracteres e proíbe : \ / ? * [ ] */
  nomeDaAba: string
  colunas: ColunaExcel[]
  linhas: ValorDeCelula[][]
}

/* ------------------------------------------------------------------ XML --- */

function escapa(texto: string): string {
  // O XML não aceita os caracteres de controle, e um nome colado de outro
  // lugar pode trazer um deles sem ninguém ver.
  return texto
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

/** 1 vira A, 27 vira AA. */
function letraDaColuna(n: number): string {
  let s = ""
  while (n > 0) {
    const resto = (n - 1) % 26
    s = String.fromCharCode(65 + resto) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

/**
 * O número que o Excel usa para data: dias desde 30/12/1899, com a hora na
 * parte decimal. Ele não guarda fuso nenhum, então o instante é convertido
 * para a hora de Brasília antes da conta.
 */
function serialDeData(d: Date): number {
  const p: Record<string, string> = {}
  for (const parte of PARTES_DA_DATA.formatToParts(d)) {
    p[parte.type] = parte.value
  }
  const dias =
    Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day)) / 86400000
  const base = Date.UTC(1899, 11, 30) / 86400000
  const segundos =
    Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second)
  return dias - base + segundos / 86400
}

/** Os estilos declarados no styles.xml, na ordem em que aparecem lá. */
const ESTILO = { padrao: 0, cabecalho: 1, dataHora: 2, dinheiro: 3, inteiro: 4 }

function estiloDaColuna(formato: FormatoDeColuna | undefined): number {
  if (formato === "dataHora") return ESTILO.dataHora
  if (formato === "dinheiro") return ESTILO.dinheiro
  if (formato === "inteiro") return ESTILO.inteiro
  return ESTILO.padrao
}

function celula(
  ref: string,
  valor: ValorDeCelula,
  formato: FormatoDeColuna | undefined,
): string {
  if (valor === null || valor === undefined || valor === "") return ""
  const s = estiloDaColuna(formato)

  if (valor instanceof Date) {
    return `<c r="${ref}" s="${ESTILO.dataHora}"><v>${serialDeData(valor)}</v></c>`
  }
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return `<c r="${ref}" s="${s}"><v>${valor}</v></c>`
  }
  // Texto vai inline: assim não existe a tabela de textos repetidos, que é a
  // parte mais fácil de errar no formato.
  return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${escapa(String(valor))}</t></is></c>`
}

function nomeDeAbaValido(nome: string): string {
  const limpo = nome.replace(/[:\\/?*[\]]/g, " ").trim()
  return (limpo || "Planilha").slice(0, 31)
}

function montaFolha(p: PlanilhaExcel): string {
  const colunas = p.colunas
  const ultima = letraDaColuna(colunas.length)
  const totalDeLinhas = p.linhas.length + 1

  const larguras = colunas
    .map((c, i) => {
      const largura = c.largura ?? Math.max(10, c.titulo.length + 2)
      return `<col min="${i + 1}" max="${i + 1}" width="${largura}" customWidth="1"/>`
    })
    .join("")

  const cabecalho = colunas
    .map(
      (c, i) =>
        `<c r="${letraDaColuna(i + 1)}1" s="${ESTILO.cabecalho}" t="inlineStr"><is><t>${escapa(c.titulo)}</t></is></c>`,
    )
    .join("")

  const corpo = p.linhas
    .map((linha, l) => {
      const n = l + 2
      const celulas = colunas
        .map((c, i) =>
          celula(`${letraDaColuna(i + 1)}${n}`, linha[i], c.formato),
        )
        .join("")
      return `<row r="${n}">${celulas}</row>`
    })
    .join("")

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<dimension ref="A1:${ultima}${totalDeLinhas}"/>` +
    // A primeira linha fica congelada: a igreja rola a lista sem perder o
    // nome das colunas.
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    `<cols>${larguras}</cols>` +
    `<sheetData><row r="1" ht="22" customHeight="1">${cabecalho}</row>${corpo}</sheetData>` +
    // O filtro do cabeçalho, para ordenar e filtrar sem configurar nada.
    `<autoFilter ref="A1:${ultima}${totalDeLinhas}"/>` +
    `</worksheet>`
  )
}

const ESTILOS_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
  `<numFmts count="2">` +
  `<numFmt numFmtId="164" formatCode="dd/mm/yyyy\\ hh:mm"/>` +
  `<numFmt numFmtId="165" formatCode="&quot;R$&quot;\\ #,##0.00"/>` +
  `</numFmts>` +
  `<fonts count="2">` +
  `<font><sz val="11"/><name val="Calibri"/></font>` +
  `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
  `</fonts>` +
  `<fills count="3">` +
  `<fill><patternFill patternType="none"/></fill>` +
  `<fill><patternFill patternType="gray125"/></fill>` +
  // O azul do site, para o cabeçalho não parecer rascunho.
  `<fill><patternFill patternType="solid"><fgColor rgb="FF16283C"/><bgColor indexed="64"/></patternFill></fill>` +
  `</fills>` +
  `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="5">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
  `<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`

const TIPOS_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
  `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
  `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
  `</Types>`

const RELS_RAIZ =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
  `</Relationships>`

const RELS_PASTA =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
  `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
  `</Relationships>`

/* ------------------------------------------------------------------ zip --- */

const TABELA_CRC = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf: Buffer): number {
  let c = -1
  for (let i = 0; i < buf.length; i++) {
    c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ -1) >>> 0
}

// Data fixa nas entradas do zip: o Excel não a mostra em lugar nenhum, e com
// ela o mesmo conteúdo gera sempre o mesmo arquivo, byte a byte.
const HORA_DOS = 0
const DATA_DOS = ((2026 - 1980) << 9) | (1 << 5) | 1

interface Entrada {
  nome: string
  conteudo: Buffer
}

/** Monta o zip com as entradas na ordem dada. */
function zipa(entradas: Entrada[]): Buffer {
  const locais: Buffer[] = []
  const central: Buffer[] = []
  let deslocamento = 0

  for (const entrada of entradas) {
    const nome = Buffer.from(entrada.nome, "utf8")
    const cru = entrada.conteudo
    const comprimido = deflateRawSync(cru, { level: 9 })
    const crc = crc32(cru)

    const cabecalho = Buffer.alloc(30)
    cabecalho.writeUInt32LE(0x04034b50, 0)
    cabecalho.writeUInt16LE(20, 4) // versão necessária
    cabecalho.writeUInt16LE(0x0800, 6) // nome em UTF-8
    cabecalho.writeUInt16LE(8, 8) // deflate
    cabecalho.writeUInt16LE(HORA_DOS, 10)
    cabecalho.writeUInt16LE(DATA_DOS, 12)
    cabecalho.writeUInt32LE(crc, 14)
    cabecalho.writeUInt32LE(comprimido.length, 18)
    cabecalho.writeUInt32LE(cru.length, 22)
    cabecalho.writeUInt16LE(nome.length, 26)
    cabecalho.writeUInt16LE(0, 28)

    locais.push(cabecalho, nome, comprimido)

    const ficha = Buffer.alloc(46)
    ficha.writeUInt32LE(0x02014b50, 0)
    ficha.writeUInt16LE(20, 4) // versão de quem escreveu
    ficha.writeUInt16LE(20, 6)
    ficha.writeUInt16LE(0x0800, 8)
    ficha.writeUInt16LE(8, 10)
    ficha.writeUInt16LE(HORA_DOS, 12)
    ficha.writeUInt16LE(DATA_DOS, 14)
    ficha.writeUInt32LE(crc, 16)
    ficha.writeUInt32LE(comprimido.length, 20)
    ficha.writeUInt32LE(cru.length, 24)
    ficha.writeUInt16LE(nome.length, 28)
    ficha.writeUInt32LE(deslocamento, 42)

    central.push(ficha, nome)
    deslocamento += cabecalho.length + nome.length + comprimido.length
  }

  const diretorio = Buffer.concat(central)
  const fim = Buffer.alloc(22)
  fim.writeUInt32LE(0x06054b50, 0)
  fim.writeUInt16LE(entradas.length, 8)
  fim.writeUInt16LE(entradas.length, 10)
  fim.writeUInt32LE(diretorio.length, 12)
  fim.writeUInt32LE(deslocamento, 16)

  return Buffer.concat([...locais, diretorio, fim])
}

/** O arquivo .xlsx pronto, para devolver numa resposta HTTP. */
export function montaXlsx(p: PlanilhaExcel): Buffer {
  const aba = nomeDeAbaValido(p.nomeDaAba)
  const livro =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets><sheet name="${escapa(aba)}" sheetId="1" r:id="rId1"/></sheets>` +
    `</workbook>`

  const texto = (s: string) => Buffer.from(s, "utf8")

  return zipa([
    { nome: "[Content_Types].xml", conteudo: texto(TIPOS_XML) },
    { nome: "_rels/.rels", conteudo: texto(RELS_RAIZ) },
    { nome: "xl/workbook.xml", conteudo: texto(livro) },
    { nome: "xl/_rels/workbook.xml.rels", conteudo: texto(RELS_PASTA) },
    { nome: "xl/styles.xml", conteudo: texto(ESTILOS_XML) },
    { nome: "xl/worksheets/sheet1.xml", conteudo: texto(montaFolha(p)) },
  ])
}
