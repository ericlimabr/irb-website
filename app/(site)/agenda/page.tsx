"use client"

import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { HorizontalCard } from "@/components/layout/Cards"

export default function AgendaPage() {
  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Agenda"
        title={
          <>
            Agenda
            <br />
            <em className="text-gold-400">da Igreja.</em>
          </>
        }
        subtitle="Cultos, estudos, catequese e conferências — todos os eventos da congregação."
      />

      {/* Próximos Eventos */}
      <Section bg="surface">
        <AnimatedContent>
          <p className="section-tag mb-6">Próximos Eventos</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Calendário
          </h2>
        </AnimatedContent>
        <div className="space-y-4 max-w-3xl">
          {[
            {
              dateDay: "09",
              dateMonth: "Mar",
              eyebrow: "Culto Dominical",
              title: "Culto de Adoração",
              meta: "10h00 · Templo IRB",
            },
            {
              dateDay: "12",
              dateMonth: "Mar",
              eyebrow: "Estudo Bíblico",
              title: "Estudo de Romanos",
              meta: "19h30 · Sala de Estudos",
            },
            {
              dateDay: "15",
              dateMonth: "Mar",
              eyebrow: "Conferência",
              title: "Conferência de Teologia Reformada",
              meta: "09h00–17h00 · Templo IRB",
            },
            {
              dateDay: "16",
              dateMonth: "Mar",
              eyebrow: "Culto Dominical",
              title: "Culto de Adoração",
              meta: "10h00 · Templo IRB",
            },
            {
              dateDay: "19",
              dateMonth: "Mar",
              eyebrow: "Catequese",
              title: "Aula de Catequese — Módulo III",
              meta: "19h30 · Sala de Estudos",
            },
          ].map((ev) => (
            <HorizontalCard
              key={`${ev.dateDay}${ev.title}`}
              {...ev}
              href="/agenda"
              linkText="Detalhes →"
            />
          ))}
        </div>
      </Section>

      {/* Cultos Regulares */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-6">Programação Regular</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Cultos <em className="text-gold-500">Regulares</em>
          </h2>
        </AnimatedContent>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Culto Dominical",
              time: "10h00",
              day: "Domingos",
              desc: "Pregação expositiva, canto de salmos e hinos, oração e sacramentos.",
            },
            {
              title: "Escola Dominical",
              time: "09h00",
              day: "Domingos",
              desc: "Instrução bíblica para todas as idades antes do culto principal.",
            },
            {
              title: "Estudo Bíblico",
              time: "19h30",
              day: "Quartas",
              desc: "Estudo detalhado das Escrituras e aplicação à vida cristã.",
            },
          ].map((s) => (
            <AnimatedContent key={s.title}>
              <div className="border border-border p-6 bg-surface">
                <h4
                  className="font-serif text-navy-700 font-semibold"
                  style={{ fontSize: "var(--text-size-lg)" }}
                >
                  {s.title}
                </h4>
                <p className="font-mono text-gold-500 text-2xl font-bold mt-2">
                  {s.time}
                </p>
                <p
                  className="font-mono uppercase tracking-[0.1em] text-muted-foreground mt-1 mb-3"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {s.day}
                </p>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">
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
