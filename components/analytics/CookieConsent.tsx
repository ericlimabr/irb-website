"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getConsent, setConsent } from "@/utils/analytics"

type ConsentMetric = "shown" | "accept" | "reject"

/** Rolagem, em telas, que dispara a segunda chamada. */
const TELAS_PARA_RETOMAR = 1.5
/** Tempo sem decisão, em milissegundos, que dispara a segunda chamada. */
const ESPERA_PARA_RETOMAR = 15000

/**
 * Reporta a interação com o banner (exibido / aceitou / recusou) ao nosso
 * endpoint agregado. Roda ANTES do consentimento de propósito — medir o próprio
 * mecanismo é interesse legítimo, e não seta cookie nem manda PII: só o tipo do
 * clique e o contexto de marketing da URL (UTM/fbclid). `sendBeacon` garante o
 * envio mesmo se a pessoa sair logo depois.
 *
 * `retomada` marca os eventos da segunda chamada, para dar para separar depois
 * a decisão que o banner original ganhou da que só veio na insistência.
 */
function reportConsent(type: ConsentMetric, retomada = false) {
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
      retomada,
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
 * o banner não é respondido, o Consent Mode v2 mantém tudo NEGADO (ver
 * `ConsentDefault`), então nenhuma medição roda.
 *
 * Renderizado só quando a medição está ligada (gate no layout via
 * `analyticsEnabled`), logo não polui dev/preview.
 *
 * ## Duas fases, e por quê
 *
 * A tabela `consent_events` foi lida em 29/10/2026 e disse o seguinte: de 687
 * exibições, 119 aceitaram, 33 recusaram e **535 não decidiram nada**. Recusa
 * é 4,8%; indecisão é 77,9%. O problema nunca foi convencer quem recusa.
 *
 * Daí as duas fases:
 *
 * 1. **Inicial.** O banner inteiro, embaixo, com a explicação. No celular ele
 *    media 271 px, de 44% a 49% da tela, com os botões no fim do bloco e a
 *    explicação na frente deles. Agora os botões vêm primeiro no celular
 *    (`flex-col-reverse`), o texto curto substitui o longo em tela pequena, e
 *    a altura tem teto com rolagem própria.
 * 2. **Segunda chamada.** Quem rolou mais de uma tela e meia, ou passou 15
 *    segundos, sem decidir, recebe no lugar dele uma barra fina, de uma linha,
 *    que para de comer metade da tela e continua pedindo a decisão. Não é
 *    cookie wall: não bloqueia nada, e recusar continua do lado de aceitar.
 *
 * O que a segunda chamada ganha é medido à parte, pela coluna `retomada`.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [retomada, setRetomada] = useState(false)
  /** Guarda se a segunda chamada já foi medida, para não contar duas vezes. */
  const retomadaMedida = useRef(false)

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
    // porque não é uma exibição espontânea, e sim uma reabertura pedida. Volta
    // sempre na forma inteira: quem pediu para rever quer o texto, não a barra.
    const open = () => {
      setRetomada(false)
      setVisible(true)
    }
    window.addEventListener("irb:open-consent", open)
    return () => window.removeEventListener("irb:open-consent", open)
  }, [])

  useEffect(() => {
    if (!visible || retomada) return

    const retomar = () => {
      if (retomadaMedida.current) return
      retomadaMedida.current = true
      setRetomada(true)
      reportConsent("shown", true)
    }

    const aoRolar = () => {
      if (window.scrollY > window.innerHeight * TELAS_PARA_RETOMAR) retomar()
    }

    const relogio = window.setTimeout(retomar, ESPERA_PARA_RETOMAR)
    window.addEventListener("scroll", aoRolar, { passive: true })
    return () => {
      window.clearTimeout(relogio)
      window.removeEventListener("scroll", aoRolar)
    }
  }, [visible, retomada])

  const decide = (granted: boolean) => {
    reportConsent(granted ? "accept" : "reject", retomada)
    setConsent(granted)
    setVisible(false)
  }

  // Os dois botões, do mesmo tamanho nas duas fases. Aceitar em ouro cheio,
  // recusar em contorno: destaque visual sem diferença de esforço.
  const botoes = (compacto: boolean) => (
    <div className={`flex shrink-0 gap-3 ${compacto ? "" : "md:w-auto"}`}>
      <button
        type="button"
        onClick={() => decide(true)}
        className={`flex-1 font-mono uppercase tracking-[0.1em] bg-gold-500 text-navy-800 hover:bg-gold-400 transition-colors duration-500 md:flex-none ${
          compacto ? "px-4 py-2 text-2xs" : "px-5 py-3 text-2xs"
        }`}
      >
        Aceitar
      </button>
      <button
        type="button"
        onClick={() => decide(false)}
        className={`flex-1 font-mono uppercase tracking-[0.1em] border border-primary-foreground/30 text-primary-foreground/80 hover:border-primary-foreground/60 hover:text-primary-foreground transition-colors duration-500 md:flex-none ${
          compacto ? "px-4 py-2 text-2xs" : "px-5 py-3 text-2xs"
        }`}
      >
        Recusar
      </button>
    </div>
  )

  return (
    <AnimatePresence>
      {visible && !retomada && (
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
          className="pointer-events-none fixed inset-0 z-[85] bg-navy-900/40"
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
          // `max-h` com `dvh` e rolagem própria: a régua de altura que vale no
          // celular é a de agora, e não a maior. Sem teto, texto grande do
          // sistema empurra os botões para fora da tela.
          // O espaçamento de baixo respeita a área segura do iPhone, senão a
          // barrinha do gesto divide espaço com os botões.
          //
          // `z-90`, e não 60, por causa de um achado de 29/10/2026: a barra
          // presa no pé da /conferencia (`.presa`, em
          // app/conferencia/conferencia.css) tem z-index 80 e cobria a faixa
          // de baixo deste banner. Como os botões ficavam JUSTAMENTE ali,
          // quem rolava a página da conferência perdia o "aceitar" e o
          // "recusar" embaixo da barra de inscrição. Fica acima dela, e abaixo
          // do toast (z-100), que é o único que precisa vir por cima de tudo.
          className="fixed inset-x-0 bottom-0 z-[90] max-h-[70dvh] overflow-y-auto border-t-4 border-gold-500 bg-navy-800/95 backdrop-blur-sm"
          style={{
            paddingBottom: "max(0px, env(safe-area-inset-bottom))",
          }}
        >
          {retomada ? (
            <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-3">
              <p className="font-sans text-primary-foreground/70 text-sm leading-snug">
                Pode ativar os cookies de análise?{" "}
                <Link
                  href="/politica-de-privacidade"
                  className="whitespace-nowrap text-gold-400 underline underline-offset-4 hover:text-gold-500"
                >
                  Entenda
                </Link>
              </p>
              {botoes(true)}
            </div>
          ) : (
            // `flex-col-reverse` no celular: no DOM o texto vem primeiro, que é
            // a ordem de leitura certa, mas na tela os botões sobem para cima
            // dele. No desktop volta a ser uma linha só.
            <div className="container mx-auto flex flex-col-reverse gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 font-mono uppercase tracking-[0.1em] text-gold-400 text-fs-9">
                  Privacidade
                </p>
                <p className="font-sans text-primary-foreground/70 text-sm leading-relaxed">
                  {/* Texto curto no celular, completo a partir do desktop: o
                      parágrafo inteiro é o que fazia o banner ocupar metade da
                      tela pequena. */}
                  <span className="md:hidden">
                    Usamos cookies de análise e de medição dos nossos anúncios.
                    Nada é ativado sem a sua permissão.
                  </span>
                  <span className="hidden md:inline">
                    Usamos cookies e ferramentas de análise (Google Analytics,
                    Microsoft Clarity e Meta) para ver o que confunde quem chega
                    ao site, medir os nossos anúncios e melhorar as informações
                    sobre os cultos e como chegar até nós. Nada é ativado sem a
                    sua permissão.
                  </span>{" "}
                  Saiba mais na nossa{" "}
                  <Link
                    href="/politica-de-privacidade"
                    className="text-gold-400 underline underline-offset-4 hover:text-gold-500"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </div>
              {botoes(false)}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
