import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

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
      {children}
    </>
  )
}
