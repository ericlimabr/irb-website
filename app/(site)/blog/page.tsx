"use client"

import { useState } from "react"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard, IRBButton } from "@/components/layout/Cards"
import { MOCKUP_BLOG_CATEGORIES, MOCKUP_BLOG_POSTS } from "@/const"

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filtered =
    activeCategory === "Todos"
      ? MOCKUP_BLOG_POSTS
      : MOCKUP_BLOG_POSTS.filter(
          (p) => p.category === activeCategory || p.featured,
        )
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
          {MOCKUP_BLOG_CATEGORIES.map((cat) => (
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

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((post) => (
            <VerticalCard
              key={post.title}
              eyebrow={post.category}
              title={post.title}
              description={post.excerpt}
              meta={`${post.author} · ${post.date} · ${post.readTime}`}
              href={post.href}
              linkText="Ler →"
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
