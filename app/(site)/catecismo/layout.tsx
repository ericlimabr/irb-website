import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"
import ArticleJsonLd from "@/components/seo/ArticleJsonLd"

export const metadata: Metadata = {
  title: "Catecismo de Heidelberg",
  description:
    "O Catecismo de Heidelberg (1563): o único consolo na vida e na morte, em 129 perguntas e respostas ao longo de 52 Domingos.",
  alternates: { canonical: "/catecismo" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Confissões", path: "/confissoes" },
          { name: "Catecismo de Heidelberg", path: "/catecismo" },
        ]}
      />
      <ArticleJsonLd
        headline="Catecismo de Heidelberg"
        description="O Catecismo de Heidelberg (1563): o único consolo na vida e na morte, em 129 perguntas e respostas ao longo de 52 Domingos."
        path="/catecismo"
        articleSection="Confissões Reformadas"
        author={[{ name: "Zacarias Ursino" }, { name: "Caspar Oleviano" }]}
        about={{
          name: "Catecismo de Heidelberg",
          datePublished: "1563",
          sameAs: "https://pt.wikipedia.org/wiki/Catecismo_de_Heidelberg",
        }}
      />
      {children}
    </>
  )
}
