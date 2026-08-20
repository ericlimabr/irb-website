"use client"

import { ExternalLink } from "lucide-react"
import Section, { AnimatedContent } from "@/components/layout/Section"
import { VerticalCard } from "@/components/layout/Cards"
import ShareButton from "@/components/ui/ShareButton"
import { CHURCH_SITE_URL } from "@/const"

const ARTICLE_URL = `${CHURCH_SITE_URL}/blog/o-que-e-uma-igreja-reformada`

/**
 * Blocos de conteúdo suportados pelo corpo do artigo (renderer abaixo). Este
 * post é o TEMPLATE para novos posts — ver docs/blog-posts.md.
 *  - lead: parágrafo de abertura (serif, maior)
 *  - heading: subtítulo de seção
 *  - paragraph: parágrafo corrido
 *  - scripture: citação bíblica (usa `reference`)
 *  - pullquote: destaque (usa `attribution` opcional)
 */
type ArticleBlock = {
  type: "lead" | "heading" | "paragraph" | "scripture" | "pullquote"
  content: string
  reference?: string
  attribution?: string
}

/**
 * Post recuperado do site antigo (Wix) via Wayback Machine.
 * Autor: Rev. Kenneth Wieske (missionário das Igrejas Reformadas do Canadá no
 * Brasil). Publicado por Weliton de Eça em 19/09/2019 no site antigo.
 * Ver docs/recovered/o-que-e-uma-igreja-reformada.md (proveniência).
 * A URL antiga /post/o-que-é-uma-igreja-reformada tem 301 aqui (next.config.ts).
 */
const article = {
  category: "História da Igreja",
  title: "O que é uma igreja reformada?",
  author: "Rev. Kenneth Wieske",
  initials: "KW",
  publisher: "Weliton de Eça",
  publisherInitials: "WE",
  date: "19 setembro 2019",
  readTime: "5 min de leitura",
  body: [
    {
      type: "lead",
      content:
        "As Igrejas Reformadas têm um ensino, um padrão de culto, um governo, e um estilo de vida, baseados na Bíblia, refletindo os cinco principais lemas da Reforma Protestante: Somente a fé, somente a graça, somente a Escritura, somente Cristo e glória somente a Deus. Essa é a nossa história.",
    },
    {
      type: "heading",
      content: "1517 · A Grande Reforma Protestante",
    },
    {
      type: "paragraph",
      content:
        "Nos quase 1500 anos entre a Igreja Primitiva e a Reforma Protestante, a Igreja estava se desviando mais e mais da pureza da doutrina e da adoração que a Bíblia ensina. A Igreja através dos séculos estava afundando mais e mais na superstição da igreja Romana. Mas Deus sempre manteve um remanescente fiel que conhecia o verdadeiro evangelho: que Deus salva pecadores por pura graça, não por obras.",
    },
    {
      type: "paragraph",
      content:
        "Na grande Reforma Protestante, Deus usou homens como Martinho Lutero e João Calvino para reformar a Igreja. O intuito dos reformadores, em especial João Calvino e seus sucessores, nunca foi estabelecer uma nova Igreja. Eles entenderam que estavam reformando a única Igreja de Cristo e trazendo-a de volta à doutrina e às práticas das Escrituras.",
    },
    {
      type: "paragraph",
      content:
        "As Igrejas Reformadas do Brasil são ligadas pela historia e pela confissão de fé apostólica com todas as igrejas fiéis que voltaram à pura doutrina e à verdadeira adoração bíblica na Grande Reforma. A Grande Reforma redescobriu a ligação bíblica com a igreja primitiva apostólica, e assim as Igrejas Reformadas têm uma linhagem que vai até os tempos apostólicos.",
    },
    {
      type: "heading",
      content:
        "1555 a 1558 · As Igrejas Reformadas no Brasil: a primeira igreja evangélica do país",
    },
    {
      type: "paragraph",
      content:
        "Em 1555, iniciou-se a colônia francesa na Baía de Guanabara, onde hoje se encontra a cidade do Rio de Janeiro. Em 1557, chegou um grupo de cristãos reformados, junto com vários pastores mandados pelo reformador João Calvino. Assim os primeiros cultos evangélicos no país foram celebrados no Rio de Janeiro por uma Igreja Reformada francesa.",
    },
    {
      type: "heading",
      content:
        "1558 · A Igreja Reformada da Baía de Guanabara: os primeiros mártires brasileiros",
    },
    {
      type: "paragraph",
      content:
        "Infelizmente os reformadores foram traídos e perseguidos pelos romanistas franceses, assim a Igreja Reformada foi dizimada. Os primeiros mártires brasileiros pelo evangelho do Senhor Jesus Cristo foram membros da Igreja Reformada. Antes de morrerem, eles escreveram a confissão de Guanabara – A primeira confissão de fé do novo mundo.",
    },
    {
      type: "heading",
      content:
        "1630 a 1654 · As Igrejas Reformadas do Nordeste: a primeira igreja missionária do país",
    },
    {
      type: "paragraph",
      content:
        "Muitos conhecem o nome Mauricio de Nassau, que governou o Brasil holandês com uma tolerância e sabedoria muito adiantada para sua época. Poucos sabem que o Conde Nassau fazia parte da família real da Holanda. A família Nassau estava sob juramento de defender a fé reformada e promover a tolerância religiosa e liberdade de consciência.",
    },
    {
      type: "paragraph",
      content:
        "Durante anos que Pernambuco e uma grande parte do Nordeste ficaram debaixo do governo holandês, as Igrejas Reformadas embarcaram num projeto missionário impressionante. Dezenas de pastores e missionários pregaram a fé reformada em vários idiomas: inglês, francês, espanhol, holandês, português, e até em Tupi (língua indígenas).",
    },
    {
      type: "paragraph",
      content:
        "O catecismo de Heidelberg, que ensina o caminho da salvação, foi traduzido em tupi. Muitas aldeias conheceram a graça de Deus em Jesus Cristo, e muitos indígenas se converteram ao Senhor. Você já ouviu falar do famoso índio Poty? Ele foi membro da Igreja Reformada.",
    },
    {
      type: "heading",
      content:
        "Séculos XVII e XVIII · As Igrejas Reformadas e a tradução da Bíblia em português",
    },
    {
      type: "paragraph",
      content:
        "Convido você a abrir sua Bíblia nas primeiras páginas. A grande maioria das Bíblias usadas no Brasil faz uso da tradução de um tal de «João Ferreira de Almeida». Quem foi este homem? Ele foi um dos primeiros portugueses a abraçar publicamente a fé reformada em 1642. Mais tarde ele se tornou um pastor das Igrejas Reformadas numa região da Ásia onde se fala português, e iniciou o trabalho de traduzir a Bíblia para a língua portuguesa. A obra que se iniciou foi completada por outros pastores reformados no séc. XVIII.",
    },
    {
      type: "heading",
      content:
        "Século XIX · A segunda vinda da Igreja evangélica para o Brasil",
    },
    {
      type: "paragraph",
      content:
        "No séc. XIX, depois de muitos séculos, a igreja voltou para o Brasil. Foram os presbiterianos e congregacionais que trouxeram a pregação reformada ao Brasil: Deus salva pecadores por pura graça não por obras. É importante observar que as igrejas presbiterianas e congregacionais originalmente foram herdeiras da Grande Reforma Protestante por meio de Genebra, que é o berço das Igrejas Reformadas.",
    },
    {
      type: "paragraph",
      content:
        "As igrejas da reforma no continente da Europa costumam chamar-se «Igrejas Reformadas», enquanto que as igrejas da Grã Bretanha (Inglaterra, Escócia e Irlanda) e dos Estados Unidos costumavam chamar-se de «presbiterianas» ou «congregacionais».",
    },
    {
      type: "heading",
      content: "Séculos XX e XXI · As Igrejas Reformadas no Brasil",
    },
    {
      type: "paragraph",
      content:
        "No decorrer do séc. XX, várias Igrejas reformadas foram estabelecidas no Brasil por imigrantes vindo da Holanda. No ano de 1970 as Igrejas Reformadas do Canadá iniciaram trabalhos missionários em pequenas aldeias de pescadores entre Recife e Maceió. Na mesma época, as Igrejas Reformadas holandesas iniciaram uma obra missionária no estado do Paraná. Hoje existem Igrejas Reformadas oriundas da Reforma Protestante continental em muitos estados e cidades do Brasil (Pernambuco, Paraíba, Ceará, Alagoas, Rio de Janeiro, Minas Gerais, São Paulo e Distrito Federal).",
    },
    {
      type: "heading",
      content: "Qual a sua conclusão?",
    },
    {
      type: "paragraph",
      content:
        "As Igrejas Reformadas vêm da Grande Reforma Protestante do séc XVI, e através desta reforma têm uma ligação com a igreja primitiva apostólica. O primeiro culto evangélico no Brasil foi feito pela Igreja Reformada, já no séc. XVI. Os primeiros mártires brasileiros foram membros da Igreja Reformada. A primeira confissão do novo mundo foi escrita e desenvolvida por membros da Igreja Reformada. A tradução da Bíblia em Português foi por um pastor reformado.",
    },
    {
      type: "heading",
      content: "Qual é a nossa mensagem?",
    },
    {
      type: "paragraph",
      content:
        "A nossa mensagem é o que a Bíblia diz! Nada mais, nada menos. O apóstolo Paulo diz em Rm. 3:23 que «Todos pecaram e carecem da glória de Deus». Essa realidade não é para alguns mas para todas as pessoas. É por isto que, como igreja de Cristo, anunciamos o evangelho, as boas novas, a todos. A má notícia para o mundo é que sem Deus não há salvação. O pecado afetou nossa alma, o nosso coração, e por isso, padecemos junto com toda a criação. Não há como negarmos isso! Mas a boa notícia do evangelho é que Deus enviou o seu Filho, Filho Unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna. Num mundo sem Deus é só caos. O homem por si só nunca alcançará paz e esperança, nem muito menos conseguirá reverter o que o pecado causou na humanidade. Mas, em Cristo, e somente nele, poderemos ter o completo e eterno perdão de Deus e a reconciliação não só com Ele mas também com todas as coisas. Assim somente através de Cristo podemos ter paz, esperança e amor. Essa é a nossa mensagem a você.",
    },
    {
      type: "heading",
      content: "Quem nós somos?",
    },
    {
      type: "paragraph",
      content:
        "Somos a Igreja Reformada de Brasília. Fazemos parte da confederação das Igrejas Reformadas do Brasil (IRB), que são fruto do trabalho missionário da década de 70. Nós confessamos, junto com todas as IRB, os três credos ecumênicos: Credo Apostólico, Credo Niceno e Credo Atanasiano e as Três Formas de Unidade: a Confissão Belga, o Catecismo de Heidelberg e os Cânones de Dort. Nós cremos que a Bíblia é a nossa única regra de fé e prática e confiamos no poder da pregação da Palavra. Acreditamos num culto simples centrado na Palavra de Deus e não em invenções humanas. Nós nos reunimos dominicalmente duas vezes para o culto a Deus com a leitura e pregação da Palavra, cânticos, oração, confissão de fé e administração dos sacramentos. Procuramos viver a comunhão dos santos e desejamos proclamar as verdades de Deus a todas as pessoas sem distinção.",
    },
    {
      type: "heading",
      content: "Conte conosco!",
    },
    {
      type: "paragraph",
      content:
        "Estamos à sua disposição para ler e ensinar a Palavra de Deus a você. Por isso, não hesite em entrar em contato conosco se você deseja conhecer mais das doutrinas bíblicas e do texto bíblico sagrado.",
    },
  ],
}

// Relacionados: páginas REAIS do site (as Três Formas de Unidade citadas no
// texto), não posts fictícios.
const relatedPosts = [
  {
    category: "Confissão",
    title: "Confissão Belga",
    excerpt:
      "A confissão de fé escrita por Guido de Brès, uma das Três Formas de Unidade.",
    meta: "Três Formas de Unidade",
    href: "/confissao-belga",
  },
  {
    category: "Catecismo",
    title: "Catecismo de Heidelberg",
    excerpt:
      "O caminho da salvação em perguntas e respostas — o mesmo traduzido em tupi no séc. XVII.",
    meta: "Três Formas de Unidade",
    href: "/catecismo",
  },
  {
    category: "Doutrina",
    title: "Cânones de Dort",
    excerpt:
      "A resposta confessional do Sínodo de Dort sobre a graça soberana de Deus.",
    meta: "Três Formas de Unidade",
    href: "/canones-de-dort",
  },
]

export default function BlogPostPage() {
  return (
    <div className="min-h-screen">
      {/* Article Masthead */}
      <section className="bg-navy-900 texture-grid pt-32 pb-20 relative overflow-hidden">
        {/* Capa: fusão de três fotos da congregação (galeria), gerada em
            public/blog/. Ver docs/recovered para a proveniência do post. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/blog/o-que-e-uma-igreja-reformada-cover.webp)",
          }}
        />
        {/* Véu navy: mantém o título branco legível sobre a foto */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,13,26,0.74), rgba(0,13,26,0.5) 45%, rgba(0,13,26,0.88))",
          }}
        />
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
              <span className="mono-label-sm text-gold-400">
                {article.category}
              </span>
              <span className="text-primary-foreground/30">·</span>
              <span className="font-mono text-primary-foreground/40 text-2xs">
                {article.date}
              </span>
              <span className="text-primary-foreground/30">·</span>
              <span className="font-mono text-primary-foreground/40 text-2xs">
                {article.readTime}
              </span>
              <ShareButton
                url={ARTICLE_URL}
                title="O que é uma igreja reformada?"
                text="A história das Igrejas Reformadas no Brasil, da Reforma aos dias de hoje."
                className="ml-auto inline-flex items-center gap-2 font-mono uppercase tracking-[0.1em] text-gold-400 hover:text-gold-500 transition-colors duration-500 text-2xs"
              />
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
                <p className="font-mono uppercase tracking-[0.1em] text-primary-foreground/50 text-2xs">
                  Autor
                </p>
              </div>
              <div className="flex items-center gap-3 pl-4 border-l border-primary-foreground/15">
                <div className="w-10 h-10 bg-navy-700 border-2 border-gold-500 flex items-center justify-center">
                  <span className="font-mono text-primary-foreground text-xs font-bold">
                    {article.publisherInitials}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-primary-foreground/80 text-sm">
                    {article.publisher}
                  </p>
                  <p className="font-mono uppercase tracking-[0.1em] text-primary-foreground/50 text-2xs">
                    Publicado por
                  </p>
                </div>
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
          {(article.body as ArticleBlock[]).map((block, i) => {
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
                    {block.reference && (
                      <cite className="font-mono uppercase tracking-[0.1em] text-gold-600 not-italic text-2xs">
                        {block.reference}
                      </cite>
                    )}
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
                      <cite className="block font-mono uppercase tracking-[0.1em] text-gold-600 not-italic mt-4 text-2xs">
                        {block.attribution}
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
              <p className="font-mono uppercase tracking-[0.1em] text-gold-600 mb-3 text-2xs">
                Missionário no Brasil · Igrejas Reformadas do Canadá
              </p>
              <p
                className="font-sans text-muted-foreground leading-relaxed"
                style={{ fontSize: "var(--text-size-sm)" }}
              >
                Pastor das Igrejas Reformadas do Canadá, serviu por quase duas
                décadas como missionário no Nordeste do Brasil e ajudou a formar
                as Igrejas Reformadas do Brasil (IRB).
              </p>
              <a
                href="https://todaescritura.org/kenneth-wieske-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 font-mono uppercase tracking-[0.1em] text-gold-600 hover:text-gold-500 transition-colors duration-500 text-2xs"
              >
                Outros textos do autor
                <ExternalLink size={12} aria-hidden />
              </a>
            </div>
          </div>

          {/* Publicado por — crédito de quem disponibilizou o texto */}
          <div className="mt-4 flex items-center gap-4 bg-surface-alt border border-border p-6">
            <div className="w-12 h-12 bg-navy-700 border-2 border-gold-500 flex items-center justify-center shrink-0">
              <span className="font-mono text-primary-foreground text-sm font-bold">
                {article.publisherInitials}
              </span>
            </div>
            <div>
              <p
                className="font-serif text-navy-700 font-semibold"
                style={{ fontSize: "var(--text-size-base)" }}
              >
                {article.publisher}
              </p>
              <p className="font-mono uppercase tracking-[0.1em] text-gold-600 text-2xs">
                Publicou este texto no site da igreja · 19 de setembro de 2019
              </p>
            </div>
          </div>

          {/* Compartilhar */}
          <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono uppercase tracking-[0.1em] text-muted-foreground text-2xs">
              Compartilhe este artigo
            </span>
            <ShareButton
              url={ARTICLE_URL}
              title="O que é uma igreja reformada?"
              text="A história das Igrejas Reformadas no Brasil, da Reforma aos dias de hoje."
              className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.1em] text-gold-600 hover:text-gold-500 transition-colors duration-500 text-2xs"
            />
          </div>
        </article>
      </Section>

      {/* Related Articles */}
      <Section bg="surface-alt">
        <AnimatedContent>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-gold-500" />
            <span className="font-mono uppercase tracking-[0.35em] text-gold-500 text-2xs">
              Para Continuar
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <VerticalCard
                key={post.title}
                eyebrow={post.category}
                title={post.title}
                description={post.excerpt}
                meta={post.meta}
                href={post.href}
                linkText="Abrir →"
              />
            ))}
          </div>
        </AnimatedContent>
      </Section>
    </div>
  )
}
