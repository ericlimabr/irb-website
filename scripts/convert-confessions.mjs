#!/usr/bin/env node
/**
 * convert-confessions.mjs — Markdown → committed data modules.
 *
 * Reads the Three Forms of Unity from the upstream content repo
 * (app-irb-confessions, format defined in its docs/FORMATO.md) and emits
 * typed data modules under const/confessions/, consumed by the confession
 * pages. This is a one-time/occasional converter: commit its output.
 *
 * Usage:  node scripts/convert-confessions.mjs [path-to-fontes-dir]
 * Default source: ../app-irb-confessions/fontes (sibling of this repo).
 *
 * It does not invent text. Where the source has documented defects
 * (see FORMATO.md §6), the text passes through verbatim and the anomaly is
 * printed to the report at the end.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, "..")
const SRC_DIR = resolve(
  REPO_ROOT,
  process.argv[2] ?? "../app-irb-confessions/fontes",
)
const OUT_DIR = resolve(REPO_ROOT, "const/confessions")

const FILES = {
  belgic: "belgic/A Confissão Belga.md",
  dort: "dort/Os Cânones de Dort.md",
  heidelberg: "heidelberg/O Catecismo de Heidelberg.md",
}

const report = []
const note = (msg) => report.push(msg)

// ── text helpers ────────────────────────────────────────────────────────────

/** Strip note markers, emphasis markup; collapse whitespace runs. */
function cleanInline(text) {
  return (
    text
      .replace(/<sup>[^<]*<\/sup>/g, "") // note markers
      // Underscores are only ever italic-emphasis markers here, so drop them all.
      // A per-pair strip would leave strays when a `_…_` span crosses lines
      // (the Ten Commandments in Q92, the Lord's Prayer in Q119), since text is
      // cleaned line by line and the opening/closing markers land on separate lines.
      .replace(/_/g, "") // italic emphasis → plain
      .replace(/\*\*/g, "") // stray bold markers → plain
      .replace(/\s+/g, " ")
      // Correct a source extraction artifact: "SENHOR" (small caps) comes
      // through split as "SE NHOR" in 8 places (Heidelberg Ten Commandments
      // et al.). Fixing the spurious space is a typographic repair, not a
      // wording change. Run after whitespace collapse so the gap is a plain space.
      .replace(/SE NHOR/g, "SENHOR")
      .trim()
  )
}

/**
 * True when `text` is nothing but scripture citations (`Rm 3.9, 10; 1Jo 1:10`).
 * This is what separates a reference block from numbered *content* such as the
 * Apostles' Creed (Q23) or the Ten Commandments (Q92), which also arrive as
 * ordered-list lines but are prose, not citations.
 */
function isRefLine(text) {
  const t = text.replace(/\.\s*$/, "").trim()
  if (!t) return false
  const citations = t.split(";")
  return citations.every((c) =>
    // optional book abbrev (≤4 letters, optional 1-3 prefix) — omitted on a
    // continuation chapter (`Gn 6.5; 8.21`) — then a number + verse punctuation
    /^\s*(?:[1-3]?\s?[A-Za-zÀ-ÿ]{1,4}\.?\s+)?\d+[\d.,:\s–-]*$/.test(c),
  )
}

/** Roman numeral (I, II, III…) → integer, for part/chapter ordinals. */
function romanToInt(r) {
  const map = { I: 1, V: 5, X: 10 }
  let n = 0
  for (let i = 0; i < r.length; i++) {
    const cur = map[r[i]]
    const next = map[r[i + 1]]
    n += next > cur ? -cur : cur
  }
  return n
}

/**
 * Split a unit's raw lines into body paragraphs and a joined refs string.
 * `numbered` toggles the Heidelberg/Belgic form (refs are `N. …` ordered-list
 * lines keyed to <sup> markers) vs. the Dort form (refs are a single trailing
 * unnumbered citation paragraph).
 */
function splitBodyAndRefs(lines, { numbered }) {
  const bodyParas = []
  const refs = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (numbered) {
      const m = line.match(/^(\d+)\.\s+(.*)$/)
      if (m && isRefLine(m[2])) {
        refs.push(cleanInline(m[2]).replace(/\.\s*$/, ""))
        continue
      }
    }
    bodyParas.push(cleanInline(line))
  }

  // Dort: the refs are the last body paragraph if it is pure citations.
  if (!numbered && bodyParas.length) {
    const last = bodyParas[bodyParas.length - 1]
    if (isRefLine(last)) {
      bodyParas.pop()
      refs.push(last.replace(/\.\s*$/, ""))
    }
  }

  // Drop an answer marker / punctuation-only fragments left behind.
  const paragraphs = bodyParas
    .map((p) =>
      p
        .replace(/^R\.\s*/, "")
        .replace(/^[-*]\s+/, "")
        .trim(),
    )
    .filter((p) => p && !/^[:.,;–-]+$/.test(p))

  return { paragraphs, refs: refs.join(" · ") }
}

function readSource(key) {
  return readFileSync(resolve(SRC_DIR, FILES[key]), "utf8").split(/\r?\n/)
}

// ── Belgic ──────────────────────────────────────────────────────────────────

function parseBelgic() {
  const lines = readSource("belgic")
  const articles = []
  let cur = null

  const flush = () => {
    if (!cur) return
    const { paragraphs, refs } = splitBodyAndRefs(cur.raw, { numbered: true })
    articles.push({ number: cur.number, title: cur.title, paragraphs, refs })
  }

  for (const line of lines) {
    const art = line.match(/^##\s+ARTIGO\s+(\d+)/i)
    if (art) {
      flush()
      cur = { number: Number(art[1]), title: "", raw: [] }
      continue
    }
    if (!cur) continue
    const title = line.match(/^###\s+(.*)$/)
    if (title && !cur.title) {
      cur.title = cleanInline(title[1])
      continue
    }
    // #### sub-headers (only art. 4) → keep their text as body
    cur.raw.push(line.replace(/^#{4}\s+/, ""))
  }
  flush()

  if (articles.length !== 37)
    note(`Belgic: expected 37 articles, got ${articles.length}`)
  for (const a of articles) {
    if (!a.paragraphs.length) note(`Belgic art. ${a.number}: no body text`)
    if (!a.refs) note(`Belgic art. ${a.number}: no scripture refs`)
  }
  return articles
}

// ── Dort ────────────────────────────────────────────────────────────────────

const DORT_HEADS = ["I", "II", "III/IV", "V"] // 4 chapters, 3rd+4th unified

function parseDort() {
  const lines = readSource("dort")
  const articles = []
  const rejections = [] // one { head, intro, errors[] } per Head of Doctrine
  let conclusion = null // { intro[], calumnies[], outro[] }
  let chapterIdx = -1
  let cur = null // current article being collected
  let mode = "articles" // "articles" | "rejection" | "conclusion"
  let rej = null // current rejection block
  let curErr = null // current { number, statement, refutation } inside a block

  const flush = () => {
    if (!cur) return
    const { paragraphs, refs } = splitBodyAndRefs(cur.raw, { numbered: false })
    articles.push({
      head: DORT_HEADS[cur.chapterIdx],
      number: cur.number,
      title: cur.title,
      paragraphs,
      refs,
    })
  }

  for (const line of lines) {
    if (/^#\s+~.*CAP[IÍ]TULO/i.test(line)) {
      flush()
      cur = null
      chapterIdx++
      mode = "articles"
      rej = null
      curErr = null
      continue
    }
    if (/^##\s+REJEI/i.test(line)) {
      flush()
      cur = null
      mode = "rejection"
      rej = { head: DORT_HEADS[chapterIdx], intro: "", errors: [] }
      rejections.push(rej)
      curErr = null
      continue
    }
    if (/^#\s+CONCLUS/i.test(line)) {
      flush()
      cur = null
      mode = "conclusion"
      conclusion = { intro: [], calumnies: [], outro: [] }
      continue
    }
    const art = line.match(/^##\s+ARTIGO\s+(\d+)/i)
    if (art) {
      flush()
      cur = { chapterIdx, number: Number(art[1]), title: "", raw: [] }
      mode = "articles"
      continue
    }

    if (mode === "articles") {
      if (!cur) continue
      const title = line.match(/^###\s+(.*)$/)
      if (title && !cur.title) {
        cur.title = cleanInline(title[1])
        continue
      }
      cur.raw.push(line)
      continue
    }

    if (mode === "rejection") {
      const raw = line.trim()
      if (!raw) continue
      const errM = raw.match(/^\*\*Erro\s+(\d+)\*\*\s*[—–-]\s*(.*)$/i)
      if (errM) {
        curErr = {
          number: Number(errM[1]),
          statement: cleanInline(errM[2]),
          refutation: "",
        }
        rej.errors.push(curErr)
        continue
      }
      const refM = raw.match(/^\*\*Refuta[^*]*\*\*\s*[—–-]\s*(.*)$/i)
      if (refM && curErr) {
        curErr.refutation = cleanInline(refM[1])
        continue
      }
      // No Erro/Refutação marker: intro line before the first error, or a
      // wrapped continuation of whichever field is currently open.
      const text = cleanInline(raw)
      if (!curErr) rej.intro = rej.intro ? `${rej.intro} ${text}` : text
      else if (curErr.refutation) curErr.refutation += ` ${text}`
      else curErr.statement += ` ${text}`
      continue
    }

    if (mode === "conclusion") {
      const raw = line.trim()
      if (!raw) continue
      const numM = raw.match(/^(\d+)\.\s+(.*)$/)
      if (numM) conclusion.calumnies.push(cleanInline(numM[2]))
      else if (conclusion.calumnies.length === 0)
        conclusion.intro.push(cleanInline(raw))
      else conclusion.outro.push(cleanInline(raw))
      continue
    }
  }
  flush()

  if (articles.length !== 59)
    note(`Dort: expected 59 articles, got ${articles.length}`)
  const perChapter = DORT_HEADS.map(
    (h) => articles.filter((a) => a.head === h).length,
  )
  if (perChapter.join(",") !== "18,9,17,15")
    note(`Dort: expected 18/9/17/15 per chapter, got ${perChapter.join("/")}`)
  for (const a of articles) {
    if (!a.paragraphs.length) note(`Dort ${a.head}.${a.number}: no body text`)
    if (!a.refs) note(`Dort ${a.head}.${a.number}: no scripture refs`)
  }

  if (rejections.length !== DORT_HEADS.length)
    note(
      `Dort: expected ${DORT_HEADS.length} rejection blocks, got ${rejections.length}`,
    )
  for (const r of rejections) {
    if (!r.intro) note(`Dort rejection ${r.head}: no intro line`)
    if (!r.errors.length) note(`Dort rejection ${r.head}: no errors parsed`)
    for (const e of r.errors) {
      if (!e.statement)
        note(`Dort rejection ${r.head} erro ${e.number}: no statement`)
      if (!e.refutation)
        note(`Dort rejection ${r.head} erro ${e.number}: no refutation`)
    }
  }
  if (!conclusion) note("Dort: no conclusion parsed")
  else if (!conclusion.calumnies.length)
    note("Dort conclusion: no numbered calumnies parsed")

  return { articles, rejections, conclusion }
}

// ── Heidelberg ──────────────────────────────────────────────────────────────

function parseHeidelberg() {
  const lines = readSource("heidelberg")
  const sundays = []
  // The consolation intro (Lord's Day 1, Q1–2) precedes the "~ PARTE I ~"
  // heading in the source; the site groups Prgs 1–11 under Part I, so default
  // to 1 until a later PARTE heading advances it.
  let part = 1
  let section = null
  let sunday = null
  let qa = null
  let seenDocTitle = false

  const flushQA = () => {
    if (!qa || !sunday) return
    const { paragraphs, refs } = splitBodyAndRefs(qa.raw, { numbered: true })
    sunday.qas.push({
      number: qa.number,
      question: qa.question,
      answerParagraphs: paragraphs,
      refs,
    })
    qa = null
  }
  const flushSunday = () => {
    flushQA()
    if (sunday) sundays.push(sunday)
    sunday = null
  }

  for (const line of lines) {
    const partM = line.match(/^#\s+~\s*PARTE\s+([IVX]+)\s*~/i)
    if (partM) {
      part = romanToInt(partM[1].toUpperCase())
      continue
    }
    const diaM = line.match(/^#{2}\s+DIA DO SENHOR\s+(\d+)/i)
    if (diaM) {
      flushSunday()
      sunday = {
        sunday: Number(diaM[1]),
        part,
        section,
        qas: [],
      }
      continue
    }
    // Question (usually ###, but Q68/74/124 use ##)
    const qM = line.match(/^#{2,3}\s+P\.(\d+)\.?\s*(.*)$/i)
    if (qM) {
      flushQA()
      qa = {
        number: Number(qM[1]),
        question: cleanInline(qM[2]),
        raw: [],
      }
      continue
    }
    // Level-1 heading that is neither the doc title nor a PARTE = thematic section
    const h1 = line.match(/^#\s+(?!~)(.*)$/)
    if (h1) {
      if (!seenDocTitle) {
        seenDocTitle = true // "# O CATECISMO DE HEIDELBERG"
      } else {
        section = cleanInline(h1[1])
      }
      continue
    }
    if (qa) qa.raw.push(line)
  }
  flushSunday()

  const qaCount = sundays.reduce((n, s) => n + s.qas.length, 0)
  if (qaCount !== 129) note(`Heidelberg: expected 129 Q&A, got ${qaCount}`)
  const nums = sundays.map((s) => s.sunday)
  for (let i = 1; i <= 52; i++)
    if (!nums.includes(i))
      note(`Heidelberg: missing/merged "DIA DO SENHOR ${i}" heading`)
  for (const s of sundays)
    for (const q of s.qas)
      if (!q.answerParagraphs.length)
        note(`Heidelberg P.${q.number}: no answer text`)
  return sundays
}

// ── emit ────────────────────────────────────────────────────────────────────

const BANNER =
  "// AUTO-GENERATED by scripts/convert-confessions.mjs — do not edit by hand.\n" +
  "// Source: app-irb-confessions (Three Forms of Unity, pt-BR).\n\n"

function emit(file, body) {
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(resolve(OUT_DIR, file), BANNER + body)
}

const json = (v) => JSON.stringify(v, null, 2)

const belgic = parseBelgic()
emit(
  "belgic.ts",
  `export interface BelgicArticle {
  number: number
  title: string
  paragraphs: string[]
  refs: string
}

export const BELGIC_CONFESSION_ARTICLES: BelgicArticle[] = ${json(belgic)}
`,
)

const dort = parseDort()
emit(
  "dort.ts",
  `export interface DortArticle {
  head: string
  number: number
  title: string
  paragraphs: string[]
  refs: string
}

export interface DortError {
  number: number
  statement: string
  refutation: string
}

export interface DortRejection {
  head: string
  intro: string
  errors: DortError[]
}

export interface DortConclusion {
  intro: string[]
  calumnies: string[]
  outro: string[]
}

export const DORT_ARTICLES: DortArticle[] = ${json(dort.articles)}

export const DORT_REJECTIONS: DortRejection[] = ${json(dort.rejections)}

export const DORT_CONCLUSION: DortConclusion = ${json(dort.conclusion)}
`,
)

const heidelberg = parseHeidelberg()
emit(
  "heidelberg.ts",
  `export interface HeidelbergQA {
  number: number
  question: string
  answerParagraphs: string[]
  refs: string
}

export interface HeidelbergSunday {
  sunday: number
  part: number
  section: string | null
  qas: HeidelbergQA[]
}

export const HEIDELBERG_CATECHISM_DATA: HeidelbergSunday[] = ${json(heidelberg)}
`,
)

// ── report ──────────────────────────────────────────────────────────────────

console.log(`Belgic:     ${belgic.length} articles`)
console.log(
  `Dort:       ${dort.articles.length} articles, ` +
    `${dort.rejections.length} rejection blocks ` +
    `(${dort.rejections.reduce((n, r) => n + r.errors.length, 0)} errors), ` +
    `${dort.conclusion?.calumnies.length ?? 0} calumnies`,
)
console.log(
  `Heidelberg: ${heidelberg.length} Lord's Days, ${heidelberg.reduce(
    (n, s) => n + s.qas.length,
    0,
  )} Q&A`,
)
console.log("")
if (report.length) {
  console.log(
    `⚠  ${report.length} anomalies (source defects / passed through):`,
  )
  for (const r of report) console.log("   · " + r)
} else {
  console.log("✓ no anomalies")
}
