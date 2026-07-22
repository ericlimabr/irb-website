"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"

interface QA {
  number: number
  question: string
  answer: string
  refs: string
}

interface Sunday {
  sunday: number
  part: number
  title: string
  qas: QA[]
}

const catechismData: Sunday[] = [
  {
    sunday: 1,
    part: 1,
    title: "O Único Consolo",
    qas: [
      {
        number: 1,
        question: "Qual é o teu único consolo, tanto na vida quanto na morte?",
        answer:
          "Que eu, de corpo e alma, tanto na vida quanto na morte, não pertenço a mim mesmo, mas ao meu fiel Salvador Jesus Cristo, que com Seu precioso sangue satisfez plenamente por todos os meus pecados e me libertou de todo o poder do diabo.",
        refs: "Rm 14.7–9 · 1Co 6.19–20 · ARA",
      },
      {
        number: 2,
        question:
          "Quantas coisas deves saber para viver e morrer neste consolo?",
        answer:
          "Três: primeiro, quão grande é o meu pecado e miséria; segundo, como sou libertado de todos os meus pecados e miséria; terceiro, como devo ser grato a Deus por tal libertação.",
        refs: "Lc 24.46–47 · Tt 3.3–7 · ARA",
      },
    ],
  },
  {
    sunday: 2,
    part: 1,
    title: "A Miséria do Homem",
    qas: [
      {
        number: 3,
        question: "De onde conheces a tua miséria?",
        answer: "Da lei de Deus.",
        refs: "Rm 3.20 · ARA",
      },
      {
        number: 4,
        question: "Que exige de nós a lei de Deus?",
        answer:
          "Cristo nos ensina isso em Mateus 22.37–40: Amarás o Senhor teu Deus de todo o teu coração, de toda a tua alma e de todo o teu entendimento. Este é o grande e primeiro mandamento. O segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo.",
        refs: "Mt 22.37–40 · ARA",
      },
      {
        number: 5,
        question: "Podes cumprir tudo isso perfeitamente?",
        answer:
          "Não, porque por natureza sou inclinado a odiar a Deus e ao meu próximo.",
        refs: "Rm 3.10–12 · Gn 6.5 · ARA",
      },
    ],
  },
  {
    sunday: 3,
    part: 1,
    title: "A Queda e Corrupção",
    qas: [
      {
        number: 6,
        question: "Deus criou o homem assim tão mau e perverso?",
        answer:
          "Não. Deus criou o homem bom e à Sua imagem, isto é, em verdadeira justiça e santidade, para que conhecesse retamente a Deus, seu Criador, O amasse de coração e vivesse com Ele em eterna felicidade.",
        refs: "Gn 1.31 · Ef 4.24 · ARA",
      },
      {
        number: 7,
        question: "De onde vem, então, esta natureza corrompida do homem?",
        answer:
          "Da queda e desobediência de nossos primeiros pais, Adão e Eva, no paraíso. Esta queda corrompeu de tal modo a nossa natureza que todos nós somos concebidos e nascidos em pecado.",
        refs: "Rm 5.12 · Sl 51.5 · ARA",
      },
      {
        number: 8,
        question:
          "Estamos tão corrompidos que somos totalmente incapazes de fazer o bem e inclinados a todo mal?",
        answer: "Sim, a menos que sejamos regenerados pelo Espírito de Deus.",
        refs: "Jo 3.3–5 · Gn 8.21 · ARA",
      },
    ],
  },
]

const partLabels: Record<number, { title: string; color: string }> = {
  1: { title: "Miséria", color: "bg-navy-800" },
  2: { title: "Redenção", color: "bg-navy-700" },
  3: { title: "Gratidão", color: "bg-navy-600" },
}

export default function CatecismoPage() {
  const [filterPart, setFilterPart] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSunday, setExpandedSunday] = useState<number | null>(1)

  const filteredData = useMemo(() => {
    let data = catechismData
    if (filterPart) data = data.filter((s) => s.part === filterPart)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter((s) =>
        s.qas.some(
          (qa) =>
            qa.question.toLowerCase().includes(q) ||
            qa.answer.toLowerCase().includes(q) ||
            qa.refs.toLowerCase().includes(q),
        ),
      )
    }
    return data
  }, [filterPart, searchQuery])

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
              className="font-mono uppercase tracking-[0.1em] text-gold-400/60"
              style={{ fontSize: "9px" }}
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
          <input
            type="text"
            placeholder="Buscar por pergunta, resposta ou versículo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-border focus:border-gold-500 outline-none py-3 font-sans text-foreground placeholder:text-muted-foreground transition-colors duration-500"
          />
        </div>

        {/* Q&A List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredData.map((sunday) => (
            <div
              key={sunday.sunday}
              className={`border border-border ${expandedSunday === sunday.sunday ? "border-l-[3px] border-l-gold-500" : ""}`}
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
                  <span
                    className="font-mono uppercase tracking-[0.1em] text-gold-500"
                    style={{ fontSize: "var(--text-size-xs)" }}
                  >
                    Domingo {sunday.sunday}
                  </span>
                  <h4
                    className="font-serif text-navy-700 font-semibold mt-1"
                    style={{ fontSize: "var(--text-size-lg)" }}
                  >
                    {sunday.title}
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
                            <p className="font-sans text-muted-foreground leading-relaxed mb-3">
                              {qa.answer}
                            </p>
                            <span
                              className="font-mono text-gold-600"
                              style={{ fontSize: "var(--text-size-xs)" }}
                            >
                              {qa.refs}
                            </span>
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
      </Section>
    </div>
  )
}
