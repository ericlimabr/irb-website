import type { Metadata } from "next"
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd"

export const metadata: Metadata = {
  title: "Doutrina Reformada",
  description:
    "As doutrinas da graça e a fé reformada respondidas pela Palavra e fundamentadas nas confissões históricas.",
  alternates: { canonical: "/doutrina" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: "/" },
          { name: "Doutrina", path: "/doutrina" },
        ]}
      />
      {children}
    </>
  )
}
