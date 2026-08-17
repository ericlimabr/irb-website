import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

export const metadata: Metadata = {
  title: "Ministérios",
  description:
    "Os ministérios da Igreja Reformada de Brasília — nascidos da confissão, a serviço da edificação da congregação e do próximo.",
  alternates: { canonical: "/ministerios" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Ministérios", path: "/ministerios" },
        ]}
      />
      {children}
    </>
  )
}
