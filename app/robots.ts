import type { MetadataRoute } from "next"
import { CHURCH_SITE_URL } from "@/const"

// Mesma resolução de base do metadataBase em app/layout.tsx: override explícito,
// depois o domínio de produção da Vercel, por fim o domínio da igreja.
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : CHURCH_SITE_URL)

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Área administrativa e login não devem ser indexados.
      disallow: ["/admin", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
