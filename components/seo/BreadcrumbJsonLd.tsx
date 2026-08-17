import { SITE_URL } from "@/utils/siteUrl"

type Crumb = { name: string; path: string }

/**
 * Dados estruturados schema.org BreadcrumbList — trilha hierárquica invisível.
 * Gera rich result de breadcrumb no Google e ajuda os motores (e IAs) a
 * entenderem onde a página se encaixa na estrutura do site. Não renderiza UI:
 * o design institucional já tem o BackBar contextual para navegação visível.
 */
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
