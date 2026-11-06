import "server-only"
import { deflateSync } from "node:zlib"
import { LARGURA_HELVETICA, LARGURA_HELVETICA_BOLD } from "./pdf-metricas"

/**
 * Escreve um PDF de tabela de verdade, do zero.
 *
 * Mesma decisão do lib/xlsx.ts: nenhuma biblioteca nova entra no projeto por
 * causa disto. Um PDF é um arquivo de texto com objetos numerados, uma tabela
 * de posições no fim (a xref) e os desenhos escritos num fluxo de comandos. É
 * isso que este arquivo monta.
 *
 * Por que não imprimir a tela pelo navegador: o resultado depende do navegador
 * de quem clica, carrega o menu e a barra lateral do admin, corta coluna no
 * meio e muda de um computador para outro. Aqui a folha é a mesma sempre, e
 * sai do banco, não da tela.
 *
 * Fonte: Helvetica e Helvetica-Bold, que todo leitor de PDF já tem embutido.
 * Nada de arquivo de fonte dentro do PDF, e por isso o arquivo é pequeno.
 * A codificação declarada é WinAnsiEncoding, a que tem acento, til e cedilha.
 *
 * NADA aqui corta texto com reticências: a célula que não cabe na largura da
 * coluna quebra em mais linhas e a linha da tabela cresce. Cortar um e-mail no
 * meio seria publicar um dado errado.
 */

/* ------------------------------------------------------- codificação --- */

/**
 * Os caracteres que o WinAnsiEncoding põe de 0x80 a 0x9F, onde o Latin-1 não
 * tem nada. São os tipográficos: travessão, aspas curvas, reticências. Sem
 * este mapa eles virariam "?" no papel.
 */
const WINANSI_ALTO = new Map<number, number>([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
])

/** Um texto qualquer virado em códigos de WinAnsi, um por caractere. */
function emWinAnsi(texto: string): number[] {
  const saida: number[] = []
  for (const ch of texto) {
    const cp = ch.codePointAt(0) ?? 63
    if (cp === 0x0a || cp === 0x0d || cp === 0x09) {
      saida.push(32)
    } else if (cp >= 32 && cp <= 126) {
      saida.push(cp)
    } else if (cp >= 0xa0 && cp <= 0xff) {
      saida.push(cp)
    } else {
      const alto = WINANSI_ALTO.get(cp)
      saida.push(alto ?? 63)
    }
  }
  return saida
}

/** O que vai dentro de ( ) num PDF, com os três caracteres que precisam de barra. */
function literal(texto: string): string {
  let s = ""
  for (const codigo of emWinAnsi(texto)) {
    if (codigo === 0x28 || codigo === 0x29 || codigo === 0x5c) s += "\\"
    s += String.fromCharCode(codigo)
  }
  return s
}

/* ------------------------------------------------------------ medida --- */

export type Peso = "normal" | "forte"

function vetor(peso: Peso): readonly number[] {
  return peso === "forte" ? LARGURA_HELVETICA_BOLD : LARGURA_HELVETICA
}

/** Largura do texto em pontos, para um corpo de fonte. */
export function mede(
  texto: string,
  corpo: number,
  peso: Peso = "normal",
): number {
  const larguras = vetor(peso)
  let milesimos = 0
  for (const codigo of emWinAnsi(texto)) {
    milesimos += larguras[codigo] || 0
  }
  return (milesimos * corpo) / 1000
}

/**
 * Parte o texto nas linhas que cabem em `largura`.
 *
 * Quebra entre palavras. Quando uma palavra sozinha não cabe, e isso acontece
 * com e-mail comprido, ela é partida no caractere, porque a alternativa seria
 * deixá-la vazar por cima da coluna vizinha.
 */
export function quebra(
  texto: string,
  largura: number,
  corpo: number,
  peso: Peso = "normal",
): string[] {
  const limpo = String(texto ?? "")
    .replace(/\s+/g, " ")
    .trim()
  if (!limpo) return [""]
  if (mede(limpo, corpo, peso) <= largura) return [limpo]

  const linhas: string[] = []
  let atual = ""

  const empurra = () => {
    if (atual) linhas.push(atual)
    atual = ""
  }

  for (const palavra of limpo.split(" ")) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra
    if (mede(tentativa, corpo, peso) <= largura) {
      atual = tentativa
      continue
    }
    empurra()
    if (mede(palavra, corpo, peso) <= largura) {
      atual = palavra
      continue
    }
    // Palavra maior que a coluna: parte no caractere.
    let pedaco = ""
    for (const ch of palavra) {
      if (mede(pedaco + ch, corpo, peso) <= largura) {
        pedaco += ch
      } else {
        if (pedaco) linhas.push(pedaco)
        pedaco = ch
      }
    }
    atual = pedaco
  }
  empurra()
  return linhas.length ? linhas : [""]
}

/* ------------------------------------------------------------- tabela --- */

export interface ColunaPdf {
  titulo: string
  /** Largura da coluna em pontos. 1 ponto é 1/72 de polegada. */
  largura: number
  alinhamento?: "esquerda" | "direita"
}

export interface TabelaPdf {
  /** Título grande, só na primeira página. */
  titulo: string
  /** Linha abaixo do título. */
  subtitulo?: string
  /** Caixas de resumo acima da tabela, cada uma um par rótulo e valor. */
  resumo?: { rotulo: string; valor: string }[]
  colunas: ColunaPdf[]
  /** Uma linha da tabela por posição, já em texto. */
  linhas: string[][]
  /** Aviso fixo no pé de toda página, à esquerda. */
  rodape?: string
  /** Paisagem é o padrão: tabela com muitas colunas não cabe em retrato. */
  orientacao?: "paisagem" | "retrato"
  /** Momento que o rodapé cita. O padrão é agora. */
  geradoEm?: Date
}

/* As cores do site, as mesmas da tela do admin. */
const NAVY = [0, 0.09, 0.18] as const
const GOLD = [0.788, 0.635, 0.153] as const
const TINTA = [0.102, 0.102, 0.102] as const
const FRACA = [0.361, 0.361, 0.361] as const
const ZEBRA = [0.969, 0.965, 0.953] as const
const LINHA = [0.878, 0.863, 0.831] as const
const BRANCO = [1, 1, 1] as const

const MARGEM = 32
const CORPO = 8.5
const CORPO_CABECALHO = 7.5
const ALTURA_LINHA = 10.5
const FOLGA_CELULA = 4
const GAP_COLUNA = 6

const FUSO = "America/Sao_Paulo"

const QUANDO = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

/** "06/11/2026, 11:20" vira "06/11/2026 às 11h20". */
function quandoEscrito(d: Date): string {
  const [data, hora] = QUANDO.format(d).split(", ")
  return `${data} às ${(hora ?? "").replace(":", "h")}`
}

function cor(c: readonly number[]): string {
  return `${c[0]} ${c[1]} ${c[2]}`
}

type Comando = string[]

function retangulo(
  cmd: Comando,
  x: number,
  y: number,
  largura: number,
  altura: number,
  c: readonly number[],
) {
  cmd.push(`${cor(c)} rg`, `${x} ${y} ${largura} ${altura} re f`)
}

function escreve(
  cmd: Comando,
  texto: string,
  x: number,
  y: number,
  corpo: number,
  peso: Peso,
  c: readonly number[],
) {
  if (!texto) return
  cmd.push(
    `BT ${cor(c)} rg /${peso === "forte" ? "F2" : "F1"} ${corpo} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${literal(texto)}) Tj ET`,
  )
}

interface LinhaPronta {
  /** Cada célula já quebrada nas linhas que cabem na coluna. */
  celulas: string[][]
  altura: number
}

/** Monta o arquivo. O retorno é o PDF inteiro, pronto para baixar ou anexar. */
export function montaPdf(t: TabelaPdf): Buffer {
  const paisagem = (t.orientacao ?? "paisagem") === "paisagem"
  const largura = paisagem ? 842 : 595
  const altura = paisagem ? 595 : 842
  const geradoEm = t.geradoEm ?? new Date()

  const x0 = MARGEM
  const x1 = largura - MARGEM
  const larguraUtil = x1 - x0

  // Onde cada coluna começa. O espaço entre colunas sai da largura declarada,
  // então a soma das larguras é a largura ocupada de verdade.
  const colunas = t.colunas
  const inicios: number[] = []
  let caminho = x0
  for (const c of colunas) {
    inicios.push(caminho)
    caminho += c.largura + GAP_COLUNA
  }

  // Quebra toda célula antes de paginar: é a quebra que decide a altura da
  // linha, e é a altura que decide onde a página termina.
  const prontas: LinhaPronta[] = t.linhas.map((linha) => {
    const celulas = colunas.map((c, i) =>
      quebra(linha[i] ?? "", c.largura, CORPO),
    )
    const maior = Math.max(1, ...celulas.map((c) => c.length))
    return { celulas, altura: maior * ALTURA_LINHA + FOLGA_CELULA }
  })

  const alturaCabecalhoTabela = 18
  const alturaRodape = 26
  const pisoDaTabela = MARGEM + alturaRodape

  /**
   * Quanto o topo come de altura, antes do cabeçalho da tabela.
   *
   * Estes números são os MESMOS que desenhaPagina() gasta ao escrever o topo.
   * Se os dois discordarem, a última linha de uma página invade o rodapé, e é
   * por isso que cada parcela está nomeada aqui ao lado do que a consome.
   */
  function alturaDoTopo(primeira: boolean): number {
    if (!primeira) return 24 // o título de continuação
    let h = 62 // nome da igreja, título e o fio dourado
    if (t.subtitulo) h += 14
    if (t.resumo?.length) h += 44 // a caixa de 34 e a folga de 10
    return h
  }

  // Paginação: distribui as linhas pelas páginas.
  const paginas: LinhaPronta[][] = []
  let atual: LinhaPronta[] = []
  let y = altura - MARGEM - alturaDoTopo(true) - alturaCabecalhoTabela
  for (const linha of prontas) {
    if (y - linha.altura < pisoDaTabela && atual.length) {
      paginas.push(atual)
      atual = []
      y = altura - MARGEM - alturaDoTopo(false) - alturaCabecalhoTabela
    }
    atual.push(linha)
    y -= linha.altura
  }
  paginas.push(atual)

  const total = paginas.length
  const fluxos: Buffer[] = paginas.map((linhasDaPagina, indice) =>
    desenhaPagina({
      linhasDaPagina,
      indice,
      total,
      largura,
      altura,
      x0,
      x1,
      larguraUtil,
      colunas,
      inicios,
      t,
      geradoEm,
      alturaCabecalhoTabela,
      pisoDaTabela,
      alturaDoTopo,
    }),
  )

  return montaArquivo(fluxos, largura, altura, t.titulo, geradoEm)
}

interface Desenho {
  linhasDaPagina: LinhaPronta[]
  indice: number
  total: number
  largura: number
  altura: number
  x0: number
  x1: number
  larguraUtil: number
  colunas: ColunaPdf[]
  inicios: number[]
  t: TabelaPdf
  geradoEm: Date
  alturaCabecalhoTabela: number
  pisoDaTabela: number
  alturaDoTopo: (primeira: boolean) => number
}

function desenhaPagina(d: Desenho): Buffer {
  const cmd: Comando = []
  const primeira = d.indice === 0
  const { t, x0, x1, larguraUtil, colunas, inicios } = d

  let y = d.altura - MARGEM

  /* ----------------------------------------------------------- topo --- */

  if (primeira) {
    escreve(cmd, "Igreja Reformada de Brasília", x0, y - 9, 7.5, "forte", GOLD)
    y -= 22
    escreve(cmd, t.titulo, x0, y - 14, 19, "forte", NAVY)
    y -= 26
    if (t.subtitulo) {
      escreve(cmd, t.subtitulo, x0, y - 9, 9.5, "normal", FRACA)
      y -= 14
    }
    // Fio dourado embaixo do título.
    retangulo(cmd, x0, y - 4, 46, 2, GOLD)
    y -= 14

    if (t.resumo?.length) {
      const cada = (larguraUtil - (t.resumo.length - 1) * 8) / t.resumo.length
      const alturaCaixa = 34
      t.resumo.forEach((r, i) => {
        const cx = x0 + i * (cada + 8)
        retangulo(cmd, cx, y - alturaCaixa, cada, alturaCaixa, ZEBRA)
        retangulo(cmd, cx, y - alturaCaixa, 2, alturaCaixa, GOLD)
        escreve(cmd, r.rotulo, cx + 9, y - 13, 7, "normal", FRACA)
        escreve(cmd, r.valor, cx + 9, y - 27, 12, "forte", NAVY)
      })
      y -= alturaCaixa + 10
    }
  } else {
    escreve(cmd, `${t.titulo} · continuação`, x0, y - 10, 9, "forte", NAVY)
    y -= 24
  }

  /* -------------------------------------------- cabeçalho da tabela --- */

  const alturaCab = d.alturaCabecalhoTabela
  retangulo(cmd, x0, y - alturaCab, larguraUtil, alturaCab, NAVY)
  colunas.forEach((c, i) => {
    const titulo = c.titulo
    const direita = c.alinhamento === "direita"
    const tx = direita
      ? inicios[i] + c.largura - mede(titulo, CORPO_CABECALHO, "forte")
      : inicios[i]
    escreve(cmd, titulo, tx + 4, y - 12.5, CORPO_CABECALHO, "forte", BRANCO)
  })
  y -= alturaCab

  /* ---------------------------------------------------------- linhas --- */

  d.linhasDaPagina.forEach((linha, n) => {
    const topo = y
    const base = y - linha.altura
    // Zebra: a faixa clara entra em uma linha a cada duas, para o olho não
    // pular de uma linha para a de baixo numa tabela larga.
    if ((n + d.indice) % 2 === 1) {
      retangulo(cmd, x0, base, larguraUtil, linha.altura, ZEBRA)
    }
    retangulo(cmd, x0, base, larguraUtil, 0.4, LINHA)

    linha.celulas.forEach((pedacos, i) => {
      const c = colunas[i]
      pedacos.forEach((texto, l) => {
        if (!texto) return
        const direita = c.alinhamento === "direita"
        const tx = direita
          ? inicios[i] + c.largura - mede(texto, CORPO)
          : inicios[i]
        escreve(
          cmd,
          texto,
          tx + 4,
          topo - FOLGA_CELULA / 2 - ALTURA_LINHA * (l + 1) + 3,
          CORPO,
          "normal",
          TINTA,
        )
      })
    })
    y = base
  })

  /* ---------------------------------------------------------- rodapé --- */

  const yRodape = MARGEM + 8
  retangulo(cmd, x0, yRodape + 14, larguraUtil, 0.4, LINHA)
  if (t.rodape) {
    escreve(cmd, t.rodape, x0, yRodape, 7.5, "normal", FRACA)
  }
  const direita = `Gerado em ${quandoEscrito(d.geradoEm)} · Página ${d.indice + 1} de ${d.total}`
  escreve(cmd, direita, x1 - mede(direita, 7.5), yRodape, 7.5, "normal", FRACA)

  return Buffer.from(cmd.join("\n"), "latin1")
}

/* ------------------------------------------------------- o arquivo --- */

/** "D:20261106112033-03'00'", que é como o PDF escreve data. */
function dataDePdf(d: Date): string {
  const p: Record<string, string> = {}
  for (const parte of new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d)) {
    p[parte.type] = parte.value
  }
  return `D:${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}-03'00'`
}

/**
 * Junta os objetos numerados, a tabela de posições e o fecho.
 *
 * A xref guarda o byte exato onde cada objeto começa. Errar um byte aqui faz o
 * leitor recusar o arquivo inteiro, então a posição é medida enquanto os
 * pedaços são empilhados, nunca calculada depois.
 */
function montaArquivo(
  fluxos: Buffer[],
  largura: number,
  altura: number,
  titulo: string,
  geradoEm: Date,
): Buffer {
  const partes: Buffer[] = []
  let posicao = 0
  const offsets: number[] = []

  const empurra = (texto: string | Buffer) => {
    const b = typeof texto === "string" ? Buffer.from(texto, "latin1") : texto
    partes.push(b)
    posicao += b.length
  }

  /** Abre um objeto e anota onde ele começou. */
  const objeto = (numero: number, corpo: string | Buffer, extra?: Buffer) => {
    offsets[numero] = posicao
    empurra(`${numero} 0 obj\n`)
    empurra(corpo)
    if (extra) {
      empurra("\nstream\n")
      empurra(extra)
      empurra("\nendstream")
    }
    empurra("\nendobj\n")
  }

  empurra("%PDF-1.4\n")
  // Comentário com bytes altos: é a marca que faz programa de transferência
  // tratar o arquivo como binário, e não como texto.
  empurra("%\xe2\xe3\xcf\xd3\n")

  const PRIMEIRA_PAGINA = 6
  const quantas = fluxos.length
  const idsDePagina = fluxos.map((_, i) => PRIMEIRA_PAGINA + i * 2)
  const totalDeObjetos = PRIMEIRA_PAGINA + quantas * 2

  objeto(1, "<< /Type /Catalog /Pages 2 0 R >>")
  objeto(
    2,
    `<< /Type /Pages /Count ${quantas} /Kids [${idsDePagina
      .map((n) => `${n} 0 R`)
      .join(" ")}] >>`,
  )
  objeto(
    3,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  )
  objeto(
    4,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  )
  objeto(
    5,
    `<< /Title (${literal(titulo)}) /Producer (irbrasilia.org) /Creator (site da Igreja Reformada de Brasília) /CreationDate (${dataDePdf(geradoEm)}) >>`,
  )

  fluxos.forEach((fluxo, i) => {
    const idPagina = PRIMEIRA_PAGINA + i * 2
    const idFluxo = idPagina + 1
    objeto(
      idPagina,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${largura} ${altura}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${idFluxo} 0 R >>`,
    )
    // Fluxo comprimido: o mesmo zlib que o lib/xlsx.ts usa no zip do Excel.
    const comprimido = deflateSync(fluxo)
    objeto(
      idFluxo,
      `<< /Length ${comprimido.length} /Filter /FlateDecode >>`,
      comprimido,
    )
  })

  const inicioDaXref = posicao
  let xref = `xref\n0 ${totalDeObjetos}\n0000000000 65535 f \n`
  for (let n = 1; n < totalDeObjetos; n++) {
    xref += `${String(offsets[n] ?? 0).padStart(10, "0")} 00000 n \n`
  }
  empurra(xref)
  empurra(
    `trailer\n<< /Size ${totalDeObjetos} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${inicioDaXref}\n%%EOF\n`,
  )

  return Buffer.concat(partes)
}
