import { FAQ_ITEMS } from "@/const"

/**
 * Dados estruturados schema.org FAQPage a partir de FAQ_ITEMS (fonte única).
 * Duplo ganho: elegível a rich result de FAQ no Google e é o formato que os
 * motores de IA (ChatGPT, Perplexity, AI Overviews) mais citam. As respostas
 * são texto puro, então serializar direto é seguro.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export default function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  )
}
