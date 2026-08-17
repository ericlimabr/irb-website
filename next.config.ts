import type { NextConfig } from "next"

/**
 * Redirects 301 das URLs do site ANTIGO (Wix) que o Google ainda tem indexadas
 * e que hoje retornam 404 no site novo. Apontar cada uma para o equivalente mais
 * próximo preserva o valor de SEO dos backlinks e conserta a experiência de quem
 * chega pela busca com o índice desatualizado.
 *
 * Como completar esta lista: no Search Console → "Páginas", ou via
 * `site:irbrasilia.org` no Google, levante as URLs antigas ainda indexadas e
 * adicione uma entrada aqui para cada uma. `permanent: true` = 301.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Post que tinha tração no site antigo. Alvo provisório: /sobre.
      // Quando o conteúdo for republicado (ex.: em /blog), trocar o destino.
      {
        source: "/post/o-que-e-uma-igreja-reformada",
        destination: "/sobre",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
