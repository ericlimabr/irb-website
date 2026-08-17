import type { Metadata } from "next"

// Página atrás de feature flag (blog desligado): não indexar enquanto o
// conteúdo não estiver pronto. Remover o `robots` ao ativar a flag.
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos sobre a fé reformada, a vida cristã e o ministério confessional.",
  alternates: { canonical: "/blog" },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
