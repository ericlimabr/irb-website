import { CHURCH_NAME } from "@/const"
import { SITE_URL } from "@/utils/siteUrl"

type Agent = {
  /** Person (padrão) para autores; Organization para corpos como um sínodo. */
  type?: "Person" | "Organization"
  name: string
  /** URL canônica da entidade (Wikipedia/Wikidata), quando existir. */
  sameAs?: string
}

type ArticleJsonLdProps = {
  headline: string
  description: string
  /** Caminho da página, ex.: /confissao-belga */
  path: string
  /** Seção temática, ex.: "Confissões Reformadas". */
  articleSection?: string
  /** Autores históricos do documento (nome, e sameAs quando houver). */
  author?: Agent[]
  /**
   * A obra histórica que a página apresenta. `sameAs` (Wikipedia/Wikidata) faz o
   * "entity linking" que ajuda buscadores e IAs a identificarem a fonte primária.
   */
  about?: {
    name: string
    /** Ano/ISO de publicação da OBRA (ex.: "1561"), não da página. */
    datePublished?: string
    sameAs?: string | string[]
  }
  /** Imagem (caminho do site ou URL completa), opcional. */
  image?: string
  /** Datas da PÁGINA (opcionais). As datas da obra vão em `about`. */
  datePublished?: string
  dateModified?: string
}

/**
 * Dados estruturados schema.org `Article` para as páginas de confissão (textos
 * históricos renderizados na íntegra). Diferente de `BlogPostingJsonLd`: o autor
 * é histórico (não um redator do site), a página não faz parte do blog, e o nó
 * `about` liga a fonte primária à sua entidade na Wikipedia. Publisher/logo vêm
 * da mesma fonte do ChurchJsonLd para manter o NAP coerente. Não renderiza UI.
 */
export default function ArticleJsonLd({
  headline,
  description,
  path,
  articleSection,
  author,
  about,
  image,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}${path}`
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    description,
    inLanguage: "pt-BR",
    ...(articleSection ? { articleSection } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(author && author.length
      ? {
          author: author.map((a) => ({
            "@type": a.type ?? "Person",
            name: a.name,
            ...(a.sameAs ? { sameAs: a.sameAs } : {}),
          })),
        }
      : {}),
    ...(about
      ? {
          about: {
            "@type": "CreativeWork",
            name: about.name,
            ...(about.datePublished
              ? { datePublished: about.datePublished }
              : {}),
            ...(about.sameAs ? { sameAs: about.sameAs } : {}),
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: CHURCH_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo/logo-navy.png`,
        width: 592,
        height: 512,
      },
    },
    isPartOf: { "@type": "CollectionPage", "@id": `${SITE_URL}/confissoes` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
