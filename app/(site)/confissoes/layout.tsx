import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

export const metadata: Metadata = {
  title: "Três Formas de Unidade",
  description:
    "As confissões reformadas que unem a igreja através dos séculos: a Confissão Belga, o Catecismo de Heidelberg e os Cânones de Dort.",
  alternates: { canonical: "/confissoes" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Confissões", path: "/confissoes" },
        ]}
      />
      {children}
    </>
  )
}
