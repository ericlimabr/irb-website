import type { MetadataRoute } from "next"
import { SITE_URL } from "@/utils/siteUrl"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Área administrativa e login não devem ser indexados.
      disallow: ["/admin", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
