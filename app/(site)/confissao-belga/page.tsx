"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { BELGIC_CONFESSION_ARTICLES, BELGIC_CONFESSION_CHAPTERS } from "@/const"

export default function ConfissaoBelgaPage() {
  const [filterRange, setFilterRange] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedArticle, setExpandedArticle] = useState<number | null>(
    BELGIC_CONFESSION_ARTICLES[0]?.number ?? null,
  )

  const filteredArticles = useMemo(() => {
    let data = BELGIC_CONFESSION_ARTICLES

    if (filterRange) {
      const group = BELGIC_CONFESSION_CHAPTERS.find(
        (c) => c.range === filterRange,
      )
      if (group) {
        data = data.filter(
          (a) => a.number >= group.from && a.number <= group.to,
        )
      }
    }

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
  }, [filterRange, searchQuery])

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        backgroundImage="/confessions/confession.jpeg"
        watermark={false}
        eyebrow="Confissão Belga"
        title={
          <>
            Confissão
            <br />
            <em className="text-gold-400">Belga.</em>
          </>
        }
        subtitle="Trinta e sete artigos que expõem a doutrina reformada — escritos por Guido de Brès e apresentados às autoridades em 1561."
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {["1561 · Países Baixos", "Guido de Brès", "37 Artigos"].map((s) => (
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
        {/* Thematic groups — double as the article filter */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {BELGIC_CONFESSION_CHAPTERS.map((group) => {
            const active = filterRange === group.range
            return (
              <AnimatedContent key={group.range}>
                <button
                  onClick={() => setFilterRange(active ? null : group.range)}
                  className={`w-full h-full text-left p-6 bg-surface border transition-all duration-700 hover:shadow-lg ${
                    active ? "border-gold-500 border-l-[3px]" : "border-border"
                  }`}
                >
                  <span
                    className="mono-label-sm text-gold-500"
                    style={{ fontSize: "var(--text-size-xs)" }}
                  >
                    {group.range}
                  </span>
                  <h4
                    className="font-serif text-navy-700 font-semibold mt-2"
                    style={{ fontSize: "var(--text-size-lg)" }}
                  >
                    {group.title}
                  </h4>
                  <p className="font-sans text-muted-foreground text-sm mt-2">
                    {group.desc}
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
            const expanded = expandedArticle === article.number
            return (
              <div
                key={article.number}
                className={`border border-border ${expanded ? "border-l-[3px] border-l-gold-500" : ""}`}
              >
                <button
                  onClick={() =>
                    setExpandedArticle(expanded ? null : article.number)
                  }
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
                        Artigo {article.number}
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
                    {expanded ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {expanded && (
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
