import Masthead from "@/components/layout/Masthead"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { IRBButton } from "@/components/layout/Cards"
import {
  CHURCH_COUNSEL,
  CHURCH_EMAIL,
  CHURCH_ADDRESS_FULL,
  CHURCH_HISTORY_TIMELINE,
} from "@/const"

export default function SobrePage() {
  return (
    <>
      <div className="min-h-screen">
        <Masthead
          fullHeight={false}
          eyebrow="Sobre a Igreja"
          title={
            <>
              Conheça a<br />
              <em className="text-gold-400">Igreja Reformada.</em>
            </>
          }
          subtitle="Uma congregação fundada na Palavra, formada pela confissão histórica e comprometida com a adoração regulada em Brasília."
        >
          <div className="flex items-center justify-center gap-6 mt-8">
            <span
              className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
              style={{ fontSize: "9px" }}
            >
              IRB
            </span>
            <span
              className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
              style={{ fontSize: "9px" }}
            >
              ·
            </span>
            <span
              className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
              style={{ fontSize: "9px" }}
            >
              Brasília, DF
            </span>
            <span
              className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
              style={{ fontSize: "9px" }}
            >
              ·
            </span>
            <span
              className="font-mono uppercase tracking-[0.1em] text-primary-foreground/40"
              style={{ fontSize: "9px" }}
            >
              Est. 2015
            </span>
          </div>
        </Masthead>

        {/* Nossa História */}
        <Section bg="surface-alt" texture="linen">
          <div className="grid md:grid-cols-2 gap-16">
            <AnimatedContent>
              <p className="section-tag mb-6">Nossa História</p>
              <h2
                className="font-serif text-navy-700 mb-6"
                style={{ fontSize: "var(--text-size-3xl)" }}
              >
                Raízes na
                <br />
                <em className="text-gold-500">Reforma</em>
              </h2>
              <div className="space-y-4 font-sans text-muted-foreground leading-relaxed">
                <p>
                  A Igreja Reformada de Brasília nasceu do desejo de um grupo de
                  crentes por uma adoração que honre a Deus segundo os
                  princípios bíblicos, fundamentada nas confissões históricas da
                  Reforma.
                </p>
                <p>
                  Desde a sua fundação em 2015, a congregação tem se dedicado à
                  pregação expositiva das Escrituras, ao ensino catequético e à
                  prática da piedade reformada na capital federal.
                </p>
                <p>
                  Filiada a uma federação de igrejas reformadas, mantemos a
                  tradição confessional que remonta aos séculos XVI e XVII,
                  aplicando-a com fidelidade ao contexto brasileiro.
                </p>
              </div>
              <div className="callout-scripture mt-6">
                <p>
                  &ldquo;Pois para vós outros é a promessa, para vossos filhos e
                  para todos os que ainda estão longe, isto é, para quantos o
                  Senhor, nosso Deus, chamar.&rdquo;
                </p>
                <p
                  className="font-mono text-gold-600 mt-2"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  Atos 2:38 · ARA
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent>
              <div className="space-y-0">
                {CHURCH_HISTORY_TIMELINE.map((item) => (
                  <div
                    key={item.year}
                    className="flex items-start gap-6 py-6 border-b border-border"
                  >
                    <span className="font-serif text-gold-500 text-2xl font-semibold min-w-[60px]">
                      {item.year}
                    </span>
                    <div>
                      <h4
                        className="font-serif text-navy-700 font-semibold"
                        style={{ fontSize: "var(--text-size-lg)" }}
                      >
                        {item.title}
                      </h4>
                      <p className="font-sans text-muted-foreground text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedContent>
          </div>
        </Section>

        {/* Liderança */}
        <Section bg="surface">
          <AnimatedContent>
            <p className="section-tag mb-6">Liderança</p>
            <h2
              className="font-serif text-navy-700 mb-12"
              style={{ fontSize: "var(--text-size-3xl)" }}
            >
              Liderança
              <br />
              <em className="text-gold-500">& Ministério</em>
            </h2>
          </AnimatedContent>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {CHURCH_COUNSEL.map((leader) => (
              <AnimatedContent key={leader.name}>
                <div className="text-center">
                  <div
                    className="w-20 h-20 bg-navy-700 border-2 border-gold-500 mx-auto flex items-center justify-center mb-4"
                    style={{ borderRadius: "50%" }}
                  >
                    <span className="font-mono text-primary-foreground font-bold">
                      {leader.initials}
                    </span>
                  </div>
                  <h4
                    className="font-serif text-navy-700 font-semibold"
                    style={{ fontSize: "var(--text-size-lg)" }}
                  >
                    {leader.name}
                  </h4>
                  <p
                    className="font-mono uppercase tracking-[0.1em] text-muted-foreground mt-1"
                    style={{ fontSize: "var(--text-size-xs)" }}
                  >
                    {leader.role}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </Section>

        {/* Tornar-se Membro */}
        <Section bg="surface-alt">
          <AnimatedContent>
            <p className="section-tag mb-6">Membresia</p>
            <h2
              className="font-serif text-navy-700 mb-12"
              style={{ fontSize: "var(--text-size-3xl)" }}
            >
              Tornar-se
              <br />
              <em className="text-gold-500">Membro</em>
            </h2>
          </AnimatedContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Catequese",
                desc: "Estudo das confissões reformadas e princípios bíblicos fundamentais.",
              },
              {
                step: "02",
                title: "Entrevista",
                desc: "Conversa com o conselho da igreja sobre sua jornada de fé.",
              },
              {
                step: "03",
                title: "Profissão Pública",
                desc: "Confissão pública da fé diante da congregação.",
              },
            ].map((s) => (
              <AnimatedContent key={s.step}>
                <div className="border border-border border-t-[3px] border-t-gold-500 p-6 bg-surface">
                  <span className="font-mono text-gold-500 text-2xl font-bold">
                    {s.step}
                  </span>
                  <h4
                    className="font-serif text-navy-700 font-semibold mt-3"
                    style={{ fontSize: "var(--text-size-lg)" }}
                  >
                    {s.title}
                  </h4>
                  <p className="font-sans text-muted-foreground text-sm mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
          <AnimatedContent className="mt-8 text-center">
            <p className="font-sans text-muted-foreground mb-4">
              Interessado em conhecer a IRB?
            </p>
            <IRBButton variant="primary" href="/contato">
              Entrar em Contato →
            </IRBButton>
          </AnimatedContent>
        </Section>

        {/* Contato CTA */}
        <Section bg="inverse" texture="hatch" className="!bg-navy-900">
          <div className="text-center max-w-xl mx-auto">
            <AnimatedContent>
              <p className="section-tag justify-center mb-6">Contato</p>
              <h2
                className="font-serif text-primary-foreground mb-8"
                style={{ fontSize: "var(--text-size-3xl)" }}
              >
                Entre em
                <br />
                <em className="text-gold-400">Contato</em>
              </h2>
              <div className="space-y-4 text-center">
                <p
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {CHURCH_EMAIL}
                </p>
                <p
                  className="font-mono uppercase tracking-[0.1em] text-primary-foreground/60"
                  style={{ fontSize: "var(--text-size-xs)" }}
                >
                  {CHURCH_ADDRESS_FULL}
                </p>
              </div>
            </AnimatedContent>
          </div>
        </Section>
      </div>
    </>
  )
}
