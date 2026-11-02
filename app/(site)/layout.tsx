import Analytics from "@/components/analytics/Analytics"
import BackBar from "@/components/layout/BackBar"
import Footer from "@/components/layout/Footer"
import Navigation from "@/components/layout/Navigation"
import PaginaEmManutencao from "@/components/pages/PaginaEmManutencao"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import { siteEmManutencao } from "@/lib/manutencao"
import { ReactNode } from "react"

/**
 * O portão de manutenção mora aqui, e não no proxy.ts: o estado vem do banco
 * por Prisma, e proxy roda na borda, onde Prisma não vai. Como ele está no
 * layout, o `children` nem é renderizado quando o site está fora do ar: a
 * página abaixo não executa, e nenhuma consulta dela sai.
 *
 * As outras rotas públicas (/conferencia, /campanha, /links) têm o mesmo
 * portão, cada uma no seu arquivo. /admin, /login e as rotas de API ficam de
 * fora de propósito: é por elas que a igreja devolve o site ao ar.
 */
export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode
}) {
  if (await siteEmManutencao()) return <PaginaEmManutencao />

  return (
    <>
      <Analytics />
      <Navigation />
      <BackBar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}
