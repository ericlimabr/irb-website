import { SITE_URL } from "@/utils/siteUrl"
import { CHURCH_NAME } from "@/const"

/**
 * Dados estruturados schema.org WebSite — identidade do site como entidade,
 * publicada pela igreja (referência ao @id do nó Church em ChurchJsonLd). Ajuda
 * o Google a entender site e organização como uma coisa só. Sem SearchAction:
 * o site não tem busca interna.
 */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: CHURCH_NAME,
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE_URL}/#church` },
}

export default function WebSiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
    />
  )
}
