"use client"

import { useState } from "react"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard, IRBButton } from "@/components/layout/Cards"

const blogCategories = [
  "Todos",
  "Teologia",
  "Confissão",
  "Vida Cristã",
  "Pregação",
  "História da Igreja",
]

const posts = [
  {
    category: "Teologia",
    title: "A Soberania de Deus na Eleição",
    excerpt:
      "Uma reflexão sobre a doutrina da eleição incondicional à luz das Escrituras e dos Cânones de Dort.",
    author: "Pr. Marcel Tavares",
    date: "12 Fev 2026",
    readTime: "8 min",
    featured: true,
  },
  {
    category: "Confissão",
    title: "Por Que Confessamos a Fé Reformada",
    excerpt:
      "A importância das confissões históricas para a identidade e unidade da igreja.",
    author: "André Lima",
    date: "28 Jan 2026",
    readTime: "6 min",
  },
  {
    category: "Vida Cristã",
    title: "A Oração como Meio de Graça",
    excerpt:
      "Como a oração se relaciona com os meios de graça e a piedade reformada.",
    author: "Pr. Marcel Tavares",
    date: "15 Jan 2026",
    readTime: "5 min",
  },
  {
    category: "Pregação",
    title: "A Pregação Expositiva na Tradição Reformada",
    excerpt:
      "Por que a exposição verso a verso das Escrituras é o método preferido de pregação.",
    author: "Pr. Marcel Tavares",
    date: "2 Jan 2026",
    readTime: "7 min",
  },
  {
    category: "História da Igreja",
    title: "Guido de Brès e a Confissão Belga",
    excerpt:
      "A história do mártir que escreveu a Confissão Belga em defesa da fé reformada.",
    author: "Thiago Montenegro",
    date: "18 Dez 2025",
    readTime: "9 min",
  },
  {
    category: "Teologia",
    title: "Graça Comum e Graça Especial",
    excerpt:
      "Distinguindo as operações da graça de Deus no mundo e na salvação dos eleitos.",
    author: "Pr. Marcel Tavares",
    date: "5 Dez 2025",
    readTime: "6 min",
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered =
    activeCategory === "Todos"
      ? posts
      : posts.filter((p) => p.category === activeCategory || p.featured)
  const featured = filtered.find((p) => p.featured)
  const rest = filtered.filter((p) => !p.featured)

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Blog"
        title={
          <>
            Reflexões
            <br />
            <em className="text-gold-400">& Artigos.</em>
          </>
        }
        subtitle="Teologia aplicada — artigos sobre a fé reformada, a vida cristã e o ministério confessional."
      />

      {/* Featured */}
      {featured && (
        <Section bg="surface">
          <AnimatedContent>
            <div className="bg-navy-700 texture-hatch p-8 md:p-12 border border-primary-foreground/10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="mono-label-sm text-gold-400"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {featured.category}
                </span>
                <span className="text-primary-foreground/30">·</span>
                <span
                  className="font-mono text-primary-foreground/40"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {featured.date}
                </span>
              </div>
              <h3 className="font-serif text-primary-foreground text-3xl font-semibold mb-3">
                {featured.title}
              </h3>
              <p className="font-sans text-primary-foreground/65 mb-6 max-w-xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-sans text-primary-foreground/50 text-sm">
                  {featured.author}
                </span>
                <IRBButton
                  variant="inverse"
                  href="/blog/a-soberania-de-deus-na-eleicao"
                >
                  Ler Artigo →
                </IRBButton>
              </div>
            </div>
          </AnimatedContent>
        </Section>
      )}

      {/* Filter */}
      <Section bg="page" className="!pt-0">
        <div className="flex flex-wrap gap-3 my-8">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-500 ${activeCategory === cat
                ? "bg-gold-500 text-navy-700 border-gold-500"
                : "bg-transparent text-muted-foreground border-border hover:border-gold-500 hover:text-gold-500"
                }`}
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((post) => (
            <VerticalCard
              key={post.title}
              eyebrow={post.category}
              title={post.title}
              description={post.excerpt}
              meta={`${post.author} · ${post.date} · ${post.readTime}`}
              href="/blog"
              linkText="Ler →"
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
