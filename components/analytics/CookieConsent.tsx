"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getConsent, setConsent } from "@/utils/analytics"

type ConsentMetric = "shown" | "accept" | "reject"

/**
 * Reporta a interação com o banner (exibido / aceitou / recusou) ao nosso
 * endpoint agregado. Roda ANTES do consentimento de propósito — medir o próprio
 * mecanismo é interesse legítimo, e não seta cookie nem manda PII: só o tipo do
 * clique e o contexto de marketing da URL (UTM/fbclid). `sendBeacon` garante o
 * envio mesmo se a pessoa sair logo depois.
 */
function reportConsent(type: ConsentMetric) {
  if (typeof window === "undefined") return
  // Fora de produção o banner é renderizado só para inspeção visual —
  // não medir nem escrever no banco de produção.
  if (process.env.NODE_ENV !== "production") return
  try {
    const params = new URLSearchParams(window.location.search)
    const isCampaign =
      params.has("fbclid") ||
      params.has("gclid") ||
      [...params.keys()].some((k) => k.startsWith("utm_"))

    const payload = JSON.stringify({
      type,
      source: isCampaign ? "campaign" : "organic",
      campaign: params.get("utm_campaign") ?? undefined,
      path: window.location.pathname,
    })

    const url = "/api/consent-metric"
    const blob = new Blob([payload], { type: "application/json" })
    if (!navigator.sendBeacon?.(url, blob)) {
      void fetch(url, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Medição nunca pode quebrar o banner.
  }
}

/**
 * Banner de consentimento de cookies (LGPD).
 *
 * Só aparece para quem ainda não decidiu (`getConsent() === null`). "Aceitar"
 * vem primeiro (à esquerda) como leve destaque, mas "Recusar" mantém o MESMO
 * tamanho e a mesma visibilidade — a LGPD exige que recusar seja tão fácil
 * quanto aceitar, e isso é sobre igualdade de esforço, não de posição. Enquanto
 * o banner não é respondido, o Consent Mode v2
 * mantém tudo NEGADO (ver `ConsentDefault`), então nenhuma medição roda.
 *
 * Renderizado só quando a medição está ligada (gate no layout via
 * `analyticsEnabled`), logo não polui dev/preview.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // O cookie só existe no cliente. Ler aqui (e não durante o render) mantém o
    // banner FORA do HTML do SSR, evitando hydration mismatch para quem já
    // decidiu. Este set no efeito é intencional.
    if (getConsent() === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
      reportConsent("shown")
    }
  }, [])

  useEffect(() => {
    // Reabertura sob demanda: o link "Gerenciar cookies" do rodapé dispara este
    // evento para quem JÁ decidiu poder mudar/retirar o consentimento (LGPD:
    // retirar tem de ser tão fácil quanto conceder). Não remede como "shown"
    // porque não é uma exibição espontânea, e sim uma reabertura pedida.
    const open = () => setVisible(true)
    window.addEventListener("irb:open-consent", open)
    return () => window.removeEventListener("irb:open-consent", open)
  }, [])

  const decide = (granted: boolean) => {
    reportConsent(granted ? "accept" : "reject")
    setConsent(granted)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        // Escurecimento da tela inteira para focar a atenção no banner.
        // `pointer-events-none` é OBRIGATÓRIO: sem ele o overlay bloquearia o
        // site e viraria cookie wall (proibido pela LGPD). Assim ele SÓ escurece
        // — o conteúdo continua clicável por trás. `aria-hidden`: leitor de tela ignora.
        <motion.div
          key="cookie-scrim"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[55] bg-navy-900/40"
        />
      )}
      {visible && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-label="Aviso de privacidade e cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[60] border-t-4 border-gold-500 bg-navy-800/95 backdrop-blur-sm"
        >
          <div className="container mx-auto flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 font-mono uppercase tracking-[0.1em] text-gold-400 text-fs-9">
                Privacidade
              </p>
              <p className="font-sans text-primary-foreground/70 text-sm leading-relaxed">
                Usamos cookies e ferramentas de análise (Google Analytics e
                Microsoft Clarity) para ver o que confunde quem chega ao site e
                melhorar as informações sobre os cultos e como chegar até nós.
                Nada é ativado sem a sua permissão. Saiba mais na nossa{" "}
                <Link
                  href="/politica-de-privacidade"
                  className="text-gold-400 underline underline-offset-4 hover:text-gold-500"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide(true)}
                className="font-mono uppercase tracking-[0.1em] bg-gold-500 px-5 py-3 text-navy-800 hover:bg-gold-400 transition-colors duration-500 text-2xs"
              >
                Aceitar
              </button>
              <button
                type="button"
                onClick={() => decide(false)}
                className="font-mono uppercase tracking-[0.1em] border border-primary-foreground/30 px-5 py-3 text-primary-foreground/80 hover:border-primary-foreground/60 hover:text-primary-foreground transition-colors duration-500 text-2xs"
              >
                Recusar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
