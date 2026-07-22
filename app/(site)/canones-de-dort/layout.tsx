import type { Metadata } from "next"
import { ReactNode } from "react"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Cânones de Dort",
  description:
    "Os Cânones de Dort (1619) — a resposta do Sínodo às Remonstrâncias, em quatro capítulos sobre a graça soberana de Deus.",
}

export default function CanonesDeDortLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
