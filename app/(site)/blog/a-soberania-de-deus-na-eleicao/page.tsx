"use client"

import { useParams } from "next/navigation"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"
import Link from "next/link"

const articleData = {
  "a-soberania-de-deus-na-eleicao": {
    category: "Teologia",
    title: "A Soberania de Deus na Eleição",
    author: "Pr. Marcel Tavares",
    initials: "MT",
    date: "10 março 2026",
    readTime: "8 min de leitura",
    body: [
      {
        type: "lead",
        content:
          "A doutrina da eleição incondicional é uma das verdades mais preciosas e, ao mesmo tempo, mais debatidas da fé reformada. Neste artigo, buscamos examinar o que as Escrituras e os Cânones de Dort ensinam sobre a soberania de Deus na escolha do Seu povo.",
      },
      {
        type: "heading",
        content: "O Fundamento Bíblico da Eleição",
      },
      {
        type: "paragraph",
        content:
          "O apóstolo Paulo, escrevendo aos Efésios, declara que Deus «nos elegeu nele antes da fundação do mundo, para sermos santos e irrepreensíveis perante ele» (Ef 1.4 · ARA). Esta afirmação estabelece três verdades fundamentais sobre a eleição: ela é realizada por Deus, acontece antes da criação e tem como propósito a santificação do crente.",
      },
      {
        type: "paragraph",
        content:
          "A eleição não é uma resposta divina à fé prevista do homem. Antes, é o decreto soberano e gracioso pelo qual Deus, desde a eternidade, escolheu um número definido de pessoas para a salvação em Cristo. Esta verdade é consistentemente ensinada nas Escrituras, desde a escolha de Abraão até a declaração de nosso Senhor: «Não fostes vós que me escolhestes a mim; pelo contrário, eu vos escolhi a vós outros» (Jo 15.16 · ARA).",
      },
      {
        type: "scripture",
        reference: "Efésios 1.4–5 · ARA",
        content:
          "Assim como nos escolheu, nele, antes da fundação do mundo, para sermos santos e irrepreensíveis perante ele; e em amor nos predestinou para ele, para a adoção de filhos, por meio de Jesus Cristo, segundo o beneplácito de sua vontade.",
      },
      {
        type: "heading",
        content: "A Eleição nos Cânones de Dort",
      },
      {
        type: "paragraph",
        content:
          "O Sínodo de Dort (1618–1619) tratou desta doutrina com extraordinária precisão teológica. No Primeiro Capítulo dos Cânones, Artigo 7, lemos a definição confessional da eleição: «A eleição é o imutável propósito de Deus pelo qual, antes da fundação do mundo, Ele escolheu, da totalidade da raça humana, caída por sua própria culpa de sua integridade original no pecado e na destruição, um número definido de pessoas para a redenção em Cristo».",
      },
      {
        type: "paragraph",
        content:
          "Há quatro elementos fundamentais nesta definição que merecem nossa atenção cuidadosa: a imutabilidade do propósito divino, a anterioridade à criação, a consideração da humanidade em seu estado caído, e a definição numérica dos eleitos.",
      },
      {
        type: "pullquote",
        content:
          "A eleição não tem seu fundamento na fé prevista, na obediência da fé, na santidade ou em qualquer outra boa qualidade ou disposição, como causa ou condição previamente requerida no homem a ser escolhido.",
        attribution: "Cânones de Dort, I.9",
      },
      {
        type: "heading",
        content: "A Eleição e a Responsabilidade Humana",
      },
      {
        type: "paragraph",
        content:
          "Uma objeção frequente à doutrina da eleição incondicional é que ela supostamente anularia a responsabilidade humana. No entanto, as Escrituras mantêm ambas as verdades em perfeita harmonia. Deus é soberano em Sua eleição, e o homem é plenamente responsável por sua incredulidade.",
      },
      {
        type: "paragraph",
        content:
          "Os Cânones de Dort abordam esta questão com sabedoria pastoral: «A causa ou culpa da incredulidade, bem como de todos os outros pecados, de modo algum está em Deus, mas no próprio homem. A fé em Jesus Cristo e a salvação por meio dele, entretanto, é um dom gratuito de Deus» (Cânones de Dort, I.5).",
      },
      {
        type: "scripture",
        reference: "Romanos 9.16 · ARA",
        content:
          "Assim, pois, não depende de quem quer ou de quem corre, mas de usar Deus a sua misericórdia.",
      },
      {
        type: "heading",
        content: "A Eleição como Fonte de Conforto",
      },
      {
        type: "paragraph",
        content:
          "Longe de ser uma doutrina fria ou especulativa, a eleição é, na perspectiva reformada, uma das maiores fontes de consolo para o crente. Se a nossa salvação dependesse de nós — de nossa fé vacilante, de nossa obediência imperfeita — não teríamos segurança alguma. Mas porque ela repousa inteiramente na vontade soberana e imutável de Deus, podemos descansar na certeza de que «aquele que começou boa obra em vós há de completá-la até ao Dia de Cristo Jesus» (Fp 1.6 · ARA).",
      },
      {
        type: "paragraph",
        content:
          "O Catecismo de Heidelberg, na Pergunta 1, nos lembra que o nosso único consolo é pertencermos, de corpo e alma, na vida e na morte, ao nosso fiel Salvador Jesus Cristo. Esta pertença não é fruto de nossa decisão, mas do decreto eterno do Deus que nos amou antes que pudéssemos amá-lo.",
      },
      {
        type: "heading",
        content: "Conclusão",
      },
      {
        type: "paragraph",
        content:
          "A doutrina da eleição incondicional, corretamente compreendida, não conduz ao fatalismo nem à passividade. Antes, ela nos leva à adoração, à gratidão e à evangelização zelosa — pois sabemos que Deus tem um povo que certamente será trazido ao conhecimento da verdade. Que possamos, como igreja confessional, manter esta doutrina com firmeza, humildade e alegria, para a glória de Deus somente.",
      },
    ],
  },
}

const relatedPosts = [
  {
    category: "Confissão",
    title: "Por Que Confessamos a Fé Reformada",
    excerpt:
      "A importância das confissões históricas para a identidade e unidade da igreja.",
    author: "André Lima",
    date: "28 Jan 2026",
  },
  {
    category: "Vida Cristã",
    title: "A Oração como Meio de Graça",
    excerpt:
      "Como a oração se relaciona com os meios de graça e a piedade reformada.",
    author: "Pr. Marcel Tavares",
    date: "15 Jan 2026",
  },
  {
    category: "Teologia",
    title: "Graça Comum e Graça Especial",
    excerpt:
      "Distinguindo as operações da graça de Deus no mundo e na salvação dos eleitos.",
    author: "Pr. Marcel Tavares",
    date: "5 Dez 2025",
  },
]

export default function BlogPostPage() {
  const params = useParams()
  const id = "a-soberania-de-deus-na-eleicao" //params.id
  const article = articleData[id as keyof typeof articleData]

  //if (!article) {
  //  return (
  //    <div className="min-h-screen">
  //      <Section bg="page">
  //        <div className="text-center py-24">
  //          <h2 className="font-serif text-navy-700 text-3xl mb-4">
  //            Artigo não encontrado
  //          </h2>
  //          <Link
  //            href="/blog"
  //            className="font-mono uppercase tracking-[0.1em] text-gold-600 hover:text-gold-500 transition-colors duration-500"
  //            style={{ fontSize: "var(--text-size-xs)" }}
  //          >
  //            ← Voltar ao Blog
  //          </Link>
  //        </div>
  //      </Section>
  //    </div>
  //  )
  //}

  return (
    <div className="min-h-screen">
      {/* Article Masthead */}
      <section className="bg-navy-900 texture-grid pt-32 pb-20 relative overflow-hidden">
        {/* Gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 80%, hsla(37,46%,56%,0.06), transparent)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10 max-w-3xl">
          <AnimatedContent>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="mono-label-sm text-gold-400"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {article.category}
              </span>
              <span className="text-primary-foreground/30">·</span>
              <span
                className="font-mono text-primary-foreground/40"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {article.date}
              </span>
              <span className="text-primary-foreground/30">·</span>
              <span
                className="font-mono text-primary-foreground/40"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {article.readTime}
              </span>
            </div>

            <h1
              className="font-serif text-primary-foreground font-semibold mb-6"
              style={{ fontSize: "var(--text-size-4xl)" }}
            >
              {article.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-navy-700 border-2 border-gold-500 flex items-center justify-center">
                <span className="font-mono text-primary-foreground text-xs font-bold">
                  {article.initials}
                </span>
              </div>
              <div>
                <p className="font-sans text-primary-foreground text-sm font-semibold">
                  {article.author}
                </p>
                <p
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/50"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  Autor
                </p>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Gold divider */}
      <div className="h-[3px] bg-gold-500" />

      {/* Article Body */}
      <Section bg="surface">
        <article className="max-w-3xl mx-auto">
          {article.body.map((block, i) => {
            switch (block.type) {
              case "lead":
                return (
                  <p
                    key={i}
                    className="font-serif text-navy-700 leading-relaxed mb-8"
                    style={{ fontSize: "var(--text-size-lg)" }}
                  >
                    {block.content}
                  </p>
                )

              case "heading":
                return (
                  <h2
                    key={i}
                    className="font-serif text-navy-700 font-semibold mt-12 mb-4"
                    style={{ fontSize: "var(--text-size-2xl)" }}
                  >
                    {block.content}
                  </h2>
                )

              case "paragraph":
                return (
                  <p
                    key={i}
                    className="font-sans text-muted-foreground leading-relaxed mb-6"
                    style={{ fontSize: "var(--text-size-base)" }}
                  >
                    {block.content}
                  </p>
                )

              case "scripture":
                return (
                  <blockquote
                    key={i}
                    className="border-l-[3px] border-gold-500 pl-6 py-4 my-8 bg-surface-alt"
                  >
                    <p
                      className="font-serif italic text-navy-700 leading-relaxed mb-2"
                      style={{ fontSize: "var(--text-size-lg)" }}
                    >
                      {block.content}
                    </p>
                    <cite
                      className="font-mono uppercase tracking-[0.1em] text-gold-600 not-italic"
                      style={{ fontSize: "var(--text-size-xs)" }}
                    >
                      {block.reference}
                    </cite>
                  </blockquote>
                )

              case "pullquote":
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-gold-500 pl-8 py-6 my-12"
                  >
                    <p
                      className="font-serif italic text-navy-700 leading-relaxed"
                      style={{ fontSize: "var(--text-size-xl)" }}
                    >
                      «{block.content}»
                    </p>
                    {block.attribution && (
                      <cite
                        className="block font-mono uppercase tracking-[0.1em] text-gold-600 not-italic mt-4"
                        style={{ fontSize: "var(--text-size-xs)" }}
                      >
                        — {block.attribution}
                      </cite>
                    )}
                  </blockquote>
                )

              default:
                return null
            }
          })}

          {/* Ornate Divider */}
          <div className="flex items-center justify-center gap-4 my-16">
            <div className="h-px w-16 bg-gold-500/30" />
            <span className="font-serif italic text-gold-500/50 text-2xl">
              ✦
            </span>
            <div className="h-px w-16 bg-gold-500/30" />
          </div>

          {/* Author Card */}
          <div className="bg-surface-alt border border-border p-8 flex items-start gap-6">
            <div className="w-16 h-16 bg-navy-700 border-2 border-gold-500 flex items-center justify-center shrink-0">
              <span className="font-mono text-primary-foreground text-lg font-bold">
                {article.initials}
              </span>
            </div>
            <div>
              <p
                className="font-serif text-navy-700 font-semibold mb-1"
                style={{ fontSize: "var(--text-size-xl)" }}
              >
                {article.author}
              </p>
              <p
                className="font-mono uppercase tracking-[0.1em] text-gold-600 mb-3"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                Pastor · Igreja Reformada de Brasília
              </p>
              <p
                className="font-sans text-muted-foreground leading-relaxed"
                style={{ fontSize: "var(--text-size-sm)" }}
              >
                Formado em Teologia Reformada, é pastor titular da Igreja
                Reformada de Brasília desde 2025. Dedicado à pregação expositiva
                e ao ensino confessional.
              </p>
            </div>
          </div>
        </article>
      </Section>

      {/* Related Articles */}
      <Section bg="surface-alt">
        <AnimatedContent>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-gold-500" />
            <span
              className="font-mono uppercase tracking-[0.35em] text-gold-500"
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              Artigos Relacionados
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <VerticalCard
                key={post.title}
                eyebrow={post.category}
                title={post.title}
                description={post.excerpt}
                meta={`${post.author} · ${post.date}`}
                href="/blog"
                linkText="Ler →"
              />
            ))}
          </div>
        </AnimatedContent>
      </Section>
    </div>
  )
}
