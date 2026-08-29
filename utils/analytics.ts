/**
 * Push de eventos para o dataLayer da GTM.
 *
 * Cliques de link de saída (WhatsApp `wa.me`, rota `/maps/dir`, YouTube) são
 * captados por triggers **nativos de Click** da GTM — casam pela URL de destino,
 * não passam por aqui. Este helper é só para o que a GTM não pega sozinha: hoje,
 * o sucesso do formulário de contato, que é uma server action (o trigger nativo
 * de "Form Submission" não dispara de forma confiável nesse caso).
 *
 * Os nomes de `event` aqui são o **contrato** que a GTM escuta como Custom Event.
 */
type DataLayerEvent = { event: "contact_form_submit" }

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    // Definido por `ConsentDefault` (Consent Mode v2). Empurra os argumentos no
    // formato que a GTM/Google leem para `consent`.
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
}

/**
 * Nome do cookie de consentimento, COM versão no nome.
 *
 * Bump da versão = "reexibir o banner para todos". Quando o texto do banner
 * muda de forma material (o que a pessoa consente muda), incremente o sufixo:
 * o cookie antigo deixa de casar, `getConsent()` volta a `null` e quem já tinha
 * decidido reencontra o banner e decide de novo sob o texto novo. Até re-aceitar,
 * o Consent Mode mantém tudo negado (comportamento conservador correto).
 *
 * Histórico: v2 em 2026-08-29 (novo texto com o benefício concreto da visita).
 */
export const CONSENT_COOKIE = "irb_consent_v2"
type ConsentValue = "granted" | "denied"

/**
 * Registra a decisão do usuário no banner de cookies (LGPD).
 *
 * `granted` libera analytics + marketing; `denied` mantém tudo negado (só o
 * essencial roda). Emite o `consent → update` do Consent Mode v2 — que as tags
 * do Google (GA4, Ads) leem nativamente — e persiste a escolha por 1 ano, para
 * o banner não reaparecer e para `ConsentDefault` reaplicar no próximo acesso.
 */
export function setConsent(granted: boolean) {
  if (typeof window === "undefined") return
  const value: ConsentValue = granted ? "granted" : "denied"

  window.dataLayer = window.dataLayer ?? []
  const dataLayer = window.dataLayer
  const gtag = window.gtag ?? ((...args: unknown[]) => dataLayer.push(args as never))
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
    personalization_storage: value,
  })

  // A preferência em si não é dado pessoal sensível — é a escolha do titular.
  // Validade de 6 meses (re-consentimento) — 15552000s = 180 dias.
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=15552000; SameSite=Lax`
}

/** Escolha já registrada, ou `null` se o usuário ainda não decidiu. */
export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + CONSENT_COOKIE + "=([^;]+)"),
  )
  return m ? (decodeURIComponent(m[1]) as ConsentValue) : null
}
