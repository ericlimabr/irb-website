import type { MetadataRoute } from "next"
import { SITE_URL } from "@/utils/siteUrl"

// Bots de IA de busca/citação liberados de forma intencional: a igreja quer
// alcance, e ser rastreada por eles aumenta a chance de ser citada em ChatGPT,
// Perplexity, Claude, Google AI Overviews/Gemini etc. Passariam pela regra "*"
// de qualquer forma; explicitar torna a decisão deliberada e à prova de futuro.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "cohere-ai",
]

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/login"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Área administrativa e login não devem ser indexados.
        disallow,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
