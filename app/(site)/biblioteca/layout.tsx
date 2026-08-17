import type { Metadata } from "next"

// Página atrás de feature flag (biblioteca desligada): não indexar enquanto o
// conteúdo não estiver pronto. Remover o `robots` ao ativar a flag.
export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Curadoria de obras fundamentais para o estudo da teologia reformada.",
  alternates: { canonical: "/biblioteca" },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
