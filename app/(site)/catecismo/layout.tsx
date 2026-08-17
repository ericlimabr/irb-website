import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

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
      {children}
    </>
  )
}
