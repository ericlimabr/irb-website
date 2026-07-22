import type { Metadata } from "next"
import { ReactNode } from "react"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Catecismo de Heidelberg",
  description:
    "O Catecismo de Heidelberg (1563) — o único consolo na vida e na morte, em 52 Domingos e 129 perguntas e respostas.",
}

export default function CatecismoLayout({ children }: { children: ReactNode }) {
  return children
}
