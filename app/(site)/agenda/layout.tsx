import type { Metadata } from "next"

// Página atrás de feature flag (agenda desligada): não indexar enquanto o
// conteúdo não estiver pronto. Remover o `robots` ao ativar a flag.
export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Cultos, estudos e eventos da Igreja Reformada de Brasília.",
  alternates: { canonical: "/agenda" },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
