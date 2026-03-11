"use client"

import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { TestimonialCard, IRBButton } from "@/components/layout/Cards"

export default function MinisteriosPage() {
  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Ministérios"
        title={
          <>
            Ministérios
            <br />
            <em className="text-gold-400">da Igreja.</em>
          </>
        }
        subtitle="Cada ministério nasce da confissão e serve à edificação da congregação e ao serviço ao próximo."
      />

      {/* Ministry blocks */}
      <Section bg="surface">
        <div className="space-y-20">
          {[
            {
              tag: "Educação",
              title: "Catequese",
              desc: "Programa de instrução confessional para novos membros e jovens. Estudamos as Três Formas de Unidade, os fundamentos da doutrina reformada e a aplicação prática da fé.",
              cta: "Participar da Catequese",
            },
            {
              tag: "Estudo",
              title: "Grupos de Estudo Bíblico",
              desc: "Encontros semanais para estudo aprofundado das Escrituras em pequenos grupos. Método expositivo, livro a livro, com ênfase na teologia bíblica e aplicação à vida cristã.",
              cta: "Entrar em um Grupo",
            },
            {
              tag: "Assistência",
              title: "Diaconia & Misericórdia",
              desc: "Ministério de misericórdia dedicado ao cuidado prático da congregação e da comunidade — apoio a famílias necessitadas, visitas hospitalares e ações de compaixão.",
              cta: "Contribuir",
            },
            {
              tag: "Famílias",
              title: "Ministério Familiar",
              desc: "Apoio às famílias na tradição reformada — criação dos filhos na aliança, catequese familiar, aconselhamento matrimonial e comunhão entre famílias da congregação.",
              cta: "Saber Mais",
            },
          ].map((m, i) => (
            <AnimatedContent key={m.title}>
              <div
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <p className="section-tag mb-4">{m.tag}</p>
                  <h3
                    className="font-serif text-navy-700 font-semibold mb-4"
                    style={{ fontSize: "var(--text-size-3xl)" }}
                  >
                    {m.title}
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                    {m.desc}
                  </p>
                  <IRBButton variant="secondary">{m.cta} →</IRBButton>
                </div>
                <div
                  className={`aspect-[4/3] ${i % 2 === 1 ? "md:order-1" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, var(--navy-700), var(--navy-600))`,
                  }}
                />
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      {/* Testemunhos */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-12">Testemunhos</p>
        </AnimatedContent>
        <div className="grid md:grid-cols-2 gap-6">
          <TestimonialCard
            quote="A catequese foi transformadora para minha família. Aprendemos juntos os fundamentos da fé reformada e crescemos em comunhão com a igreja."
            name="Ana Beatriz"
            role="Membro desde 2021"
          />
          <TestimonialCard
            quote="O grupo de estudo bíblico me ajudou a entender as Escrituras de forma que eu nunca havia experimentado. A profundidade da exposição é extraordinária."
            name="Pedro Henrique"
            role="Membro desde 2020"
            dark
          />
        </div>
      </Section>
    </div>
  )
}
