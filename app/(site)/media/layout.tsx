import type { Metadata } from "next"

// Página atrás de feature flag (mídia desligada): não indexar enquanto o
// conteúdo não estiver pronto. Remover o `robots` ao ativar a flag.
export const metadata: Metadata = {
  title: "Mídia",
  description:
    "Pregações expositivas e séries — arquivo de mensagens da Igreja Reformada de Brasília.",
  alternates: { canonical: "/media" },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
