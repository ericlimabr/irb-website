import type { Metadata } from "next"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import FaqAccordion from "@/components/features/faq/FaqAccordion"
import FaqJsonLd from "@/components/seo/FaqJsonLd"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Perguntas frequentes sobre a Igreja Reformada de Brasília — o que é uma igreja reformada, as Três Formas de Unidade, horários de culto e como visitar.",
  alternates: { canonical: "/perguntas-frequentes" },
}

export default function PerguntasFrequentesPage() {
  return (
    <div className="min-h-screen">
      <FaqJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Perguntas Frequentes", path: "/perguntas-frequentes" },
        ]}
      />

      <Masthead
        fullHeight={false}
        eyebrow="Perguntas Frequentes"
        title={
          <>
            Perguntas
            <br />
            <em className="text-gold-400">Frequentes.</em>
          </>
        }
        subtitle="Dúvidas comuns sobre a fé reformada, os nossos cultos e como nos visitar."
      />

      <Section bg="surface">
        <AnimatedContent>
          <div className="mx-auto max-w-3xl">
            <FaqAccordion />
          </div>
        </AnimatedContent>
      </Section>
    </div>
  )
}
