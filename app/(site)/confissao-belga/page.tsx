"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import SearchInput from "@/components/ui/SearchInput"
import ArticleIndex from "@/components/ui/ArticleIndex"
import ScrollToTop from "@/components/ui/ScrollToTop"
import RelatedConfessions from "@/components/features/confessions/RelatedConfessions"
import { BELGIC_CONFESSION_ARTICLES, BELGIC_CONFESSION_CHAPTERS } from "@/const"

const anchorId = (n: number) => `belgic-art-${n}`

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
          a.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
          a.refs.toLowerCase().includes(q),
      )
    }

    return data
  }, [filterRange, searchQuery])

  const indexGroups = useMemo(
    () =>
      BELGIC_CONFESSION_CHAPTERS.map((c) => ({
        heading: c.title,
        items: filteredArticles
          .filter((a) => a.number >= c.from && a.number <= c.to)
          .map((a) => ({
            id: anchorId(a.number),
            label: `${a.number}. ${a.title}`,
          })),
      })).filter((g) => g.items.length > 0),
    [filteredArticles],
  )

  const handleSelect = (id: string) => {
    const target = Number(id.replace("belgic-art-", ""))
    // If another article is open, wait for its collapse animation to settle so
    // the layout is final before scrolling; otherwise scroll on the next frame.
    const delay =
      expandedArticle !== null && expandedArticle !== target ? 520 : 0
    setExpandedArticle(target)
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
        subtitle="Trinta e sete artigos que expõem a doutrina reformada, escritos por Guido de Brès e apresentados às autoridades em 1561."
      >
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {["1561 · Países Baixos", "Guido de Brès", "37 Artigos"].map((s) => (
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
        {/* Abertura definicional: primeiro texto corrido após o H1, o trecho
            que buscadores e IAs extraem (padrão "definição primeiro", Frente 3). */}
        <AnimatedContent>
          <p
            className="font-serif text-navy-700 leading-relaxed max-w-3xl mx-auto mb-12"
            style={{ fontSize: "var(--text-size-lg)" }}
          >
            A Confissão Belga é a mais antiga das Três Formas de Unidade: trinta
            e sete artigos que expõem a fé reformada, escritos por Guido de Brès
            em 1561 e apresentados às autoridades dos Países Baixos como
            testemunho público da doutrina cristã.
          </p>
        </AnimatedContent>

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
                  <span className="mono-label-sm text-gold-500">
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
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por artigo, tema ou versículo..."
          />
        </div>

        {/* Articles centered, with the index rail in the right gutter */}
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,48rem)_200px] lg:justify-center lg:gap-10">
          <div className="hidden lg:block" aria-hidden />
          <div className="max-w-3xl w-full mx-auto space-y-6">
            {filteredArticles.map((article) => {
              const expanded = expandedArticle === article.number
              return (
                <div
                  key={article.number}
                  id={anchorId(article.number)}
                  className={`scroll-mt-24 border border-border ${expanded ? "border-l-[3px] border-l-gold-500" : ""}`}
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
                        <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
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

            {filteredArticles.length === 0 && (
              <p className="font-sans text-muted-foreground text-center py-12">
                Nenhum artigo encontrado.
              </p>
            )}
          </div>
          <ArticleIndex groups={indexGroups} onSelect={handleSelect} />
        </div>
      </Section>

      <RelatedConfessions current="belga" />

      <ScrollToTop />
    </div>
  )
}
