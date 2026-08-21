import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"
import ArticleJsonLd from "@/components/seo/ArticleJsonLd"

export const metadata: Metadata = {
  title: "Confissão Belga (1561)",
  description:
    "A Confissão Belga: 37 artigos que expõem a fé reformada, escritos por Guido de Brès em 1561. Texto, história e contexto.",
  alternates: { canonical: "/confissao-belga" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Confissões", path: "/confissoes" },
          { name: "Confissão Belga", path: "/confissao-belga" },
        ]}
      />
      <ArticleJsonLd
        headline="Confissão Belga (1561)"
        description="A Confissão Belga: 37 artigos que expõem a fé reformada, escritos por Guido de Brès em 1561. Texto, história e contexto."
        path="/confissao-belga"
        articleSection="Confissões Reformadas"
        author={[{ name: "Guido de Brès" }]}
        about={{
          name: "Confissão Belga",
          datePublished: "1561",
          sameAs: "https://pt.wikipedia.org/wiki/Confiss%C3%A3o_Belga",
        }}
      />
      {children}
    </>
  )
}
