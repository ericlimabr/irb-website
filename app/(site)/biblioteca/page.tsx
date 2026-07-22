"use client"

import { useState } from "react"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"
import { MOCKUP_BOOKS_CATEGORIES, MOCKUP_BOOKS_LISTINGS } from "@/const"

export default function BibliotecaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered =
    activeCategory === "Todos"
      ? MOCKUP_BOOKS_LISTINGS
      : MOCKUP_BOOKS_LISTINGS.filter((b) => b.category === activeCategory)
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
          {MOCKUP_BOOKS_CATEGORIES.map((cat) => (
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
