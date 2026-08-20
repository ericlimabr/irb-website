import { CHURCH_NAME } from "@/const"
import { SITE_URL } from "@/utils/siteUrl"

type BlogPostingJsonLdProps = {
  headline: string
  description: string
  /** Caminho da página, ex.: /blog/slug */
  path: string
  /** Imagem de capa (caminho absoluto do site ou URL completa). */
  image: string
  imageWidth?: number
  imageHeight?: number
  /** Seção/categoria do artigo, ex.: "História da Igreja". */
  articleSection?: string
  /** Data ISO (YYYY-MM-DD), ex.: 2019-09-19. */
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl?: string
}

/**
 * Dados estruturados schema.org BlogPosting para um artigo do blog. Torna o post
 * elegível a rich results de artigo (autor, data, imagem) e ajuda motores/IA a
 * entenderem autoria e publicação. Publisher e logo vêm da mesma fonte do
 * ChurchJsonLd para manter o NAP coerente. Não renderiza UI.
 */
export default function BlogPostingJsonLd({
  headline,
  description,
  path,
  image,
  imageWidth = 1200,
  imageHeight = 630,
  articleSection,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
}: BlogPostingJsonLdProps) {
  const url = `${SITE_URL}${path}`
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: imageWidth,
      height: imageHeight,
    },
    inLanguage: "pt-BR",
    ...(articleSection ? { articleSection } : {}),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
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
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
