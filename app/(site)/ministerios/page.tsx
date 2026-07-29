"use client"

import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import Testimonials from "@/components/layout/Testimonials"
import { IRBButton } from "@/components/layout/Cards"
import Image from "next/image"
import { CHURCH_MINISTRIES } from "@/const"
import { whatsappLink } from "@/utils/whatsapp"

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
          {CHURCH_MINISTRIES.filter((m) => m.listable).map((m, i) => (
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
                  <IRBButton
                    variant="secondary"
                    href={
                      m.href ??
                      whatsappLink(
                        `Olá! Gostaria de saber mais sobre ${m.title}.`,
                      )
                    }
                  >
                    {m.cta} →
                  </IRBButton>
                </div>
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "md:order-1" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, var(--navy-700), var(--navy-600))`,
                  }}
                >
                  {m.image && (
                    <Image
                      src={m.image}
                      alt=""
                      fill
                      // Half the container from md up, full width below.
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </Section>

      {/* Testemunhos */}
      <Testimonials />
    </div>
  )
}
