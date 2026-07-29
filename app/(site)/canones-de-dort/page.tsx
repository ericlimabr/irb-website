"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import SearchInput from "@/components/ui/SearchInput"
import ArticleIndex from "@/components/ui/ArticleIndex"
import ScrollToTop from "@/components/ui/ScrollToTop"
import {
  DORT_ARTICLES,
  DORT_CHAPTERS,
  DORT_REJECTIONS,
  DORT_CONCLUSION,
} from "@/const"

/**
 * Numbering restarts in each chapter, so head + number identify an article.
 * Doubles as the DOM anchor id, so the head's slash is normalised out.
 */
const anchorId = (head: string, number: number) =>
  `dort-${head.replace(/\//g, "-")}-${number}`

/** Anchor for a Head's whole "Rejeição dos Erros" block. */
const rejAnchor = (head: string) => `dort-rej-${head.replace(/\//g, "-")}`

/** Anchor for a single rejected error within a block. */
const errId = (head: string, number: number) =>
  `dort-err-${head.replace(/\//g, "-")}-${number}`

const CONCLUSION_ID = "dort-conclusao"

const chapterBg: Record<string, string> = {
  I: "bg-navy-800",
  II: "bg-navy-700",
  "III/IV": "bg-navy-600",
  V: "bg-navy-800",
}

export default function CanonesDeDortPage() {
  const [filterHead, setFilterHead] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expanded, setExpanded] = useState<string | null>(
    DORT_ARTICLES[0]
      ? anchorId(DORT_ARTICLES[0].head, DORT_ARTICLES[0].number)
      : null,
  )
  const [expandedError, setExpandedError] = useState<string | null>(null)

  const filteredArticles = useMemo(() => {
    let data = DORT_ARTICLES

    if (filterHead) data = data.filter((a) => a.head === filterHead)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
          a.refs.toLowerCase().includes(q),
      )
    }

    return data
  }, [filterHead, searchQuery])

  // Rejection blocks obey the same Head filter and search as the articles: a
  // block only surfaces the errors that match, and drops out when none do.
  const filteredRejections = useMemo(
    () =>
      DORT_REJECTIONS.map((r) => {
        if (filterHead && r.head !== filterHead) return { ...r, errors: [] }
        if (!searchQuery) return r
        const q = searchQuery.toLowerCase()
        return {
          ...r,
          errors: r.errors.filter(
            (e) =>
              e.statement.toLowerCase().includes(q) ||
              e.refutation.toLowerCase().includes(q),
          ),
        }
      }),
    [filterHead, searchQuery],
  )

  const rejectionFor = (head: string) =>
    filteredRejections.find((r) => r.head === head)

  // The Conclusão speaks to the document as a whole, so it shows only in the
  // unfiltered, unsearched view.
  const showConclusion = filterHead === null && searchQuery === ""

  const indexGroups = useMemo(() => {
    const groups = DORT_CHAPTERS.map((c) => {
      const items = filteredArticles
        .filter((a) => a.head === c.head)
        .map((a) => ({
          id: anchorId(a.head, a.number),
          label: `${a.number}. ${a.title}`,
        }))
      const rej = filteredRejections.find((r) => r.head === c.head)
      if (rej && rej.errors.length > 0) {
        items.push({ id: rejAnchor(c.head), label: "Rejeição dos Erros" })
      }
      return { heading: `${c.head} · ${c.title}`, items }
    }).filter((g) => g.items.length > 0)

    // Conclusão rides at the tail of the last visible group.
    if (showConclusion && groups.length > 0) {
      groups[groups.length - 1].items.push({
        id: CONCLUSION_ID,
        label: "Conclusão",
      })
    }
    return groups
  }, [filteredArticles, filteredRejections, showConclusion])

  const handleSelect = (id: string) => {
    const isArticle = filteredArticles.some(
      (a) => anchorId(a.head, a.number) === id,
    )
    // Only article rows toggle the accordion. When another article is open,
    // wait for its collapse to settle so the layout is final before scrolling;
    // rejection/conclusion anchors just scroll against the current layout.
    const delay = isArticle && expanded !== null && expanded !== id ? 520 : 0
    if (isArticle) setExpanded(id)
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, delay)
  }

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        backgroundImage="/confessions/dort.jpeg"
        watermark={false}
        eyebrow="Cânones de Dort"
        title={
          <>
            Cânones
            <br />
            <em className="text-gold-400">de Dort.</em>
          </>
        }
        subtitle="Os cinco pontos da graça soberana, definidos pelo Sínodo de Dordrecht em resposta à Remonstrância arminiana."
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {[
            "1618–1619 · Dordrecht",
            "Sínodo Internacional",
            "Cinco Pontos",
          ].map((s) => (
            <span
              key={s}
              className="font-mono uppercase tracking-[0.1em] text-gold-400/60 text-fs-9"
            >
              {s}
            </span>
          ))}
        </div>
      </Masthead>

      <Section bg="surface">
        {/* Heads of doctrine — double as the article filter */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {DORT_CHAPTERS.map((chapter) => {
            const active = filterHead === chapter.head
            return (
              <AnimatedContent key={chapter.head}>
                <button
                  onClick={() => setFilterHead(active ? null : chapter.head)}
                  className={`${chapterBg[chapter.head]} texture-hatch p-8 text-primary-foreground w-full h-full text-left transition-all duration-700 border-2 ${
                    active ? "border-gold-500" : "border-transparent"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-gold-400 text-4xl font-light">
                      {chapter.head}
                    </span>
                    <span className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40 text-2xs">
                      {chapter.tulip}
                    </span>
                  </div>
                  <h4 className="font-serif text-primary-foreground text-xl font-semibold mt-2">
                    {chapter.title}
                  </h4>
                  <p className="font-sans text-primary-foreground/65 text-sm mt-2">
                    {chapter.desc}
                  </p>
                  <p className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40 mt-4 text-2xs">
                    {chapter.articles} Artigos · Rejeição dos Erros
                  </p>
                </button>
              </AnimatedContent>
            )
          })}
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por artigo, tema ou versículo..."
          />
        </div>

        {/* Articles centered, with the index rail in the right gutter */}
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,48rem)_200px] lg:justify-center lg:gap-10">
          <div className="hidden lg:block" aria-hidden />
          <div className="max-w-3xl w-full mx-auto space-y-12">
            {DORT_CHAPTERS.map((chapter) => {
              const articles = filteredArticles.filter(
                (a) => a.head === chapter.head,
              )
              const rejection = rejectionFor(chapter.head)
              const hasRejection = !!rejection && rejection.errors.length > 0
              if (articles.length === 0 && !hasRejection) return null

              return (
                <section key={chapter.head} className="space-y-6">
                  {articles.map((article) => {
                    const id = anchorId(article.head, article.number)
                    const isOpen = expanded === id
                    return (
                      <div
                        key={id}
                        id={id}
                        className={`scroll-mt-24 border border-border ${isOpen ? "border-l-[3px] border-l-gold-500" : ""}`}
                      >
                        <button
                          onClick={() => setExpanded(isOpen ? null : id)}
                          className="w-full text-left p-6 flex items-center justify-between gap-6"
                        >
                          <div className="flex items-baseline gap-6">
                            <span className="font-serif text-gold-500 text-3xl font-light min-w-[40px]">
                              {article.number}
                            </span>
                            <div>
                              <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                                Capítulo {article.head} · Artigo{" "}
                                {article.number}
                              </span>
                              <h4
                                className="font-serif text-navy-700 font-semibold mt-1"
                                style={{ fontSize: "var(--text-size-lg)" }}
                              >
                                {article.title}
                              </h4>
                            </div>
                          </div>
                          <span className="font-mono text-muted-foreground text-xs">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border p-6 space-y-3">
                                {article.paragraphs.map((p, i) => (
                                  <p
                                    key={i}
                                    className="font-sans text-muted-foreground leading-relaxed"
                                  >
                                    {p}
                                  </p>
                                ))}
                                {article.refs && (
                                  <span className="font-mono text-gold-600 block pt-1 text-2xs">
                                    {article.refs}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}

                  {hasRejection && (
                    <div
                      id={rejAnchor(chapter.head)}
                      className="scroll-mt-24 pt-2"
                    >
                      <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                        Rejeição dos Erros · Capítulo {chapter.head}
                      </span>
                      <p className="font-serif italic text-navy-700 mt-2 mb-5 leading-relaxed">
                        {rejection.intro}
                      </p>

                      <div className="space-y-3">
                        {rejection.errors.map((err) => {
                          const eid = errId(chapter.head, err.number)
                          const open = expandedError === eid
                          return (
                            <div
                              key={eid}
                              id={eid}
                              className={`scroll-mt-24 border border-border ${open ? "border-l-[3px] border-l-gold-500" : ""}`}
                            >
                              <button
                                onClick={() =>
                                  setExpandedError(open ? null : eid)
                                }
                                className="w-full text-left p-6 flex items-start justify-between gap-6"
                              >
                                <div>
                                  <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                                    Erro {err.number}
                                  </span>
                                  <p className="font-serif text-navy-700 mt-1 leading-snug">
                                    {err.statement}
                                  </p>
                                </div>
                                <span className="font-mono text-muted-foreground text-xs pt-1">
                                  {open ? "−" : "+"}
                                </span>
                              </button>

                              <AnimatePresence>
                                {open && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.5,
                                      ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t border-border p-6">
                                      <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                                        Refutação
                                      </span>
                                      <p className="font-sans text-muted-foreground leading-relaxed mt-2">
                                        {err.refutation}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </section>
              )
            })}

            {filteredArticles.length === 0 &&
              !filteredRejections.some((r) => r.errors.length > 0) && (
                <p className="font-sans text-muted-foreground text-center py-12">
                  Nenhum artigo encontrado.
                </p>
              )}

            {showConclusion && (
              <div
                id={CONCLUSION_ID}
                className="scroll-mt-24 border border-border border-l-[3px] border-l-gold-500 bg-surface-alt texture-linen"
              >
                <div className="p-6 md:p-8 space-y-4">
                  <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                    Conclusão
                  </span>
                  {DORT_CONCLUSION.intro.map((p, i) => (
                    <p
                      key={i}
                      className="font-sans text-muted-foreground leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                  <ol className="list-decimal space-y-2 pl-6 marker:font-mono marker:text-gold-500">
                    {DORT_CONCLUSION.calumnies.map((c, i) => (
                      <li
                        key={i}
                        className="font-sans text-muted-foreground leading-relaxed pl-1"
                      >
                        {c}
                      </li>
                    ))}
                  </ol>
                  {DORT_CONCLUSION.outro.map((p, i) => (
                    <p
                      key={i}
                      className="font-sans text-muted-foreground leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ArticleIndex groups={indexGroups} onSelect={handleSelect} />
        </div>
      </Section>

      <ScrollToTop />
    </div>
  )
}
