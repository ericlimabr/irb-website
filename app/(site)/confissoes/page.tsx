"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { IRBButton } from "@/components/layout/Cards"

const tulipData = [
  {
    letter: "T",
    latin: "Corruptio",
    title: "Depravação Total",
    verse: "Rm 3.10–12",
    desc: "O homem, em seu estado natural, está morto em delitos e pecados, totalmente incapaz de contribuir para sua própria salvação.",
  },
  {
    letter: "U",
    latin: "Electio",
    title: "Eleição Incondicional",
    verse: "Ef 1.4–5",
    desc: "Deus, antes da fundação do mundo, elegeu um povo para si, não com base em qualquer mérito previsto, mas segundo o beneplácito de sua vontade.",
  },
  {
    letter: "L",
    latin: "Expiatio",
    title: "Expiação Definida",
    verse: "Jo 10.15",
    desc: "Cristo morreu eficazmente por seu povo escolhido, assegurando plenamente a salvação de todos aqueles por quem intercede.",
  },
  {
    letter: "I",
    latin: "Gratia",
    title: "Graça Irresistível",
    verse: "Jo 6.37",
    desc: "O Espírito Santo aplica eficazmente a redenção aos eleitos, renovando seus corações e trazendo-os à fé e ao arrependimento.",
  },
  {
    letter: "P",
    latin: "Perseverantia",
    title: "Perseverança dos Santos",
    verse: "Jo 10.28–29",
    desc: "Aqueles a quem Deus elegeu, Cristo redimiu e o Espírito regenerou, jamais cairão total ou finalmente da graça.",
  },
]

export default function ConfissoesPage() {
  const [expandedTulip, setExpandedTulip] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      <Masthead
        eyebrow="Confissões Reformadas"
        title={
          <>
            Três Formas
            <br />
            <em className="text-gold-400">de Unidade.</em>
          </>
        }
        subtitle="Os padrões confessionais que unem a igreja reformada através dos séculos — a Confissão Belga, o Catecismo de Heidelberg e os Cânones de Dort."
      />

      {/* Linha do Tempo */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-6">Cronologia</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Linha do Tempo
            <br />
            <em className="text-gold-500">da Reforma</em>
          </h2>
        </AnimatedContent>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
          {[
            { year: "1517", title: "95 Teses de Lutero", highlight: false },
            { year: "1536", title: "Institutas de Calvino", highlight: false },
            { year: "1561", title: "Confissão Belga", highlight: true },
            { year: "1563", title: "Catecismo de Heidelberg", highlight: true },
            { year: "1566", title: "2ª Confissão Helvética", highlight: false },
            { year: "1618", title: "Sínodo de Dort", highlight: false },
            { year: "1619", title: "Cânones de Dort", highlight: true },
            { year: "1681", title: "Publicação NT, Almeida", highlight: false },
            { year: "1694", title: "Tradução completa AT, Almeida", highlight: false },
            { year: "1753", title: "Publicação da Biblia em Português", highlight: true },
          ].map((ev) => (
            <AnimatedContent key={ev.year}>
              <div className="flex items-start gap-6 py-6 pl-16 relative">
                <div
                  className={`absolute left-6 top-8 w-4 h-4 border-2 ${ev.highlight ? "border-gold-500 bg-gold-500" : "border-border bg-surface"}`}
                  style={{ borderRadius: "50%" }}
                />
                <span
                  className={`font-serif text-xl font-semibold min-w-[60px] ${ev.highlight ? "text-gold-500" : "text-navy-700"}`}
                >
                  {ev.year}
                </span>
                <span
                  className={`font-sans ${ev.highlight ? "text-navy-700 font-semibold" : "text-muted-foreground"}`}
                >
                  {ev.title}
                </span>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      {/* Confissão Belga */}
      <Section bg="surface" id="belgica">
        <AnimatedContent>
          <p className="section-tag mb-6">Países Baixos · 1561</p>
          <h2
            className="font-serif text-navy-700 mb-6"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Confissão Belga
          </h2>
          <p className="font-sans text-muted-foreground leading-relaxed max-w-2xl mb-12">
            Escrita por Guido de Brès em 1561, a Confissão Belga expõe em 37
            artigos a doutrina reformada, servindo como apologia diante das
            autoridades e como confissão de fé da igreja.
          </p>
        </AnimatedContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              range: "I–VIII",
              title: "Deus e Trindade",
              desc: "A natureza de Deus, a revelação e as Escrituras.",
            },
            {
              range: "IX–XI",
              title: "Pessoas Divinas",
              desc: "A doutrina da Trindade e os testemunhos bíblicos.",
            },
            {
              range: "XII–XV",
              title: "Criação e Queda",
              desc: "A criação, providência, pecado original e corrupção.",
            },
            {
              range: "XVI–XXIV",
              title: "Salvação",
              desc: "Eleição, redenção, justificação e santificação.",
            },
            {
              range: "XXV–XXIX",
              title: "A Igreja",
              desc: "Marcas da verdadeira igreja, governo e disciplina.",
            },
            {
              range: "XXX–XXXV",
              title: "Governo & Culto",
              desc: "Ministros, sacramentos e o governo eclesiástico.",
            },
            {
              range: "XXXVI–XXXVII",
              title: "Estado & Escatologia",
              desc: "O magistrado civil e o julgamento final.",
            },
          ].map((item) => (
            <AnimatedContent key={item.range}>
              <div className="border border-border p-6 bg-surface hover:shadow-lg transition-shadow duration-700">
                <span
                  className="mono-label-sm text-gold-500"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {item.range}
                </span>
                <h4
                  className="font-serif text-navy-700 font-semibold mt-2"
                  style={{ fontSize: "var(--text-size-lg)" }}
                >
                  {item.title}
                </h4>
                <p className="font-sans text-muted-foreground text-sm mt-2">
                  {item.desc}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      {/* Catecismo de Heidelberg */}
      <Section bg="surface-alt" id="heidelberg">
        <AnimatedContent>
          <p className="section-tag mb-6">Heidelberg · 1563</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Catecismo de Heidelberg
          </h2>
        </AnimatedContent>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              part: "I",
              title: "Miséria",
              range: "Dom. I–IV · Prgs. 1–11",
              question: "Quão grande é o teu pecado e miséria?",
              bg: "bg-navy-800",
            },
            {
              part: "II",
              title: "Redenção",
              range: "Dom. V–XXXI · Prgs. 12–85",
              question: "Como és livre de tua miséria?",
              bg: "bg-navy-700",
            },
            {
              part: "III",
              title: "Gratidão",
              range: "Dom. XXXII–LII · Prgs. 86–129",
              question: "Como agradecemos a Deus?",
              bg: "bg-navy-600",
            },
          ].map((p) => (
            <AnimatedContent key={p.part}>
              <div
                className={`${p.bg} texture-hatch p-8 text-primary-foreground h-full flex flex-col`}
              >
                <span className="font-serif text-gold-400 text-5xl font-light mb-4">
                  {p.part}
                </span>
                <h4 className="font-serif text-primary-foreground text-2xl font-semibold mb-2">
                  {p.title}
                </h4>
                <p
                  className="font-serif italic text-primary-foreground/65 mb-4"
                  style={{ fontSize: "var(--text-size-lg)" }}
                >
                  "{p.question}"
                </p>
                <p
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40 mt-auto"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {p.range}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
        <AnimatedContent className="mt-8">
          <IRBButton variant="secondary" href="/catecismo">
            Explorar o Catecismo →
          </IRBButton>
        </AnimatedContent>
      </Section>

      {/* Cânones de Dort / TULIP */}
      <Section bg="inverse" texture="hatch" className="!bg-navy-900" id="dort">
        <AnimatedContent>
          <p className="section-tag mb-6">Dort · 1619</p>
          <h2
            className="font-serif text-primary-foreground mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Cânones de Dort
          </h2>
        </AnimatedContent>
        <div className="space-y-4 max-w-3xl">
          {tulipData.map((item, i) => (
            <AnimatedContent key={item.letter}>
              <div
                className="border border-primary-foreground/10 cursor-pointer transition-all duration-700"
                onClick={() => setExpandedTulip(expandedTulip === i ? null : i)}
              >
                <div className="flex items-center gap-6 p-6">
                  <span className="font-serif text-gold-400 text-4xl font-light min-w-[40px]">
                    {item.letter}
                  </span>
                  <div className="flex-1">
                    <span className="font-serif italic text-primary-foreground/60 mr-3">
                      {item.latin}
                    </span>
                    <span className="font-serif text-primary-foreground font-semibold">
                      {item.title}
                    </span>
                  </div>
                  <span
                    className="font-mono text-gold-400/60"
                    style={{ fontSize: "var(--text-size-xs)" }}
                  >
                    {item.verse}
                  </span>
                </div>
                <AnimatePresence>
                  {expandedTulip === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-primary-foreground/10">
                        <p className="font-sans text-primary-foreground/65 leading-relaxed mt-4">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>
    </div>
  )
}
