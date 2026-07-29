"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import SearchInput from "@/components/ui/SearchInput"
import ArticleIndex from "@/components/ui/ArticleIndex"
import ScrollToTop from "@/components/ui/ScrollToTop"
import { HEIDELBERG_CATECHISM_DATA } from "@/const"

const partLabels: Record<number, { title: string; color: string }> = {
  1: { title: "Miséria", color: "bg-navy-800" },
  2: { title: "Redenção", color: "bg-navy-700" },
  3: { title: "Gratidão", color: "bg-navy-600" },
}

const anchorId = (sunday: number) => `heidelberg-ld-${sunday}`

export default function CatecismoPage() {
  const [filterPart, setFilterPart] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSunday, setExpandedSunday] = useState<number | null>(1)

  const filteredData = useMemo(() => {
    let data = HEIDELBERG_CATECHISM_DATA
    if (filterPart) data = data.filter((s) => s.part === filterPart)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((s) =>
        s.qas.some(
          (qa) =>
            qa.question.toLowerCase().includes(q) ||
            qa.answerParagraphs.some((p) => p.toLowerCase().includes(q)) ||
            qa.refs.toLowerCase().includes(q),
        ),
      )
    }
    return data
  }, [filterPart, searchQuery])

  const indexGroups = useMemo(
    () =>
      [1, 2, 3]
        .map((part) => ({
          heading: `${["I", "II", "III"][part - 1]} · ${partLabels[part].title}`,
          items: filteredData
            .filter((s) => s.part === part)
            .map((s) => ({
              id: anchorId(s.sunday),
              label: `Domingo ${s.sunday}`,
            })),
        }))
        .filter((g) => g.items.length > 0),
    [filteredData],
  )

  const handleSelect = (id: string) => {
    const target = Number(id.replace("heidelberg-ld-", ""))
    // If another Lord's Day is open, wait for its collapse animation to settle
    // so the layout is final before scrolling; otherwise scroll next frame.
    const delay = expandedSunday !== null && expandedSunday !== target ? 520 : 0
    setExpandedSunday(target)
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
        backgroundImage="/confessions/heidelberg.jpeg"
        watermark={false}
        eyebrow="Catecismo"
        title={
          <>
            Catecismo de
            <br />
            <em className="text-gold-400">Heidelberg.</em>
          </>
        }
        subtitle="O único consolo na vida e na morte — 52 Domingos, 129 Perguntas."
      >
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { label: "I Miséria", count: "Prgs. 1–11" },
            { label: "II Redenção", count: "Prgs. 12–85" },
            { label: "III Gratidão", count: "Prgs. 86–129" },
          ].map((p) => (
            <span
              key={p.label}
              className="font-mono uppercase tracking-[0.1em] text-gold-400/60 text-fs-9"
            >
              {p.label}
            </span>
          ))}
        </div>
      </Masthead>

      {/* Parts navigation */}
      <Section bg="surface">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((part) => {
            const p = partLabels[part]
            return (
              <AnimatedContent key={part}>
                <button
                  onClick={() =>
                    setFilterPart(filterPart === part ? null : part)
                  }
                  className={`${p.color} texture-hatch p-8 text-primary-foreground w-full text-left transition-all duration-700 border-2 ${filterPart === part ? "border-gold-500" : "border-transparent"}`}
                >
                  <span className="font-serif text-gold-400 text-4xl font-light">
                    {["I", "II", "III"][part - 1]}
                  </span>
                  <h4 className="font-serif text-primary-foreground text-xl font-semibold mt-2">
                    {p.title}
                  </h4>
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
            placeholder="Buscar por pergunta, resposta ou versículo..."
          />
        </div>

        {/* Q&A list centered, with the index rail in the right gutter */}
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,48rem)_200px] lg:justify-center lg:gap-10">
          <div className="hidden lg:block" aria-hidden />
          <div className="max-w-3xl w-full mx-auto space-y-6">
            {filteredData.map((sunday) => (
              <div
                key={sunday.sunday}
                id={anchorId(sunday.sunday)}
                className={`scroll-mt-24 border border-border ${expandedSunday === sunday.sunday ? "border-l-[3px] border-l-gold-500" : ""}`}
              >
                <button
                  onClick={() =>
                    setExpandedSunday(
                      expandedSunday === sunday.sunday ? null : sunday.sunday,
                    )
                  }
                  className="w-full text-left p-6 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono uppercase tracking-[0.1em] text-gold-500 text-2xs">
                      Domingo {sunday.sunday}
                    </span>
                    <h4
                      className="font-serif text-navy-700 font-semibold mt-1"
                      style={{ fontSize: "var(--text-size-lg)" }}
                    >
                      {sunday.section ?? partLabels[sunday.part]?.title ?? ""}
                    </h4>
                  </div>
                  <span className="font-mono text-muted-foreground text-xs">
                    {expandedSunday === sunday.sunday ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {expandedSunday === sunday.sunday && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border">
                        {sunday.qas.map((qa) => (
                          <div
                            key={qa.number}
                            className="p-6 border-b border-border last:border-b-0 flex gap-6"
                          >
                            <span className="font-serif text-gold-500 text-3xl font-light min-w-[40px]">
                              {qa.number}
                            </span>
                            <div>
                              <p
                                className="font-serif italic text-navy-700 mb-3"
                                style={{ fontSize: "var(--text-size-lg)" }}
                              >
                                {qa.question}
                              </p>
                              <div className="space-y-3 mb-3">
                                {qa.answerParagraphs.map((p, i) => (
                                  <p
                                    key={i}
                                    className="font-sans text-muted-foreground leading-relaxed"
                                  >
                                    {p}
                                  </p>
                                ))}
                              </div>
                              {qa.refs && (
                                <span className="font-mono text-gold-600 text-2xs">
                                  {qa.refs}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <ArticleIndex groups={indexGroups} onSelect={handleSelect} />
        </div>
      </Section>

      <ScrollToTop />
    </div>
  )
}
