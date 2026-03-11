"use client"

import { useState } from "react"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"

const categories = [
  "Todos",
  "Confessional",
  "Teologia Sistemática",
  "Exegese",
  "Piedade",
  "História",
  "Pregação",
]

const books = [
  {
    category: "Confessional",
    title: "As Três Formas de Unidade",
    author: "Igreja Reformada",
    desc: "Os padrões confessionais reunidos: Confissão Belga, Catecismo de Heidelberg e Cânones de Dort.",
    featured: true,
  },
  {
    category: "Teologia Sistemática",
    title: "Institutas da Religião Cristã",
    author: "João Calvino",
    desc: "A obra magna da teologia reformada — exposição sistemática da fé cristã.",
  },
  {
    category: "Exegese",
    title: "Comentário de Romanos",
    author: "João Calvino",
    desc: "Exposição verso a verso da epístola de Paulo aos Romanos.",
  },
  {
    category: "Piedade",
    title: "O Peregrino",
    author: "John Bunyan",
    desc: "A alegoria clássica da vida cristã como peregrinação rumo à Cidade Celestial.",
  },
  {
    category: "História",
    title: "A Reforma Protestante",
    author: "Diarmaid MacCulloch",
    desc: "Uma história abrangente da Reforma e seu impacto na civilização ocidental.",
  },
  {
    category: "Pregação",
    title: "Pregação e Pregadores",
    author: "D. M. Lloyd-Jones",
    desc: "Reflexões sobre a natureza, a necessidade e o método da pregação cristã.",
  },
  {
    category: "Teologia Sistemática",
    title: "Teologia Sistemática",
    author: "Herman Bavinck",
    desc: "A grande obra da tradição reformada holandesa sobre as doutrinas fundamentais.",
  },
  {
    category: "Piedade",
    title: "Mortificação do Pecado",
    author: "John Owen",
    desc: "Tratado clássico sobre a luta contra o pecado na vida do crente.",
  },
]

export default function BibliotecaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered =
    activeCategory === "Todos"
      ? books
      : books.filter((b) => b.category === activeCategory)
  const featured = filtered.find((b) => b.featured)
  const rest = filtered.filter((b) => !b.featured)

  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Biblioteca"
        title={
          <>
            Biblioteca
            <br />
            <em className="text-gold-400">Reformada.</em>
          </>
        }
        subtitle="Uma curadoria de obras fundamentais para o estudo da teologia reformada — das confissões históricas à tradição contemporânea."
      />

      {/* Filter */}
      <Section bg="surface">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono uppercase tracking-[0.1em] px-4 py-2 border transition-all duration-500 ${
                activeCategory === cat
                  ? "bg-gold-500 text-navy-700 border-gold-500"
                  : "bg-transparent text-muted-foreground border-border hover:border-gold-500 hover:text-gold-500"
              }`}
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      {/* Featured book */}
      {featured && (
        <Section bg="surface" className="!pt-0">
          <AnimatedContent>
            <div className="bg-navy-700 texture-hatch p-8 md:p-12 border border-primary-foreground/10">
              <p
                className="mono-label-sm text-gold-400 mb-3"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {featured.category}
              </p>
              <h3 className="font-serif text-primary-foreground text-3xl font-semibold mb-2">
                {featured.title}
              </h3>
              <p className="font-sans text-primary-foreground/65 text-sm mb-1">
                {featured.author}
              </p>
              <p className="font-sans text-primary-foreground/55 mt-4 max-w-xl">
                {featured.desc}
              </p>
            </div>
          </AnimatedContent>
        </Section>
      )}

      {/* Book Grid */}
      <Section bg="page">
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((book) => (
            <VerticalCard
              key={book.title}
              eyebrow={book.category}
              title={book.title}
              description={`${book.author} — ${book.desc}`}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
