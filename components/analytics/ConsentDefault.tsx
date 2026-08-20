import { analyticsEnabled } from "./GoogleTagManager"

/**
 * Google Consent Mode v2 — estado PADRÃO do consentimento, definido ANTES de a
 * GTM carregar.
 *
 * LGPD: nada de analytics ou marketing sem consentimento prévio. Este é um
 * <script> inline comum (não `next/script`), então executa na análise do HTML —
 * antes do script `afterInteractive` da GTM. Assim toda tag do Google já nasce
 * com o consentimento NEGADO e só dispara depois que o usuário aceita no banner
 * (`CookieConsent` → `setConsent` → `gtag('consent','update', …)`).
 *
 * `security_storage` e `functionality_storage` ficam 'granted' — são essenciais
 * ao funcionamento e não dependem de escolha (não rastreiam a pessoa).
 *
 * Quem já decidiu antes: lemos o cookie `irb_consent` aqui mesmo e, se for
 * 'granted', já emitimos o `update` — sem "flash" de negado para quem volta.
 *
 * `wait_for_update: 500` dá 500 ms para esse update chegar antes de a GTM
 * decidir o estado inicial das tags.
 */
export default function ConsentDefault() {
  if (!analyticsEnabled()) return null

  const inline = `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    personalization_storage:'denied',
    functionality_storage:'granted',
    security_storage:'granted',
    wait_for_update:500
  });
  try {
    var m = document.cookie.match(/(?:^|; )irb_consent=([^;]+)/);
    if (m && decodeURIComponent(m[1]) === 'granted') {
      gtag('consent','update',{
        ad_storage:'granted',
        ad_user_data:'granted',
        ad_personalization:'granted',
        analytics_storage:'granted',
        personalization_storage:'granted'
      });
    }
  } catch (e) {}
})();
`

  return <script id="consent-default" dangerouslySetInnerHTML={{ __html: inline }} />
}
