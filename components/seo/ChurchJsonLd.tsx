import {
  CHURCH_NAME,
  CHURCH_ADDRESS,
  CHURCH_COORDS,
  CHURCH_WHATSAPP,
  CHURCH_COUNSEL,
  // CHURCH_COORDS removido do schema: a coordenada precisa ser o pino real do
  // templo (não o centro do viewport de uma URL do Maps). Ver ⚠️ geo abaixo.
  MORNING_LITURGY_TIME,
  AFTERNOON_LITURGY_TIME,
  WEEKLY_STUDY_TIME,
} from "@/const"
import { SITE_URL } from "@/utils/siteUrl"

// "09h00" -> "09:00" (formato de hora que o schema.org espera).
const hhmm = (t: string) => t.replace("h", ":")

/**
 * Dados estruturados schema.org do tipo Church (subtipo de LocalBusiness).
 * Fonte única: tudo vem do const/index.ts, então endereço/telefone/horários
 * ficam coerentes com o resto do site e com o Google Business Profile (o NAP
 * precisa bater byte a byte). Campos ainda sem dado confirmado ficam comentados.
 */
const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "@id": `${SITE_URL}/#church`,

  name: CHURCH_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-navy.svg`,
  image: `${SITE_URL}/galery/1/20260312_185811.jpg`,
  description:
    "Uma congregação fundada na Palavra, formada pela confissão histórica e comprometida com a adoração bíblica em Brasília.",
  slogan: "Soli Deo Gloria",
  foundingDate: "2015",
  knowsLanguage: "pt-BR",
  telephone: `+${CHURCH_WHATSAPP}`,

  areaServed: {
    "@type": "City",
    name: "Brasília",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Distrito Federal",
    },
  },

  address: {
    "@type": "PostalAddress",
    streetAddress: CHURCH_ADDRESS.street,
    addressLocality: CHURCH_ADDRESS.district,
    addressRegion: CHURCH_ADDRESS.state,
    postalCode: CHURCH_ADDRESS.zip,
    addressCountry: "BR",
  },

  // ⚠️ geo: coordenadas exatas do templo pendentes. Pegar o PINO real no Google
  // Maps (botão direito no local → copiar coordenadas), não o centro do viewport
  // da URL, ou obter via Google Business Profile.

  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: `+${CHURCH_WHATSAPP}`,
    availableLanguage: "Portuguese",
  },

  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: hhmm(MORNING_LITURGY_TIME),
      name: "Culto Matutino",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:20",
      name: "Escola Dominical",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: hhmm(AFTERNOON_LITURGY_TIME),
      name: "Culto Vespertino",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: hhmm(WEEKLY_STUDY_TIME),
      name: "Estudo Bíblico",
    },
  ],

  // Liderança da igreja (conselho): sinal de E-E-A-T — quem ensina e governa.
  // Vem de CHURCH_COUNSEL (fonte única), o mesmo dado exibido em /sobre.
  employee: CHURCH_COUNSEL.map((person) => ({
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
  })),

  sameAs: [
    "https://www.youtube.com/@IgrejaReformadadeBras%C3%ADliaIRB",
    // ⚠️ Facebook — adicionar a URL real quando disponível.
    // ⚠️ Instagram — adicionar a URL real quando disponível.
  ],

  // ⚠️ Confirmar se a IRB é confederada à federação e a URL oficial dela.
  // parentOrganization: {
  //   "@type": "Organization",
  //   name: "Igrejas Reformadas do Brasil",
  //   url: "https://igrejasreformadasdobrasil.com",
  // },

  // ⚠️ hasMap: opcional — URL de local nomeado no Google Maps (após cadastrar
  // no Google Business Profile).
}

export default function ChurchJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Objeto próprio, sem entrada de usuário: seguro serializar direto.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
    />
  )
}
