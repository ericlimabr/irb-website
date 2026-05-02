"use client"

import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"
import {
  MOCKUP_HIGHLIGHTED_SERMON,
  MOCKUP_MEDIA_COUNTERS,
  MOCKUP_SERMON_LISTINGS,
} from "@/const"

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
          {MOCKUP_MEDIA_COUNTERS.map((s) => (
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
      {MOCKUP_HIGHLIGHTED_SERMON && (
        <Section bg="surface">
          <AnimatedContent>
            <div className="bg-navy-700 texture-hatch p-8 md:p-12 border border-primary-foreground/10">
              <p
                className="mono-label-sm text-gold-400 mb-3"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {MOCKUP_HIGHLIGHTED_SERMON.breadcrumb}
              </p>
              <h3 className="font-serif text-primary-foreground text-3xl font-semibold mb-3">
                {MOCKUP_HIGHLIGHTED_SERMON.title}
              </h3>
              <p className="font-sans text-primary-foreground/65 mb-6 max-w-xl">
                {MOCKUP_HIGHLIGHTED_SERMON.description}
              </p>
              <div className="flex items-center gap-4">
                <span
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {MOCKUP_HIGHLIGHTED_SERMON.metadata}
                </span>
              </div>
            </div>
          </AnimatedContent>
        </Section>
      )}

      {/* Grid */}
      <Section bg="page">
        <div className="grid md:grid-cols-3 gap-6">
          {MOCKUP_SERMON_LISTINGS.map((item) => (
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
