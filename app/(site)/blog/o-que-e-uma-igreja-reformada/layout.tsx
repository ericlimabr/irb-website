import type { Metadata } from "next"

/**
 * Este post — diferente do resto do /blog (mock, ainda escondido) — é conteúdo
 * real recuperado do site antigo e DEVE ser indexado: é o alvo do redirect 301
 * da URL antiga (/post/o-que-é-uma-igreja-reformada). Por isso sobrescrevemos o
 * `robots: { index:false }` herdado de blog/layout.tsx.
 */
export const metadata: Metadata = {
  title: "O que é uma igreja reformada?",
  description:
    "A história das Igrejas Reformadas no Brasil, da Grande Reforma Protestante do séc. XVI aos dias de hoje — e o que confessamos como Igreja Reformada de Brasília.",
  alternates: { canonical: "/blog/o-que-e-uma-igreja-reformada" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "O que é uma igreja reformada?",
    description:
      "A história das Igrejas Reformadas no Brasil, da Grande Reforma Protestante do séc. XVI aos dias de hoje.",
    url: "/blog/o-que-e-uma-igreja-reformada",
    type: "article",
    publishedTime: "2019-09-19T00:00:00.000Z",
    authors: ["Rev. Kenneth Wieske"],
    images: [
      {
        url: "/blog/o-que-e-uma-igreja-reformada-cover.webp",
        width: 1200,
        height: 630,
        alt: "A congregação da Igreja Reformada de Brasília",
      },
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
