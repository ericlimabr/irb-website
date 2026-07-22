"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import {
  VerticalCard,
  HorizontalCard,
  TestimonialCard,
  IRBButton,
} from "@/components/layout/Cards"
import {
  AFTERNOON_LITURGY_TIME,
  CHURCH_MINISTRIES,
  MOCKUP_HOME_BLOG,
  MORNING_LITURGY_TIME,
  SCHEDULE_DATA,
} from "@/const"
import { website_config_variables } from "@/config"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null)

  // GSAP stat counter animation
  useEffect(() => {
    if (!statsRef.current) return
    const statEls = statsRef.current.querySelectorAll("[data-stat]")
    statEls.forEach((el) => {
      const target = parseInt(el.getAttribute("data-stat") || "0")
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString()
        },
      })
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <div className="min-h-screen">
      {/* 1.1 Hero */}
      <Masthead
        eyebrow="Igreja Reformada de Brasília"
        title={
          <>
            Fiel à Palavra,
            <br />
            <em className="text-gold-400">Firmada na Doutrina.</em>
          </>
        }
        subtitle="Proclamando a soberania de Deus e a suficiência das Escrituras através das Três Formas de Unidade."
      />

      {/* 1.2 Marquee */}
      <div className="bg-gold-500 py-3 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="flex items-center" aria-hidden={i === 1}>
              {Array.from({ length: 4 }, (_, r) =>
                [
                  "Sola Scriptura",
                  "Sola Fide",
                  "Sola Gratia",
                  "Solus Christus",
                  "Soli Deo Gloria",
                ].map((s) => (
                  <span
                    key={`${r}-${s}`}
                    className="font-mono uppercase tracking-[0.2em] text-navy-700 text-xs flex items-center gap-8 px-4"
                  >
                    {s}
                    <span className="text-navy-700/30">·</span>
                  </span>
                )),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 1.3 Sobre a Igreja */}
      <Section bg="surface-alt" texture="linen">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <AnimatedContent>
            <p className="section-tag mb-6">Sobre a Igreja</p>
            <h2
              className="font-serif text-navy-700 mb-6"
              style={{ fontSize: "var(--text-size-4xl)" }}
            >
              Conheça a<br />
              <em className="text-gold-500">Igreja Reformada</em>
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed mb-6">
              Uma congregação confessional firmada nas Três Formas de Unidade,
              comprometida com a pregação expositiva, o culto ordeiro e a
              piedade reformada em Brasília, DF.
            </p>
            <IRBButton href="/sobre">Conheça Nossa História →</IRBButton>
          </AnimatedContent>

          <div className="space-y-4">
            {[
              {
                eyebrow: "Fundação",
                title: "Nossa História",
                meta: "Desde 2015",
              },
              {
                eyebrow: "Confissão",
                title: "O Que Cremos",
                meta: "Três Formas",
              },
              {
                eyebrow: "Comunhão",
                title: "Tornar-se Membro",
                meta: "Catequese",
              },
            ].map((item) => (
              <HorizontalCard
                key={item.title}
                eyebrow={item.eyebrow}
                title={item.title}
                meta={item.meta}
                href="/sobre"
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 1.4 Confissões */}
      <Section bg="surface">
        <AnimatedContent>
          <p className="section-tag mb-6">Confissões</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            As Três Formas
            <br />
            <em className="text-gold-500">de Unidade</em>
          </h2>
        </AnimatedContent>

        <div className="grid md:grid-cols-3 gap-6">
          <VerticalCard
            eyebrow="Países Baixos · 1561"
            title="Confissão Belga"
            description="Trinta e sete artigos que expõem a doutrina reformada contra as heresias da época."
            href="/confissao-belga"
            meta="37 Artigos"
            image="/confessions/confession.jpeg"
          />
          <VerticalCard
            eyebrow="Heidelberg · 1563"
            title="Catecismo de Heidelberg"
            description="O único consolo na vida e na morte — 129 perguntas e respostas para instrução da fé."
            href="/catecismo"
            meta="129 Perguntas"
            featured
            image="/confessions/heidelberg.jpeg"
          />
          <VerticalCard
            eyebrow="Dort · 1619"
            title="Cânones de Dort"
            description="Os cinco pontos da graça soberana em resposta às Remonstrâncias."
            href="/canones-de-dort"
            meta="5 Pontos"
            image="/confessions/dort.jpeg"
          />
        </div>
      </Section>

      {/* 1.5 Doutrina */}
      <Section bg="inverse" texture="hatch">
        <AnimatedContent>
          <p className="section-tag mb-6">Doutrina</p>
          <h2
            className="font-serif text-primary-foreground mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Perguntas
            <br />
            <em className="text-gold-400">Fundamentais</em>
          </h2>
        </AnimatedContent>

        <div className="space-y-8 max-w-2xl">
          {[
            "O que é a eleição soberana?",
            "Qual é o meu único consolo?",
            "Como devo adorar a Deus?",
          ].map((q) => (
            <AnimatedContent key={q}>
              <p
                className="font-serif italic text-primary-foreground/55"
                style={{ fontSize: "var(--text-size-2xl)" }}
              >
                {q}
              </p>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent className="mt-12">
          <IRBButton variant="inverse" href="/doutrina">
            Explorar a Doutrina →
          </IRBButton>
        </AnimatedContent>
      </Section>

      {/* 1.6 Agenda */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-6">Agenda</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Agenda
            <br />
            <em className="text-gold-500">da Igreja</em>
          </h2>
        </AnimatedContent>

        <div className="space-y-4 max-w-3xl">
          {SCHEDULE_DATA.map((ev) => (
            <HorizontalCard key={ev.title} {...ev} href="/agenda" />
          ))}
        </div>

        <AnimatedContent className="mt-8">
          <IRBButton variant="secondary" href="/agenda">
            Ver Agenda Completa →
          </IRBButton>
        </AnimatedContent>
      </Section>

      {/* 1.7 Sermões & Mídia */}
      <Section bg="surface">
        <AnimatedContent>
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="section-tag mb-6">Mídia</p>
              <h2
                className="font-serif text-navy-700"
                style={{ fontSize: "var(--text-size-4xl)" }}
              >
                Sermões
                <br />
                <em className="text-gold-500">& Mídia</em>
              </h2>
            </div>
            <IRBButton variant="secondary" href="/media">
              Ver Tudo →
            </IRBButton>
          </div>
        </AnimatedContent>

        <div className="grid md:grid-cols-3 gap-6">
          <VerticalCard
            eyebrow="Arquivo · Pregação"
            title="Sermões"
            description="Pregações expositivas da Palavra de Deus — arquivo completo de mensagens dominicais."
            href="/media"
          />
          <VerticalCard
            eyebrow="Estudo · Expositivo"
            title="Séries de Pregação"
            description="Séries temáticas e expositivas livro a livro das Escrituras."
            href="/media"
          />
          <VerticalCard
            eyebrow="Áudio · Reflexão"
            title="Podcasts"
            description="Reflexões teológicas e conversas sobre a fé reformada."
            href="/media"
          />
        </div>
      </Section>

      {/* 1.8 Testimonials */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-12">Testemunhos</p>
        </AnimatedContent>
        <div className="grid md:grid-cols-2 gap-6">
          <TestimonialCard
            quote="Encontrei na IRB uma comunidade que honra a Palavra de Deus com reverência e profundidade. A pregação expositiva transformou minha compreensão das Escrituras."
            name="Maria Fernanda"
            role="Membro desde 2019"
          />
          <TestimonialCard
            quote="A catequese me deu fundamentos sólidos para minha fé. As confissões reformadas me ensinaram a articular o que sempre cri mas nunca soube expressar."
            name="Carlos Eduardo"
            role="Membro desde 2020"
            dark
          />
        </div>
      </Section>

      {/* 1.9 Stats */}
      <Section bg="inverse" className="!py-20">
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: 461, label: "Anos de Heidelberg", sub: "1563 — 2024" },
            { value: 1619, label: "Sínodo de Dort", sub: "Ano histórico" },
            { value: 37, label: "Artigos", sub: "Confissão Belga" },
            { value: 5, label: "Pontos da Graça", sub: "TULIP" },
          ].map((s) => (
            <AnimatedContent key={s.label}>
              <p
                data-stat={s.value}
                className="font-serif text-gold-400 mb-2"
                style={{ fontSize: "var(--text-size-5xl)" }}
              >
                0
              </p>
              <p
                className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60 mb-1"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {s.label}
              </p>
              <p
                className="font-mono text-primary-foreground/30"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                {s.sub}
              </p>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      {/* 1.10 Ministérios */}
      <Section bg="surface">
        <AnimatedContent>
          <p className="section-tag mb-6">Ministérios</p>
          <h2
            className="font-serif text-navy-700 mb-12"
            style={{ fontSize: "var(--text-size-4xl)" }}
          >
            Ministérios
            <br />
            <em className="text-gold-500">da Igreja</em>
          </h2>
        </AnimatedContent>

        <div className="space-y-4 max-w-3xl">
          {CHURCH_MINISTRIES.filter((m) => m.listable).map((m) => (
            <HorizontalCard
              key={m.title}
              eyebrow={m.tag}
              title={m.title}
              meta={m.summary}
              href="/ministerios"
            />
          ))}
        </div>

        <AnimatedContent className="mt-8">
          <IRBButton variant="secondary" href="/ministerios">
            Conheça Nossos Ministérios →
          </IRBButton>
        </AnimatedContent>
      </Section>

      {/* 1.11 Blog */}
      {website_config_variables.blog.active && (
        <Section bg="surface-alt" texture="linen">
          <AnimatedContent>
            <p className="section-tag mb-6">Blog</p>
            <h2
              className="font-serif text-navy-700 mb-12"
              style={{ fontSize: "var(--text-size-4xl)" }}
            >
              Reflexões
              <br />
              <em className="text-gold-500">& Artigos</em>
            </h2>
          </AnimatedContent>

          <div className="space-y-4 max-w-3xl">
            {MOCKUP_HOME_BLOG.map((post) => (
              <HorizontalCard
                key={post.title}
                {...post}
                href={post.href}
                linkText="Ler →"
              />
            ))}
          </div>

          <AnimatedContent className="mt-8">
            <IRBButton variant="secondary" href="/blog">
              Ver Todos os Artigos →
            </IRBButton>
          </AnimatedContent>
        </Section>
      )}

      {/* 1.12 CTA Final */}
      <Section bg="inverse" texture="hatch" className="!bg-navy-900">
        <div className="text-center max-w-2xl mx-auto">
          <AnimatedContent>
            <p className="section-tag justify-center mb-6">Venha nos Visitar</p>
            <h2
              className="font-serif text-primary-foreground mb-4"
              style={{ fontSize: "var(--text-size-4xl)" }}
            >
              Culto Dominical
              <br />
              <em className="text-gold-400">todos os domingos.</em>
            </h2>
            <p
              className="font-sans text-primary-foreground/55 mb-8"
              style={{ fontSize: "var(--text-size-lg)" }}
            >
              Às {MORNING_LITURGY_TIME} e {AFTERNOON_LITURGY_TIME} · Brasília,
              DF.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <IRBButton variant="inverse" href="/confissoes">
                Nossa Confissão →
              </IRBButton>
              <IRBButton variant="accent" href="/sobre">
                Como Chegar →
              </IRBButton>
            </div>
          </AnimatedContent>
        </div>
      </Section>
    </div>
  )
}
