import type { Metadata } from "next"
import { ReactNode } from "react"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Confissão Belga",
  description:
    "A Confissão Belga (1561) — trinta e sete artigos que expõem a fé reformada, redigidos por Guido de Brès.",
}

export default function ConfissaoBelgaLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
