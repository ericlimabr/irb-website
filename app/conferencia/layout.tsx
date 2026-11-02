import Analytics from "@/components/analytics/Analytics"
import PaginaEmManutencao from "@/components/pages/PaginaEmManutencao"
import { siteEmManutencao } from "@/lib/manutencao"
import { ReactNode } from "react"

/**
 * Layout da página da conferência.
 *
 * Como o layout de campanha, NÃO monta Navigation nem Footer: é uma página de
 * um evento, e a inscrição é a única coisa que ela pede. Diferente da
 * campanha, esta página é indexável e entra no sitemap, porque quem procura
 * "conferência reformada Brasília" tem que achá-la.
 *
 * Monta <Analytics /> (GTM + Consent Mode + banner LGPD) pelo mesmo motivo de
 * lá: sem ele a rota ficaria fora da medição.
 *
 * Não monta o WhatsAppButton: a barra presa no pé da tela
 * (components/pages/conferencia/BarraInscricao.tsx) ocupa esse canto, e os
 * dois juntos se cobrem no celular.
 *
 * Tem o portão de manutenção, como o layout do site: quando a igreja tira o
 * site do ar, esta página sai também. Ela é destino de anúncio pago, então
 * vale saber disso antes de ligar o interruptor.
 */
export default async function ConferenciaLayout({
  children,
}: {
  children: ReactNode
}) {
  if (await siteEmManutencao()) return <PaginaEmManutencao />

  return (
    <>
      <Analytics />
      {children}
    </>
  )
}
