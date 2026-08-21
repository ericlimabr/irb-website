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
      // Post que tinha tração no site antigo (Wix), recuperado via Wayback e
      // republicado em /blog. A URL real do Wix usava "é" acentuado, mas o
      // path-to-regexp do Next NÃO casa o caractere acentuado numa `source`
      // literal (retorna 404). Um parâmetro curinga nessa posição casa tanto
      // "é" quanto "e" — e qualquer codificação (%C3%A9) — sempre para o mesmo
      // destino fixo. Cobre as duas variantes que possam estar indexadas.
      {
        source: "/post/o-que-:conector-uma-igreja-reformada",
        destination: "/blog/o-que-e-uma-igreja-reformada",
        permanent: true,
      },
      // Demais posts/páginas do Wix ainda indexados pelo Google (levantados via
      // `site:irbrasilia.org`) que hoje dão 404. Não há conteúdo original nosso
      // a recuperar (são reposts de terceiros / série de pregações), então cada
      // um vai para o equivalente TEMÁTICO mais próximo do site novo, o que
      // preserva o link equity e evita soft-404. `permanent: true` = 301.

      // Página de pregações (série de exposição do Catecismo de Heidelberg).
      {
        source: "/pregacoes",
        destination: "/catecismo",
        permanent: true,
      },
      // Salmo 1 (saltério genebrino) → hub de doutrina.
      {
        source: "/post/salmos-salmo-1-cbs-genebrino",
        destination: "/doutrina",
        permanent: true,
      },
      // "Jesus é o único caminho?" (Greg Koukl). Dois caracteres acentuados
      // ("é", "ú") que o path-to-regexp não casa em `source` literal; um
      // parâmetro com regex `([^-]+)` em cada posição casa o segmento acentuado
      // (e qualquer codificação) até o próximo hífen.
      {
        source: "/post/jesus-:a([^-]+)-o-:b([^-]+)-caminho-greg-koukl",
        destination: "/doutrina",
        permanent: true,
      },
      // "Deus mudou o dia do culto, o dia do Senhor" (Greg Price).
      {
        source: "/post/breve-resumo-do-shabbat-do-primeiro-dia-greg-price",
        destination: "/doutrina",
        permanent: true,
      },
      // "Refutando o Relativismo" (Matt Slick).
      {
        source: "/post/refutando-o-relativismo-matt-slick",
        destination: "/doutrina",
        permanent: true,
      },
      // TEMPORÁRIO (307): a listagem /blog ainda é 100% mockup (posts/autores
      // fictícios). Enquanto ela não for conteúdo real, quem entrar em /blog
      // direto é levado ao único artigo real. `permanent: false` = 307, para
      // NÃO ficar cacheado pelos navegadores/Google. Remover quando o /blog
      // virar seção de verdade (flag blog.active + posts reais).
      {
        source: "/blog",
        destination: "/blog/o-que-e-uma-igreja-reformada",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
