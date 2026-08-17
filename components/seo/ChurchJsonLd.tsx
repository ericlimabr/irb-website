import {
  CHURCH_NAME,
  CHURCH_SITE_URL,
  CHURCH_ADDRESS,
  CHURCH_COORDS,
  CHURCH_WHATSAPP,
  MORNING_LITURGY_TIME,
  AFTERNOON_LITURGY_TIME,
  WEEKLY_STUDY_TIME,
} from "@/const"

// "09h00" -> "09:00" (formato de hora que o schema.org espera).
const hhmm = (t: string) => t.replace("h", ":")

const [latitude, longitude] = CHURCH_COORDS.split(",")

/**
 * Dados estruturados schema.org do tipo Church (subtipo de LocalBusiness).
 * Fonte única: tudo vem do const/index.ts, então endereço/telefone/horários
 * ficam coerentes com o resto do site e com o Google Business Profile (o NAP
 * precisa bater byte a byte). Campos ainda sem dado confirmado ficam comentados.
 */
const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "@id": `${CHURCH_SITE_URL}/#church`,

  name: CHURCH_NAME,
  url: CHURCH_SITE_URL,
  logo: `${CHURCH_SITE_URL}/logo/logo-navy.svg`,
  image: `${CHURCH_SITE_URL}/galery/1/20260312_185811.jpg`,
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

  geo: {
    "@type": "GeoCoordinates",
    latitude,
    longitude,
  },

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
