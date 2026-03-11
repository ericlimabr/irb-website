"use client"

import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"

export default function MediaPage() {
  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Mídia"
        title={
          <>
            Palavra
            <br />
            <em className="text-gold-400">Pregada.</em>
          </>
        }
        subtitle="Exposição sistemática das Escrituras — arquivo completo de pregações, séries expositivas e podcasts."
      >
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            { n: "48", label: "Sermões" },
            { n: "6", label: "Séries" },
            { n: "12", label: "Episódios" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-mono text-gold-400 text-lg font-bold">
                {s.n}
              </span>
              <p
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40 mt-1"
                style={{ fontSize: "8px" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Masthead>

      {/* Featured */}
      <Section bg="surface">
        <AnimatedContent>
          <div className="bg-navy-700 texture-hatch p-8 md:p-12 border border-primary-foreground/10">
            <p
              className="mono-label-sm text-gold-400 mb-3"
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              Sermão em Destaque · Romanos
            </p>
            <h3 className="font-serif text-primary-foreground text-3xl font-semibold mb-3">
              A Justificação pela Fé
            </h3>
            <p className="font-sans text-primary-foreground/65 mb-6 max-w-xl">
              Uma exposição de Romanos 3.21–26 sobre a justiça de Deus revelada
              no Evangelho e a justificação gratuita pela fé em Cristo Jesus.
            </p>
            <div className="flex items-center gap-4">
              <span
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                Romanos 3.21–26 · 45min · 10 Mar 2024
              </span>
            </div>
          </div>
        </AnimatedContent>
      </Section>

      {/* Grid */}
      <Section bg="page">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              eyebrow: "Sermão · Romanos",
              title: "O Poder do Evangelho",
              meta: "Rm 1.16–17 · 38min",
            },
            {
              eyebrow: "Sermão · Gênesis",
              title: "No Princípio, Deus",
              meta: "Gn 1.1–5 · 42min",
            },
            {
              eyebrow: "Série · Heidelberg",
              title: "O Único Consolo",
              meta: "P&R 1 · 35min",
            },
            {
              eyebrow: "Podcast · Reflexão",
              title: "Soberania e Oração",
              meta: "Episódio 7 · 28min",
            },
            {
              eyebrow: "Sermão · Salmos",
              title: "O Pastor de Israel",
              meta: "Sl 23 · 40min",
            },
            {
              eyebrow: "Série · Confissão Belga",
              title: "A Doutrina de Deus",
              meta: "Art. I–II · 44min",
            },
          ].map((item) => (
            <VerticalCard
              key={item.title}
              eyebrow={item.eyebrow}
              title={item.title}
              meta={item.meta}
              href="/media"
              linkText="Ouvir →"
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
