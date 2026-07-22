"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { DORT_ARTICLES, DORT_CHAPTERS } from "@/const"

/** Numbering restarts in each chapter, so both parts identify an article. */
const articleKey = (head: string, number: number) => `${head}-${number}`

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
      ? articleKey(DORT_ARTICLES[0].head, DORT_ARTICLES[0].number)
      : null,
  )

  const filteredArticles = useMemo(() => {
    let data = DORT_ARTICLES

    if (filterHead) data = data.filter((a) => a.head === filterHead)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.refs.toLowerCase().includes(q),
      )
    }

    return data
  }, [filterHead, searchQuery])

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
              className="font-mono uppercase tracking-[0.1em] text-gold-400/60"
              style={{ fontSize: "9px" }}
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
                    <span
                      className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
                      style={{ fontSize: "var(--text-size-xs)" }}
                    >
                      {chapter.tulip}
                    </span>
                  </div>
                  <h4 className="font-serif text-primary-foreground text-xl font-semibold mt-2">
                    {chapter.title}
                  </h4>
                  <p className="font-sans text-primary-foreground/65 text-sm mt-2">
                    {chapter.desc}
                  </p>
                  <p
                    className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40 mt-4"
                    style={{ fontSize: "var(--text-size-xs)" }}
                  >
                    {chapter.articles} Artigos · Rejeição dos Erros
                  </p>
                </button>
              </AnimatedContent>
            )
          })}
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Buscar por artigo, tema ou versículo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-border focus:border-gold-500 outline-none py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors duration-500"
          />
        </div>

        {/* Articles */}
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredArticles.map((article) => {
            const key = articleKey(article.head, article.number)
            const isOpen = expanded === key
            return (
              <div
                key={key}
                className={`border border-border ${isOpen ? "border-l-[3px] border-l-gold-500" : ""}`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="w-full text-left p-6 flex items-center justify-between gap-6"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-serif text-gold-500 text-3xl font-light min-w-[40px]">
                      {article.number}
                    </span>
                    <div>
                      <span
                        className="font-mono uppercase tracking-[0.1em] text-gold-500"
                        style={{ fontSize: "var(--text-size-xs)" }}
                      >
                        Capítulo {article.head} · Artigo {article.number}
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
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border p-6">
                        <p className="font-sans text-muted-foreground leading-relaxed mb-3">
                          {article.summary}
                        </p>
                        <span
                          className="font-mono text-gold-600"
                          style={{ fontSize: "var(--text-size-xs)" }}
                        >
                          {article.refs}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {filteredArticles.length === 0 && (
            <p className="font-sans text-muted-foreground text-center py-12">
              Nenhum artigo encontrado.
            </p>
          )}
        </div>
      </Section>
    </div>
  )
}
