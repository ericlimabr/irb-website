import Analytics from "@/components/analytics/Analytics"
import PaginaEmManutencao from "@/components/pages/PaginaEmManutencao"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import { siteEmManutencao } from "@/lib/manutencao"
import { ReactNode } from "react"

/**
 * Layout dedicado das landing pages de campanha (tráfego pago).
 *
 * Diferente do site (app/(site)/layout.tsx), NÃO monta Navigation, BackBar nem
 * Footer: uma LP de conversão não oferece rotas de fuga, para não desperdiçar o
 * clique pago. Mas monta <Analytics /> (GTM + Consent Mode v2 + banner LGPD) —
 * senão a rota /campanha/* ficaria fora da medição, e é o GTM que registra a
 * visualização da página (objetivo da campanha) e os cliques de WhatsApp/rota
 * como eventos do Meta Pixel. A exceção "^/(admin|login)" da GTM não alcança
 * /campanha, então a cobertura vale aqui normalmente.
 *
 * Tem o portão de manutenção, como o layout do site: tirar o site do ar tira
 * também a landing page do tráfego pago. O clique continua sendo cobrado, e
 * cai numa tela de espera.
 */
export default async function CampanhaLayout({
  children,
}: {
  children: ReactNode
}) {
  if (await siteEmManutencao()) return <PaginaEmManutencao />

  return (
    <>
      <Analytics />
      {children}
      <WhatsAppButton />
    </>
  )
}
