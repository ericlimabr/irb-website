"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"

const qaData = [
  {
    theme: "Deus e Criação",
    questions: [
      {
        q: "O que é Deus?",
        a: "Deus é espírito, infinito, eterno e imutável em seu ser, sabedoria, poder, santidade, justiça, bondade e verdade.",
        ref: "Jo 4.24 · ARA",
        conf: "Conf. Belga, Art. I",
      },
      {
        q: "O que é a Trindade?",
        a: "A doutrina da Trindade ensina que existe um só Deus em três pessoas distintas — Pai, Filho e Espírito Santo — coeternas e coiguais.",
        ref: "Mt 28.19 · ARA",
        conf: "Conf. Belga, Art. VIII",
      },
    ],
  },
  {
    theme: "Salvação (Graça)",
    questions: [
      {
        q: "O que é eleição soberana?",
        a: "É o decreto eterno de Deus pelo qual Ele escolheu, antes da fundação do mundo, um número certo de pessoas para a salvação em Cristo, não por mérito previsto, mas segundo Sua livre graça.",
        ref: "Ef 1.4–5 · ARA",
        conf: "Cânones de Dort, I",
      },
      {
        q: "O que é expiação definida?",
        a: "Cristo morreu salvadoramente pelos eleitos, garantindo eficazmente a redenção de todos por quem Ele se entregou.",
        ref: "Jo 10.15 · ARA",
        conf: "Cânones de Dort, II",
      },
      {
        q: "O que é graça irresistível?",
        a: "O Espírito Santo aplica infalível e eficazmente a obra de Cristo aos eleitos, regenerando seus corações e trazendo-os irresistivelmente à fé.",
        ref: "Jo 6.37 · ARA",
        conf: "Cânones de Dort, III–IV",
      },
    ],
  },
  {
    theme: "A Igreja",
    questions: [
      {
        q: "O que é a Igreja?",
        a: "A Igreja é a assembleia dos verdadeiros crentes, unidos a Cristo pela fé, governada pela Palavra e marcada pela pregação pura do Evangelho, a reta administração dos sacramentos e o exercício da disciplina.",
        ref: "Mt 16.18 · ARA",
        conf: "Conf. Belga, Art. XXVII",
      },
      {
        q: "O que são os sacramentos?",
        a: "São sinais e selos visíveis da graça invisível de Deus, instituídos por Cristo: o Batismo e a Santa Ceia.",
        ref: "Mt 28.19 · ARA",
        conf: "Cat. Heidelberg, P. 66",
      },
    ],
  },
]

export default function DoutrinaPage() {
  const [openQ, setOpenQ] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Doutrina"
        title={
          <>
            Doutrina
            <br />
            <em className="text-gold-400">Reformada.</em>
          </>
        }
        subtitle="Perguntas fundamentais respondidas pela Palavra — fundamentadas nas confissões históricas."
      />

      {/* Q&A Accordion */}
      <Section bg="surface">
        <AnimatedContent>
          <p className="section-tag mb-6">Perguntas Fundamentais</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Grandes Perguntas
          </h2>
        </AnimatedContent>
        <div className="max-w-3xl space-y-12">
          {qaData.map((group) => (
            <div key={group.theme}>
              <h3
                className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-6"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {group.theme}
              </h3>
              <div className="space-y-3">
                {group.questions.map((qa) => (
                  <AnimatedContent key={qa.q}>
                    <div
                      className="border border-border bg-surface cursor-pointer transition-shadow duration-700 hover:shadow-lg"
                      onClick={() => setOpenQ(openQ === qa.q ? null : qa.q)}
                    >
                      <div className="p-6">
                        <h4
                          className="font-serif text-navy-700 font-semibold"
                          style={{ fontSize: "var(--text-size-xl)" }}
                        >
                          {qa.q}
                        </h4>
                      </div>
                      <AnimatePresence>
                        {openQ === qa.q && (
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
                            <div className="px-6 pb-6 border-t border-border">
                              <p className="font-sans text-muted-foreground leading-relaxed mt-4 mb-4">
                                {qa.a}
                              </p>
                              <div className="callout-scripture text-sm mb-3">
                                {qa.ref}
                              </div>
                              <span
                                className="inline-block font-mono uppercase tracking-[0.1em] text-gold-600 bg-gold-500/10 px-2 py-1"
                                style={{ fontSize: "var(--text-size-xs)" }}
                              >
                                {qa.conf}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </AnimatedContent>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Cinco Solas */}
      <Section bg="inverse" texture="hatch">
        <AnimatedContent>
          <p className="section-tag mb-6">Princípios</p>
          <h2
            className="font-serif text-primary-foreground mb-12"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            As Cinco <em className="text-gold-400">Solas</em>
          </h2>
        </AnimatedContent>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            {
              latin: "Sola Scriptura",
              pt: "Somente a Escritura",
              desc: "A Bíblia é a única regra infalível de fé e prática.",
            },
            {
              latin: "Sola Fide",
              pt: "Somente pela Fé",
              desc: "A justificação é recebida somente pela fé.",
            },
            {
              latin: "Sola Gratia",
              pt: "Somente pela Graça",
              desc: "A salvação é inteiramente obra da graça de Deus.",
            },
            {
              latin: "Solus Christus",
              pt: "Somente Cristo",
              desc: "Cristo é o único mediador entre Deus e os homens.",
            },
            {
              latin: "Soli Deo Gloria",
              pt: "Somente a Deus a Glória",
              desc: "Toda a glória pertence exclusivamente a Deus.",
            },
          ].map((s) => (
            <AnimatedContent key={s.latin}>
              <div className="border border-primary-foreground/10 p-6 h-full">
                <h4
                  className="font-serif italic text-gold-400 mb-2"
                  style={{ fontSize: "var(--text-size-lg)" }}
                >
                  {s.latin}
                </h4>
                <p
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60 mb-4"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {s.pt}
                </p>
                <p className="font-sans text-primary-foreground/55 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>
    </div>
  )
}
