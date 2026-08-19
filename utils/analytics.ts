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
  }
}

export function trackEvent(payload: DataLayerEvent) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
}
