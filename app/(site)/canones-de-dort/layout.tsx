import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"
import ArticleJsonLd from "@/components/seo/ArticleJsonLd"

export const metadata: Metadata = {
  title: "Cânones de Dort",
  description:
    "Os Cânones de Dort (1619) e os cinco pontos da graça soberana, definidos pelo Sínodo de Dordrecht em resposta à Remonstrância arminiana.",
  alternates: { canonical: "/canones-de-dort" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Confissões", path: "/confissoes" },
          { name: "Cânones de Dort", path: "/canones-de-dort" },
        ]}
      />
      <ArticleJsonLd
        headline="Cânones de Dort"
        description="Os Cânones de Dort (1619) e os cinco pontos da graça soberana, definidos pelo Sínodo de Dordrecht em resposta à Remonstrância arminiana."
        path="/canones-de-dort"
        articleSection="Confissões Reformadas"
        author={[
          {
            type: "Organization",
            name: "Sínodo de Dordrecht",
            sameAs: "https://pt.wikipedia.org/wiki/S%C3%ADnodo_de_Dordrecht",
          },
        ]}
        about={{
          name: "Cânones de Dort",
          datePublished: "1619",
          sameAs: "https://pt.wikipedia.org/wiki/C%C3%A2nones_de_Dort",
        }}
      />
      {children}
    </>
  )
}
