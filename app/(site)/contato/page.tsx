import type { Metadata } from "next"
import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import ContactForm from "@/components/features/contact/ContactForm"
import {
  CHURCH_EMAIL,
  CHURCH_ADDRESS,
  CHURCH_ADDRESS_FULL,
  MORNING_LITURGY_TIME,
  AFTERNOON_LITURGY_TIME,
  WEEKLY_STUDY_TIME,
} from "@/const"
import { whatsappLink } from "@/utils/whatsapp"
import { mapsEmbedUrl, mapsDirectionsUrl } from "@/utils/maps"

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Igreja Reformada de Brasília — e-mail, WhatsApp e horários de culto.",
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen">
      <Masthead
        fullHeight={false}
        eyebrow="Contato"
        title={
          <>
            Entre em
            <br />
            <em className="text-gold-400">Contato.</em>
          </>
        }
        subtitle="Visitantes são bem-vindos em todos os cultos. Escreva-nos ou venha nos encontrar."
      />

      {/* Vias de contato — sempre disponíveis, sem depender do formulário */}
      <Section bg="surface">
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatedContent>
            <div className="border border-border-subtle border-l-[3px] border-l-gold-500 p-8 h-full">
              <p
                className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-4"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                E-mail
              </p>
              <a
                href={`mailto:${CHURCH_EMAIL}`}
                className="font-serif text-navy-700 text-xl hover:text-gold-500 transition-colors duration-500 break-all"
              >
                {CHURCH_EMAIL}
              </a>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="border border-border-subtle border-l-[3px] border-l-gold-500 p-8 h-full">
              <p
                className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-4"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                WhatsApp
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-navy-700 text-xl hover:text-gold-500 transition-colors duration-500"
              >
                Falar conosco →
              </a>
              <p className="font-sans text-text-secondary mt-3 text-sm">
                Resposta mais rápida, direto com o pastor.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent>
            <div className="border border-border-subtle border-l-[3px] border-l-gold-500 p-8 h-full">
              <p
                className="font-mono uppercase tracking-[0.1em] text-gold-500 mb-4"
                style={{ fontSize: "var(--text-size-xs)" }}
              >
                Cultos
              </p>
              <ul className="font-sans text-text-secondary space-y-2 text-sm">
                <li>
                  Domingos · {MORNING_LITURGY_TIME} e {AFTERNOON_LITURGY_TIME}
                </li>
                <li>Escola Dominical · 10h20</li>
                <li>Quintas · {WEEKLY_STUDY_TIME}</li>
              </ul>
              <p className="font-sans text-navy-700 mt-4 text-sm">
                {CHURCH_ADDRESS.district}, {CHURCH_ADDRESS.city} —{" "}
                {CHURCH_ADDRESS.state}
              </p>
            </div>
          </AnimatedContent>
        </div>
      </Section>

      {/* Onde estamos */}
      <Section bg="surface-alt" texture="linen">
        <AnimatedContent>
          <p className="section-tag mb-6">Onde estamos</p>
          <h2
            className="font-serif text-navy-700 mb-4"
            style={{ fontSize: "var(--text-size-3xl)" }}
          >
            Como chegar
          </h2>
          <p className="font-sans text-text-secondary mb-8">
            {CHURCH_ADDRESS_FULL}
          </p>
        </AnimatedContent>

        <AnimatedContent>
          <div className="border border-border-subtle">
            <iframe
              src={mapsEmbedUrl()}
              title={`Mapa — ${CHURCH_ADDRESS_FULL}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-[380px] md:h-[460px] block"
            />
          </div>
        </AnimatedContent>

        <AnimatedContent>
          <div className="mt-6">
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono uppercase tracking-[0.1em] px-6 py-3 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-700 transition-all duration-700"
              style={{ fontSize: "var(--text-size-xs)" }}
            >
              Traçar rota →
            </a>
          </div>
        </AnimatedContent>
      </Section>

      {/* Formulário — fica registrado e dispara notificação por e-mail */}
      <Section bg="surface">
        <div className="max-w-3xl mx-auto">
          <AnimatedContent>
            <p className="section-tag mb-6">Mensagem</p>
            <h2
              className="font-serif text-navy-700 mb-4"
              style={{ fontSize: "var(--text-size-3xl)" }}
            >
              Escreva para nós
            </h2>
            <p className="font-sans text-text-secondary mb-10">
              Dúvidas sobre a fé reformada, pedidos de oração ou uma primeira
              visita — respondemos a todas as mensagens.
            </p>
          </AnimatedContent>

          <AnimatedContent>
            <ContactForm />
          </AnimatedContent>
        </div>
      </Section>
    </div>
  )
}
