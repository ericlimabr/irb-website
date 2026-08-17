import { CHURCH_SITE_URL } from "@/const"

/**
 * Base absoluta do site — mesma resolução do metadataBase em app/layout.tsx:
 * override explícito, depois o domínio de produção da Vercel, por fim o domínio
 * da igreja. Fonte única para robots, sitemap e dados estruturados.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : CHURCH_SITE_URL)
