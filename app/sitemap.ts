import type { MetadataRoute } from "next"
import { SITE_URL } from "@/utils/siteUrl"
import { website_config_variables } from "@/config"

type Route = {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}

// Sempre no ar e linkadas na navegação.
const staticRoutes: Route[] = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/sobre", priority: 0.8, changeFrequency: "yearly" },
  { path: "/confissoes", priority: 0.8, changeFrequency: "yearly" },
  { path: "/confissao-belga", priority: 0.8, changeFrequency: "yearly" },
  { path: "/catecismo", priority: 0.8, changeFrequency: "yearly" },
  { path: "/canones-de-dort", priority: 0.8, changeFrequency: "yearly" },
  { path: "/doutrina", priority: 0.7, changeFrequency: "yearly" },
  { path: "/perguntas-frequentes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ministerios", priority: 0.6, changeFrequency: "yearly" },
  { path: "/galeria", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contato", priority: 0.6, changeFrequency: "yearly" },
  { path: "/politica-de-privacidade", priority: 0.3, changeFrequency: "yearly" },
]

// Só entram no sitemap quando a feature flag correspondente está ativa, para
// não pedir ao Google que indexe páginas ainda escondidas/incompletas.
const flaggedRoutes: (Route & { active: boolean })[] = [
  {
    path: "/agenda",
    priority: 0.7,
    changeFrequency: "weekly",
    active: website_config_variables.agenda.active,
  },
  {
    path: "/media",
    priority: 0.6,
    changeFrequency: "weekly",
    active: website_config_variables.media.active,
  },
  {
    path: "/blog",
    priority: 0.6,
    changeFrequency: "weekly",
    active: website_config_variables.blog.active,
  },
  {
    path: "/biblioteca",
    priority: 0.5,
    changeFrequency: "monthly",
    active: website_config_variables.library.active,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: Route[] = [
    ...staticRoutes,
    ...flaggedRoutes.filter((r) => r.active),
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
