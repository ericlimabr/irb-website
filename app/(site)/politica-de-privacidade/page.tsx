import type { Metadata } from "next"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"
import { PRIVACY_POLICY } from "@/const"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Igreja Reformada de Brasília trata os dados pessoais de quem visita este site, em conformidade com a LGPD (Lei 13.709/2018).",
  alternates: { canonical: "/politica-de-privacidade" },
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Política de Privacidade", path: "/politica-de-privacidade" },
        ]}
      />

      <Masthead
        fullHeight={false}
        eyebrow="Privacidade"
        title={
          <>
            Política de
            <br />
            <em className="text-gold-400">Privacidade.</em>
          </>
        }
        subtitle="Como tratamos os seus dados — com transparência e conforme a LGPD."
      />

      <Section bg="surface">
        <AnimatedContent>
          <div className="mx-auto max-w-3xl">
            <p className="font-mono uppercase tracking-[0.1em] text-navy-700/50 text-2xs mb-8">
              Última atualização: {PRIVACY_POLICY.updatedAt}
            </p>

            <p className="font-serif text-navy-700 text-2xl leading-relaxed mb-12">
              {PRIVACY_POLICY.intro}
            </p>

            <div className="space-y-12">
              {PRIVACY_POLICY.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-serif text-navy-700 text-3xl mb-4">
                    {section.title}
                  </h2>

                  {section.paragraphs?.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-sans text-text-secondary leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="space-y-3 mt-2">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="font-sans text-text-secondary leading-relaxed border-l-[3px] border-gold-500 pl-4"
                        >
                          {item.term && (
                            <span className="font-semibold text-navy-700">
                              {item.term}:{" "}
                            </span>
                          )}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </Section>
    </div>
  )
}
